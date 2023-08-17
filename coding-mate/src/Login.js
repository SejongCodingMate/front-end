import React,{useState} from 'react';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { BrowserRouter as Router, Route } from 'react-router-dom';


export default function Login() {
  const imageUrl = 'https://i.imgur.com/CtgSNru.png';

  const handleSubmit = event => {
    event.preventDefault();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "studentId": studentId,
      "password": password
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://3.37.164.99/api/login", requestOptions)
      .then(response => response.text())
      .then(result => {
        window.alert(result)
        })
      .catch(error => console.log('error', error));
  }

  const [studentId, setstudentId] = useState('');
  const [password, setpassword] = useState('');

  return (
    // <React.Fragment>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img src={imageUrl} alt="로컬 이미지" />
          <Typography component="h1" variant="h5">
            Coding MATE
          </Typography>
          <TextField
            margin="normal"
            label="학번"
            required
            fullWidth
            name="studentId"
            id="studentId"
            autoComplete="studentId"
            autoFocus
            onChange={(e) => setstudentId(e.target.value)}
          />
          <TextField
            margin="normal"
            label="PW"
            type="password"
            required
            fullWidth
            name="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => setpassword(e.target.value)}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember Me"
          />
          <Button
            color="primary"
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={(event) => handleSubmit(event)}
            >
            로그인하기
          </Button>
 
            <Grid container>
              <Grid item xs>
                <Link href="register">회원 가입</Link>
              </Grid>
              <Grid item>
                <Link href="pwsearch">비밀번호 찾기</Link>
              </Grid>
            </Grid>
          
        </Box>
      </Container>
    // </React.Fragment>
  );
}
