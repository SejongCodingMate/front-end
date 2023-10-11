import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import './Font.css'
import back from '../assets/back.png';

export default function BoxSx() {
  const [quizzes, setQuizzes] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  useEffect(() => {
    // accessToken 가져오기
    const accessToken = localStorage.getItem('accessToken');

    // accessToken이 없으면 반환
    if (!accessToken) {
      console.error('AccessToken이 없습니다.');
      return;
    }
    // GET 요청을 보내서 데이터를 가져오는 로직을 작성
    fetch('http://3.37.164.99/api/quiz/1', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json', // JSON 요청을 보내는 경우
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('API 요청 실패');
        }
        return response.json();
      })
      .then((data) => {
        console.log('API 응답 데이터:', data);
        const res = data.data.quizDtoList;
        console.log('변환된 데이터:', res);
        setQuizzes(res)
      }).catch((error) => console.error('API 요청 에러:', error));
  }, []);

  const handleAnswerSubmit = (answer, index) => {
    // 현재 문제의 정답을 가져옵니다.
    const currentQuiz = quizzes[index];
    const isCorrect = answer === currentQuiz.answer;
  
    // 정답 여부를 확인하고 정답 개수를 업데이트합니다.
    if (isCorrect) {
      setCorrectAnswersCount(correctAnswersCount + 1);
    }
  
    // 사용자 답변 상태와 선택한 답변을 업데이트합니다.
    const newUserAnswers = [...userAnswers];
    newUserAnswers[index] = isCorrect ? 'O' : 'X';
    setUserAnswers(newUserAnswers);
  
    // 선택한 답변을 업데이트합니다.
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[index] = answer;
    setSelectedAnswers(newSelectedAnswers);
  };

  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    navigate('/main');
  };

  const handleNextButtonClick = () => {
    navigate('/main');
  };

  const quizStyle = {
    width: '46%',
    height: '60vh',
    backgroundColor: '#000',
    color: '#FFF',
    fontSize: '24px',
    fontWeight: 400,
    marginRight: '18%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  };

  const buttonStyle = {
    backgroundColor: 'transparent',
    color: '#FFF',
    border: '1px solid #FFF',
    cursor: 'pointer',
    marginLeft: '10px',
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        // justifyContent: 'center',
        flexDirection: 'column',
        gap: '2%'
      }}
    >
      <button
  onClick={handleBackButtonClick}
  style={{
    position: 'absolute',
    width: '7%',
    height: '8%',
    top: '20px',
    left: '0px',
    backgroundColor: '#242424',
    color: '#FFF',
    border: '1px solid #FFF',
    cursor: 'pointer',
    borderTop: '5px solid #3D3D3D',
    borderLeft: '5px solid #3D3D3D',
    borderBottom: 'none',
    borderRight: 'none'
  }}
>
  <img style={{
    width: '35px',
    height: '35px',
    float: 'right'
  }}src={back} alt="뒤로 가기" />
</button>


      <button
        onClick={handleNextButtonClick}
        style={{
          position: 'absolute',
          bottom: '140px',
          right: '0px',
          width: '17%',
          height: '6%',
          backgroundColor: '#32D74B',
          color: '#1D6127',
          borderTop: '5px solid #6AEE7E',
          borderLeft: '5px solid #6AEE7E',
          borderBottom: 'none',
          borderRight: 'none',
          cursor: 'pointer',
          fontSize: '30px',
          fontWeight: 700
        }}
      >
        NEXT STAGE
      </button>
      
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2%',
          width: '60%',
          height: '10%',
          backgroundColor: '#000',
          color: '#FFF',
          fontSize: '45px',
          fontWeight: '700',
          fontFamily: 'D2Coding',
          marginTop: '3%'
        }}
      >
        <span>Chapter 1. 퀴즈</span>
      </Box>

      {/* 퀴즈 질문 부분 */}
      {quizzes.map((quiz, index) => (
  <div
  key={index}
  style={{
    ...quizStyle,
    width: '62.5%',
    height: '10vh',
    borderTop: '5px solid #32D74B',
    borderLeft: '5px solid #32D74B',
    borderBottom: '1px solid #32D74B',
    borderRight: '1px solid #32D74B',
    marginLeft: '20%',
    borderColor: userAnswers[index] === 'O' ? '#0A84FF' : userAnswers[index] === 'X' ? '#FF2D55' : '#32D74B',
    display: 'flex',
    justifyContent: 'space-between', // 오른쪽으로 정렬
    alignItems: 'center', // 세로 가운데 정렬
  }}
>
  <div>
    {quiz.text.includes("_____") ? (
      <>
        {quiz.text.split("_____").map((part, i) => (
          <span key={i}>
            {part}
            {i < quiz.text.split("_____").length - 1 ? (
              <input
                type="text"
                style={{
                  borderBottom: '1px solid #FFF',
                  background: '#000',
                  color: '#FFF',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  outline: 'none',
                  width: '12%',
                }}
              />
            ) : null}
          </span>
        ))}
      </>
    ) : (
      quiz.text
    )}

    {userAnswers[index] && (
      <div>
        <p style={{ fontSize: '18px', color: '#FF2D55' }}>{quiz.description}</p>
      </div>
    )}
  </div>
  {/* 사용자가 이미 선택한 답변에 따라 버튼 스타일을 동적으로 설정합니다. */}
  <div>
    {quiz.formatId === 1 ? (
      <div>
        <button
          onClick={() => handleAnswerSubmit('O', index)}
          style={{
            ...buttonStyle,
            color: selectedAnswers[index] === 'O' ? '#0A84FF' : '#FFF',
            border: 'none',
            cursor: 'pointer',
            fontSize: '24px',
          }}
        >
          O
        </button>
        <span> /</span>
        <button
          onClick={() => handleAnswerSubmit('X', index)}
          style={{
            ...buttonStyle,
            color: selectedAnswers[index] === 'X' ? '#0A84FF' : '#FFF',
            border: 'none',
            cursor: 'pointer',
            fontSize: '24px',
          }}
        >
          X
        </button>
      </div>
    ) : (
      <button
        onClick={() => handleAnswerSubmit('YourAnswerHere', index)}
        style={{
          ...buttonStyle,
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '20px',
        }}
      >
        제출
      </button>
    )}
    {/* 정답 제출 후 설명 표시 */}
  </div>
</div>

))}
      {correctAnswersCount === quizzes.length && (
        <div>
          모든 질문이 완료되었습니다. 정답 수: {correctAnswersCount}
          {/* 정답 수에 따라 스토리 페이지로 이동하는 로직을 추가하세요 */}
        </div>
      )}
      <div style={{ 
        fontSize: '40px', 
        color: '#FFF', 
        marginTop: '5%', 
        fontFamily: 'LINE Seed Sans KR',
        }}>
        제대로 이해했는지 확인해보자!
      </div>
    </Box>
  );
}
