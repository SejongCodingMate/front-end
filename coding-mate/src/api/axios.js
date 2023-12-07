/**
 * Created by rla124
 */

import axios from 'axios';

// 1. 스토리 갱신
export const axiosStory = async (storyId, accessToken) => {
    try {
      const response = await axios.get(`http://3.37.164.99/api/story/${storyId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      return response.data;
    } catch (error) {
      console.error("스토리 불러오기 오류:", error);
      throw error;
    }
  };
  
  // 2. 스토리 Save
  export const saveStory  = async (nextStoryId, accessToken) => {
    try {
      const response = await axios.post(`http://3.37.164.99/api/story/save`,
      {
        nextStoryId: nextStoryId,
      }, 
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type' : 'application/json',
        },
      });
  
      return response.data;
  
    } catch (error) {
      console.error('스토리 저장 오류:', error);
      throw error;
    }
  };
  
  // 3. 챕터 Save
  export const axiosChapterSave = async (nextChapterId, accessToken) => {
    try {
      const response = await axios.post(
        `http://3.37.164.99/api/chapter/save`,
        {
          nextChapterId: nextChapterId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }
        }
      );
  
      return response.data;
  
    } catch (error) {
      console.error('스토리 저장 오류:', error);
      throw error;
    }
  };