import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

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
    navigate('/story');
  };

  const handleNextButtonClick = () => {
    navigate('/nextPage');
  };

  const quizStyle = {
    width: '46%',
    height: '80vh',
    backgroundColor: '#000',
    color: '#FFF',
    fontSize: '22px',
    fontWeight: 400,
    marginRight: '18%',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  };

  const buttonStyle = {
    backgroundColor: 'transparent',
    color: '#FFF',
    border: '1px solid #FFF',
    cursor: 'pointer',
    marginLeft: '10px', // 정답 입력과 제출 버튼 사이에 여백 추가
  };

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
      <button
        onClick={handleBackButtonClick}
        style={{
          position: 'absolute', // 절대 위치 설정
          top: '20px', // 원하는 위치 (상단 여백) 설정
          left: '20px', // 원하는 위치 (좌측 여백) 설정
          backgroundColor: 'transparent',
          color: '#FFF',
          border: '1px solid #FFF',
          cursor: 'pointer',
        }}
      >
        뒤로 가기
      </button>

      <button
        onClick={handleNextButtonClick}
        style={{
          position: 'absolute',
          bottom: '20px', // 원하는 위치 (하단 여백) 설정
          right: '20px', // 원하는 위치 (우측 여백) 설정
          backgroundColor: 'transparent',
          color: '#FFF',
          border: '1px solid #FFF',
          cursor: 'pointer',
        }}
      >
        다음 스테이지
      </button>
      
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
        <span>퀴즈를 풀어보자</span>
      </Box>

      {/* 퀴즈 질문 부분 */}
      {quizzes.map((quiz, index) => (
        <div
          key={index}
          style={{
            ...quizStyle,
            color: userAnswers[index] === 'O' ? 'green' : userAnswers[index] === 'X' ? 'red' : 'white',
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
              <p>{quiz.description}</p>
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
                  backgroundColor: selectedAnswers[index] === 'O' ? 'blue' : 'transparent',
                }}
              >
                O
              </button>
              <button
                onClick={() => handleAnswerSubmit('X', index)}
                style={{
                  ...buttonStyle,
                  backgroundColor: selectedAnswers[index] === 'X' ? 'blue' : 'transparent',
                }}
              >
                X
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleAnswerSubmit('YourAnswerHere', index)}
              style={{ ...buttonStyle, backgroundColor: 'transparent' }}
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
    </Box>
  );
}
