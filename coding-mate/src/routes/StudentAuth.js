import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Navbar from '../Navbar';
import PasswordChangeModal from './PwChange';

export default function StudentAuth() {
  const navigate = useNavigate();
  const [studentId, setstudentId] = useState('');
  const [password, setpassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  // const [modalOpen, setModalOpen] = useState(false);
  // const showModal = () => {
  //   setModalOpen(true);
  // };

  const studentSubmit = event => {
    event.preventDefault();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "id": studentId,
      "pw": password
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://3.37.164.99/api/member/sejong-login", requestOptions)
      .then(response => response.json())
      .then(result => {
          console.log(result);
          return result
        })
      .then((result) => {
        if (result['message'] == '학생 인증이 완료되었습니다.'){
          window.alert(result['message']);
          localStorage.setItem("studentId", studentId);
          // {modalOpen && <PasswordChangeModal setModalOpen={setModalOpen} />}
          window.location.href='/pwchange';
        } else {
          window.alert('학생 인증에 실패하였습니다.');
        }
      })
      .catch(error => console.log('error', error));
  };

  return (
    <div>
      <Navbar></Navbar>
      <Container maxWidth="xl">
        <Box sx={{  background: '#f5f5f5', padding: '16px', textAlign: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'red' }}>
            비밀번호 변경하기
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'black' }}>
            비밀번호를 변경하기 전에 세종대학교 재학생 인증을 먼저 진행해주세요.
          </Typography>
        </Box>

        <Box
          sx={{
            border: '1px solid black',
            borderRadius: '4px',
            padding: '30px',
            marginTop: '150px',
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
          
              <TextField
                margin="normal"
                label="학번"
                required
                fullWidth
                name="studentId"
                id="studentId"
                autoComplete="studentId"
                value={studentId}
                onChange={(e) => setstudentId(e.target.value)}
                
              />
              <TextField
                margin="normal"
                label="학사정보 시스템 비밀번호"
                type="password"
                required
                fullWidth
                name="password"
                id="password"
                autoComplete="password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}             
              />
              
                <Button
                color="secondary"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                id="studentAuth"
                onClick={studentSubmit}
                >
                  재학생 인증하기
                </Button>

            </Box>







            {/* <Box
              sx={{
                marginTop: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
          
              <TextField
                margin="normal"
                label="새로운 비밀번호"
                type="password"
                required
                fullWidth
                name="newPassword"
                id="newPassword"
                autoComplete="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                
              />
              <TextField
                margin="normal"
                label="새로운 비밀번호 확인"
                type="password"
                required
                fullWidth
                name="confirmPassword"
                id="confirmPassword"
                autoComplete="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}             
              />
              
                <Button
                color="primary"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleChangePassword}
                >
                  변경하기
                </Button>
            </Box> */}










          </Container>


        </Box>
      </Container>
    </div>
  );
}
