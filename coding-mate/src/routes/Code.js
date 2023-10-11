import React,{ useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Container, Paper, Typography, Button, FormControlLabel, Switch, Input } from '@mui/material';
import { EditorState } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { defaultKeymap, indentWithTab } from '@codemirror/commands'
import { python } from '@codemirror/lang-python'
import { basicDark } from '@uiw/codemirror-theme-basic';
import { basicSetup } from '@uiw/codemirror-extensions-basic-setup';
import someModule from '@codemirror/state';
import airobot from '../assets/Character.png';

const fetchStory = (storyId, accessToken) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    };
  
    return fetch(`http://3.37.164.99/api/story/${storyId}`, requestOptions)
      .then((response) => response.json())
      .then((data) => data)
      .catch((error) => {
        console.error('스토리 불러오기 오류:', error);
        throw error;
      });
  };
  
  const fetchSave = (nextStoryId, accessToken) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    myHeaders.append("Content-Type", "application/json");
  
    var raw = JSON.stringify({
      "nextStoryId" : nextStoryId
    });
    
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
  
    return fetch(`http://3.37.164.99/api/story/save`, requestOptions) 
      .then((response) => response.json())
      .then((data) => data)
      .catch((error) => {
        console.error('스토리 불러오기 오류:', error);
        throw error;
      });
  };

export default function Code() {
    const navigate = useNavigate();
    const [userInput, setUserInput] = useState('');
    const [messages, setMessages] = useState([]);
    let [messageIndex, setMessageIndex] = useState(0);
    const [accessToken, setAccessToken] = useState(null);
    const editor = useRef()
    const [code, setCode] = useState('')
    const [output, setOutput] = useState('');
    const [localInput, setLocalInput] = useState(false);

    const handleCodeSubmit = async () => { 
        messageIndex +=1;

        if (messages[messageIndex].speaker === 'USER' && messages[messageIndex].text === '(사용자 입력)') {
            const storyId = localStorage.getItem("currentStoryId");
            
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${accessToken}`);
            myHeaders.append("Content-Type", "application/json");
        
            var raw = JSON.stringify({
                "input": userInput,
                "storyId": storyId
            });
            
            const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
            };

            fetch("http://3.37.164.99/api/code/execute", requestOptions)
                .then(response => response.json())
                .then(result => {
                    const codeInputResult = result.data;
                    
                    localStorage.setItem("codeResult", codeInputResult);
                    console.log(localStorage.getItem("codeResult"));
                    setOutput(localStorage.getItem("codeResult"));
                })

                
                .catch(error => console.log('error', error));


        }

        if (messages[messageIndex].speaker === 'USER' && messages[messageIndex].text === '(코드 실행)') {
            setOutput(localStorage.getItem("codeResult")); 
            
            
        }

        setMessageIndex(messageIndex);
    };

    const onUpdate = EditorView.updateListener.of((v) => {
        setCode(v.state.doc.toString())
    })

    const formatCode = (rawCode) => {
        const formattedCode = rawCode.replace(/'/g, "\\'")
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
            .replace(/   /g, '\\t');
        return formattedCode;
    }


    useEffect(() => {
        const extensions = [
            keymap.of([defaultKeymap, indentWithTab]),
            basicDark,
            onUpdate,
            python(),
            basicSetup({
                foldGutter: true,
                dropCursor: true,
                indentOnInput: true,
                allowMultipleSelections: true,
                autocompletion : true,
                bracketMatching : true,
                highlightSelectionMatches : true,
                searchKeymap : true,
                highlightActiveLine : true,
                tabSize : 3,
            }),
            
        ];

        const startState = EditorState.create({
            doc: localStorage.getItem("code"),
            extensions : extensions,
        })

        const view = new EditorView({ 
            state: startState, parent: editor.current 
        })
    
        return () => {
          view.destroy()
        }
    }, [localStorage.getItem("code")]);


    useEffect(() => {
        
        const token = localStorage.getItem('accessToken');
        const nextStoryId = localStorage.getItem("nextStoryId");
        if (!token) {
          console.error('AccessToken이 없습니다.');
          return;
        }
        setAccessToken(token);
    
        fetchStory(3, token) //nextStoryId
          .then((data) => {
            const initialMessages = data.data.map((message) => ({
              speaker: message.speaker,
              text: message.text,
              currentStoryId: message.story.id,
              nextStoryId: message.story.nextId,
              code: message.code,
              codeResult: message.result,
              isInput: message.isInput,
              flag:message.flag,
            }));

            setLocalInput(initialMessages[0].isInput); 
            localStorage.setItem("currentStoryId", initialMessages[0].currentStoryId);
            localStorage.setItem("code", initialMessages[0].code);
            localStorage.setItem("codeResult", initialMessages[0].codeResult);
            localStorage.setItem("codeIsInput", initialMessages[0].isInput);
            setMessages(initialMessages);
          })
          .catch((error) => {
            console.error('진행해야 할 스토리 불러오기 오류:', error);
          });
      }, []);



    const handleNextMessage = () => {
    if (messageIndex < messages.length - 1) { 
        setMessageIndex(messageIndex + 1);
    } else {
        const currentStoryId = messages[messageIndex]?.currentStoryId;
        const nextStoryId = messages[messageIndex]?.nextStoryId;
        
        localStorage.setItem("nextStoryId", nextStoryId);

        if (currentStoryId && nextStoryId) { 
        fetchSave(nextStoryId, accessToken) 
            .then((data) => {
            var saveMessages = data.message;
            saveMessages = "자동저장 되었습니다.";
            window.alert(saveMessages);
            });

        fetchStory(nextStoryId, accessToken) 
            .then((data) => {

                const res = data.data[0].story.formatId;

                if (res === 1) {
                window.location.href = "/main";
                }
                if (res === 2) {
                window.location.href = "/quiz";
                }

                setMessageIndex(messageIndex + 1); 
                const newMessages = data.data.map((message) => ({
                    speaker: message.speaker,
                    text: message.text,
                    currentStoryId: message.story.id,
                    nextStoryId: message.story.nextId,
                    formatId: message.story.formatId,
                    code: message.code,
                    codeResult: message.result,
                    isInput: message.isInput,
            }));

            setLocalInput(newMessages[0].isInput);
            localStorage.setItem("currentStoryId", nextStoryId);
            localStorage.setItem("codeIsInput", newMessages[0].isInput);
            localStorage.setItem("code", newMessages[0].code);
            localStorage.setItem("codeResult", newMessages[0].codeResult);
            setOutput(newMessages[0].codeResult);
            navigate('/code');

            

            setMessages([...messages, ...newMessages]);
            })
            .catch((error) => {
            console.error('다음 스토리 불러오기 오류:', error);
            });
        }
    }
    };


    
    return (
        <div>
            <div style={{ 
                background: 'black', 
                minHeight: '100vh', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center', 
            }}>
            <Container maxWidth="xl" >
                <Grid container justifyContent="center" alignItems="center" >
                    <div style={{ flex:1, padding: '16px'}}>
                            <Grid container justifyContent="center" alignItems="center" >
                                <Grid item lg={1}>
                                    <img 
                                        src={airobot}
                                        alt="AI Robot"
                                        style={{
                                            alignSelf: 'center',
                                            width: '130px',
                                            height: '130px',
                                        }}
                                    />
                                </Grid>
                                <Grid item lg={4}>
                                    <Typography variant="h3" style={{color:'white'}}>이름을 입력해보자!</Typography>
                                </Grid>
                            </Grid>
                            
                            <div>
                                <Tooltip title="입력된 코드는 여기서 볼 수 있어!" arrow>
                                    <IconButton edge="end">
                                        <HelpOutlineIcon style={{ color: 'white' }} />
                                    </IconButton>
                                </Tooltip>
                                <Paper ref={editor}></Paper>  
                            </div>

                            <div style={{ marginTop: '30px', marginBottom: '20px' }}>
                                <TextField
                                    
                                    label="입력"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={2}
                                    value={userInput} 
                                    onChange={(e) => setUserInput(e.target.value)}
                                    InputProps={{
                                        style: {
                                            color: 'white',
                                            paddingTop: '10px',
                                            paddingBottom: '10px',
                                        },
                                        endAdornment : (
                                            <InputAdornment position="start">
                                            <Tooltip title="컴퓨터에게 명령하고 싶으면 클릭하고 여기에 입력하면 돼!" arrow>
                                                <IconButton edge="end">
                                                    <HelpOutlineIcon style={{ color: 'white' }} />
                                                </IconButton>
                                            </Tooltip>
                                            </InputAdornment>
                                        ),
                                    }}
                                
                                
                                
                                
                                />
                            </div>

                            
                            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                                <TextField
                                    label="코드 실행 결과 확인"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={5}
                                    value={output || ''}
                                    InputProps={{
                                        readOnly: true,
                                        style: {
                                            color: 'white',
                                            paddingTop: '10px',
                                            paddingBottom: '10px',
                                        },
                                        endAdornment : (
                                            <InputAdornment position="start">
                                            <Tooltip title="여기에 컴퓨터에게 명령한 코드의 실행 결과가 출력돼!" arrow>
                                                <IconButton edge="end">
                                                    <HelpOutlineIcon style={{ color: 'white' }} />
                                                </IconButton>
                                            </Tooltip>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                            <div>
                                <pre style={{ whiteSpace: 'pre-wrap' }}> </pre> {/**{output} */}
                            </div>

                   

                            {messages.length > 0 && (
                            <div>
                                {messages[messageIndex].speaker === 'AI' && (
                                <div>
                                    <Typography variant="h4" style={{ textAlign: 'center', color: 'white', marginTop: '100px' }}>
                                    {messages[messageIndex].speaker}
                                    </Typography>
                                    <Typography variant="h5" style={{ textAlign: 'center', color: 'white', marginTop: '100px' }}>
                                    {messages[messageIndex].text}
                                    </Typography>
                                </div>
                                )}
                                
                                {messages[messageIndex].speaker === 'USER' && (
                                <div>
                                    {(messages[messageIndex].text !== "(코드 실행)" && messages[messageIndex].text !== "(사용자 입력)") && (
                                    <div>
                                        <Typography variant="h4" style={{ textAlign: 'center', color: '#34C759', marginTop: '100px' }}>
                                        {messages[messageIndex].speaker}
                                        </Typography>
                                        <Typography variant="h5" style={{ textAlign: 'center', color: '#34C759', marginTop: '100px' }}>
                                        {messages[messageIndex].text}
                                        </Typography>
                                    </div>
                                    )}
                                </div>
                                )}
                            </div>
                            )}










                            <Grid container justifyContent="flex-end" style={{marginTop: '50px'}}>
                                <Paper style={{ display: 'flex' }}>
                                    <div style = {{ flex: 1 }}>
                                        <Button
                                            color="primary"
                                            type="submit"
                                            variant="outlined"
                                            onClick={handleNextMessage}
                                            style={{ backgroundColor: 'black', color: '#34C759' }} 
                                            >
                                            Next
                                        </Button>
                                    </div>
                                    <div style = {{ flex: 2 }}>
                                        <Button
                                            color="primary"
                                            type="submit"
                                            variant="outlined"
                                            // onClick={(event) => handleCodeSubmit(event)}
                                            onClick={handleCodeSubmit}
                                            style={{ backgroundColor: 'black', color: '#34C759' }} 
                                            >
                                            코드 실행
                                        </Button>
                                    </div>
                                </Paper>
                            </Grid>




                    </div>

                </Grid>
                    
            
            </Container>
            </div>  
        </div>     
    );
}