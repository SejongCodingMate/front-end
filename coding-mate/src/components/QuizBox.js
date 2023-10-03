import * as React from 'react';
import Box from '@mui/material/Box';
import Character from '../assets/Character.png';

export default function BoxSx() {
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '60%',
          height: '40%',
          backgroundColor: '#000',
          color: '#FFF',
          fontSize: '40px',
          fontWeight: 400,
        }}
      >
        <img
          src={Character}
          alt="캐릭터"
          style={{ marginLeft: '10px', width: '150px', height: '150px' }}
        />
        <span>퀴즈를 풀어보자</span>
      </Box>
      
      {/* 추가 박스 */}
      <Box
        sx={{
          width: '46%',
          height: '80vh',
          backgroundColor: '#000',
          color: '#FFF',
          fontSize: '24px',
          fontWeight: 400,
          marginRight: '18%',
          marginBottom: '10%',
          display: 'flex',
          justifyContent: 'center',
          lineHeight: '3',
        }}
      >
        1. 입력은 input으로 받을 수 있다.<br />
        2. 출력은 output으로 쓴다.<br />
        3. 출력할 때는 “”로 감싸줘야 한다.<br />
        4. 어떤 퀴즈가 있을까용?<br />
        5. 어떤 퀴즈가 있을까용?
      </Box>
    </Box>
  );
}
