import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container, Paper, Typography, Button, FormControlLabel, Switch } from '@mui/material';
import airobot from '../assets/Character.png';
import React, { useState, useEffect } from 'react';

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


export default function StoryBox() {
  const [messages, setMessages] = useState([]);
  const [messageIndex, setMessageIndex] = useState(0);
  const [accessToken, setAccessToken] = useState(null);


  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storyId = localStorage.getItem('storyId');
    const nextStoryId = localStorage.getItem('nextStoryId');
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
          
        }));

        setMessages(initialMessages);
      })
      .catch((error) => {
        console.error('초기 스토리 불러오기 오류:', error);
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
            console.log(res);

            if (res === 3) {
              window.location.href = "/code";
            }
            if (res === 2) {
              window.location.href = "/quiz";
            }

            const newMessages = data.data.map((message) => ({
              speaker: message.speaker,
              text: message.text,
              currentStoryId: message.story.id,
              nextStoryId: message.story.nextId,
              formatId: message.story.formatId
            }));

            setMessages([...messages, ...newMessages]);
          })
          .catch((error) => {
            console.error('다음 스토리 불러오기 오류:', error);
          });
      }
    }
  };


  return (
    <div
      style={{
        background: 'black',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={handleNextMessage}
    >
      <Container maxWidth="xl">
        <Grid 
            container 
            justifyContent="center" 
            alignItems="center" 
            style={{ height:'100vh', 
                          backgroundColor: 'black',
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center', 
                          justifyContent: 'center'
                      }}
            >

              
              <img 
                  src={airobot}
                  alt="AI Robot"
                  style={{
                      // alignSelf: 'center',
                      width: '250px',
                      height: '250px',
                  }}
              />


            {messages.length > 0 && (
                <div>
                  <Typography variant="h4" style={{ textAlign: 'center', color: 'white', marginTop: '100px' }}>
                    {messages[messageIndex].speaker === 'AI' ? messages[messageIndex].speaker : ''}
                  </Typography>
                  <Typography variant="h5" style={{ textAlign: 'center', color: 'white', marginTop: '100px' }}>
                    {messages[messageIndex].speaker === 'AI' ? messages[messageIndex].text : ''}
                  </Typography>
                
                  <Typography variant="h4" style={{ textAlign: 'center', color: '#34C759', marginTop: '100px' }}>
                    {messages[messageIndex].speaker === 'USER' ? messages[messageIndex].speaker : ''}
                  </Typography>
                  <Typography variant="h5" style={{ textAlign: 'center', color: '#34C759', marginTop: '100px' }}>
                    {messages[messageIndex].speaker === 'USER' ? messages[messageIndex].text : ''}
                  </Typography>
                </div>
            )}





              <Grid 
                container 
                justifyContent="flex-end" 
                style={{
                  position: 'fixed',  
                  bottom: '20px',     
                  right: '20px',      
                }}
              >
              <Button
                  color="primary"
                  type="submit"
                  variant="outlined"
                  onClick={handleNextMessage}
                  style={{ backgroundColor: 'black', color: '#34C759' }} 
                  >
                  Next
              </Button>
              </Grid>
        </Grid>
      </Container>
    </div>
  );
}