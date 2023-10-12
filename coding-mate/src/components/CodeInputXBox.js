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
import { EditorView, keymap, highlightActiveLine } from '@codemirror/view'
import { defaultKeymap, indentWithTab } from '@codemirror/commands'
import { python } from '@codemirror/lang-python'
import { basicDark } from '@uiw/codemirror-theme-basic';
import { xcodeLight, xcodeDark } from '@uiw/codemirror-theme-xcode';
import { basicSetup } from '@uiw/codemirror-extensions-basic-setup';
import someModule from '@codemirror/state';

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



export default function CodeInputXBox() {
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

    useEffect(() => {
        const extensions = [
            keymap.of([defaultKeymap, indentWithTab]),
            xcodeDark,
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
            highlightActiveLine(),
            
        ];

        const viewportMargin = 19;

        const startState = EditorState.create({
            doc: `${localStorage.getItem("code")}\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n`,
            extensions : extensions,
        })

        const view = new EditorView({ 
            state: startState, 
            parent: editor.current,
            autoRefresh: false,
            viewportMargin,
        })
    
        return () => {
          view.destroy()
        }
    }, [localStorage.getItem("code")]);


    useEffect(() => {
        
        const token = localStorage.getItem('accessToken');
        const nextStoryId = localStorage.getItem("nextStoryId");
        const storyId = localStorage.getItem("storyId");
        if (!token) {
          console.error('AccessToken이 없습니다.');
          return;
        }
        setAccessToken(token);
    
        fetchStory(nextStoryId, token) 
          .then((data) => {
            const initialMessages = data.data.map((message) => ({
              speaker: message.speaker,
              text: message.text,
              currentStoryId: message.story.id,
              nextStoryId: message.story.nextId,
              formatId: message.story.formatId,
              code: message.code,
              codeResult: message.result,
              isInput: message.isInput,
              flag:message.flag,
            }));

            setLocalInput(initialMessages[0].isInput); 
            localStorage.setItem("formatId", initialMessages[0].formatId);
            localStorage.setItem("currentStoryId", initialMessages[0].currentStoryId);
            localStorage.setItem("code", initialMessages[0].code);
            localStorage.setItem("codeResult", initialMessages[0].codeResult);
            localStorage.setItem("codeIsInput", initialMessages[0].isInput);
            setMessages(initialMessages);

            if(localStorage.getItem("formatId") == 3 && localStorage.getItem("codeIsInput") == 'false') {
                navigate('/inputfalse');
            } else {
                navigate('/inputtrue');
            }

            if (localStorage.getItem("formatId") == 1) navigate('/main');
            if (localStorage.getItem("formatId") == 2) navigate('/quiz');


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
            }}
           

            >
                <Container maxWidth="xl" >
                    <Grid container justifyContent="center" alignItems="center" >
                        <div style={{ flex: 1, padding: '16px' }}>
                            <Grid container justifyContent="center" alignItems="center" >
                                <Grid item lg={4}>
                                    <Typography variant="h3" style={{ color: 'white' }}>print문 이해하기</Typography>
                                </Grid>
                            </Grid>

                           
                            <Grid container justifyContent="space-between" style={{ marginTop: '70px', marginBottom: '20px' }}>
                               
                                <Grid item xs={6} style={{ paddingLeft: '8px', paddingRight: '8px', backgroundColor: 'white' }}>

                                    <Grid container justifyContent="space-between" style={{ marginTop: '10px', marginBottom: '10px' }}>
                                        <Grid item>
                                            <Tooltip title="입력된 코드는 여기서 볼 수 있어!" arrow>
                                                <IconButton edge="end">
                                                    <HelpOutlineIcon style={{ color: 'black' }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>

                                        <Grid item>
                                            <Button
                                                color="primary"
                                                type="submit"
                                                variant="outlined"
                                                onClick={handleCodeSubmit}
                                                style={{ backgroundColor: 'white', color: '#34C759' }}
                                            >
                                                RUN ▶️
                                            </Button>
                                        </Grid>

                                    </Grid>

                                    <Grid style={{ paddingBottom: '10px'}}>
                                        <Paper ref={editor} style={{ height: '100%' }}></Paper>
                                    </Grid>
                                </Grid>

                                <Grid item xs={6} style={{ paddingLeft: '8px', paddingRight: '8px', backgroundColor: 'white' }}>
                                    <Grid container justifyContent="space-between" style={{ marginTop: '10px', marginBottom: '10px' }}>
                                        <Grid item xs={9}>
                                            {/* 여백 */}
                                        </Grid>
                                        <Grid item xs={3} container alignItems="center" justifyContent="flex-end">
                                            <Tooltip title="여기에 컴퓨터에게 명령한 코드의 실행 결과가 출력돼!" arrow>
                                                <IconButton edge="end">
                                                    <HelpOutlineIcon style={{ color: 'black' }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                    </Grid>

                                    <Grid style={{ paddingBottom: '10px'}}>
                                        <TextField
                                            label="코드 실행 결과 확인"
                                            variant="outlined"
                                            fullWidth
                                            multiline
                                            rows={15.4}
                                            
                                            
                                            value={output || ''}
                                            InputProps={{
                                                readOnly: true,
                                                style: {
                                                    color: 'white',
                                                    backgroundColor: 'black',
                                                    paddingTop: '10px',
                                                    paddingBottom: '10px',
                                                },
                                            }}
                                        />
                                    </Grid>
                                </Grid>

                            </Grid>

                            

                            {messages.length > 0 && (
                                <div style={{
                                    width: '100%',
                                    textAlign: 'center',
                                    background: `linear-gradient(to bottom, transparent 1%, #666,  #666, transparent 99% )`,
                                    marginTop: '50px',
                                }}>
                                    {messages[messageIndex].speaker === 'AI' && (
                                        <div>
                                            <Typography variant="h4" style={{ textAlign: 'center', color: 'white', marginTop: '70px' }}>
                                                {messages[messageIndex].speaker}
                                            </Typography>
                                            <Typography variant="h5" style={{ textAlign: 'center', color: 'white', marginTop: '10px', marginBottom:'70px' }}>
                                                {messages[messageIndex].text}
                                            </Typography>
                                        </div>
                                    )}

                                    {messages[messageIndex].speaker === 'USER' && (
                                        <div>
                                            {(messages[messageIndex].text !== "(코드 실행)" && messages[messageIndex].text !== "(사용자 입력)") && (
                                                <div>
                                                    <Typography variant="h4" style={{ textAlign: 'center', color: '#34C759', marginTop: '70px' }}>
                                                        {messages[messageIndex].speaker}
                                                    </Typography>
                                                    <Typography variant="h5" style={{ textAlign: 'center', color: '#34C759', marginTop: '10px', marginBottom:'70px' }}>
                                                        {messages[messageIndex].text}
                                                    </Typography>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}



                            
                        </div>
                    </Grid>



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
                            
                        </Paper>
                    </Grid>




                </Container>
            </div>
        </div>



    );
}