import React from 'react';
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
  return (
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
          name="studentID"
          autoComplete="studentID"
          autoFocus
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
        >
          로그인하기
        </Button>

        <Router> 
          <Grid container>
            <Grid item xs>
              <Link >회원 가입</Link>
            </Grid>
            <Grid item>
              <Link >비밀번호 찾기</Link>
            </Grid>
          </Grid>
        </Router>
      </Box>
    </Container>
  );
}
