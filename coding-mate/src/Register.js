import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navbar from './Navbar';

export default function Register() {
  
  return (
    <div>
      <Navbar></Navbar>
      <Container maxWidth="lg">
        <Box sx={{  background: '#f5f5f5', padding: '16px', textAlign: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'red' }}>
            이용약관 동의
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'black' }}>
            아래 내용을 모두 읽고 약관에 동의해주세요
          </Typography>
        </Box>
        <Divider sx={{ marginTop: '16px', marginBottom: '16px' }} />

        <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          이용약관
        </Typography>
        <Box
          sx={{
            border: '1px solid black',
            borderRadius: '4px',
            padding: '200px',
            marginTop: '16px',
            marginBottom: '16px',
          }}
        >
          이용약관 내용이 여기에 표시됩니다.
        </Box>
        <Box
          sx={{
            border: '1px solid black',
            borderRadius: '4px',
            padding: '30px',
            marginTop: '16px',
            marginBottom: '16px',
            alignItems: 'center',
          }}
        >
          <Container component="main" maxWidth="xs">
            <Box
              sx={{
                marginTop: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
            
              <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              학생 인증 
              </Typography>
              <Typography variant="subtitle1" sx={{ color: 'black' }}>
                학사정보 시스템 아이디와 비번을 입력해주세요
              </Typography>
              <TextField
                margin="normal"
                label="학번"
                required
                fullWidth
                name="studentID"
                autoComplete="studentID"
              />
              <TextField
                margin="normal"
                label="PW"
                type="password"
                required
                fullWidth
                name="password"
                autoComplete="current-password"
              />
              
              <Button
                color="primary"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                회원가입하기
              </Button>
            </Box>
          </Container>
        </Box>
      </Container>
    </div>
  );
}

{/*  */}