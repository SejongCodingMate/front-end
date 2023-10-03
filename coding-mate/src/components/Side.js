import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function Side() {
  return (
    <Box
      sx={{
        width: '19%',
        height: '100vh',
        backgroundColor: '#1F1F1F',
        position: 'fixed',
        top: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Button
        sx={{
          width: '86%',
          height: '10%',
          marginTop: '10%',
          marginBottom: '5%',
          backgroundColor: '#000',
          color: '#FFF',
          fontSize: '25px',
          borderRadius: '10px',
          boxShadow: '0px 4px 4px 0px rgba(255, 255, 255, 0.25)'
        }}
      >
        저장하고 나가기
      </Button>
      <Button
        sx={{
          width: '86%',
          height: '10%',
          backgroundColor: '#000',
          color: '#FFF',
          fontSize: '25px',
          borderRadius: '10px',
          boxShadow: '0px 4px 4px 0px rgba(255, 255, 255, 0.25)'
        }}
      >
        불러오기
      </Button>
    </Box>
  );
}
