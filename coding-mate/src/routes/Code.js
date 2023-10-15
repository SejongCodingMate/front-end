import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
  Container,
  Paper,
  Typography,
  Button,
  FormControlLabel,
  Switch,
  Input,
} from "@mui/material";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { python } from "@codemirror/lang-python";
import { basicDark } from "@uiw/codemirror-theme-basic";
import { basicSetup } from "@uiw/codemirror-extensions-basic-setup";
import someModule from "@codemirror/state";
import airobot from "../assets/Character.png";

const fetchStory = (storyId, accessToken) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  return fetch(`http://3.37.164.99/api/story/${storyId}`, requestOptions)
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {
      console.error("스토리 불러오기 오류:", error);
      throw error;
    });
};

const fetchSave = (nextStoryId, accessToken) => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    nextStoryId: nextStoryId,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return fetch(`http://3.37.164.99/api/story/save`, requestOptions)
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {
      console.error("스토리 불러오기 오류:", error);
      throw error;
    });
};

export default function Code() {
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  let [messageIndex, setMessageIndex] = useState(0);
  const [accessToken, setAccessToken] = useState(null);
  const editor = useRef();
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [localInput, setLocalInput] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const nextStoryId = localStorage.getItem("nextStoryId");
    const storyId = localStorage.getItem("storyId");
    if (!token) {
      console.error("AccessToken이 없습니다.");
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
          formatId: message.story.formatId,
          code: message.code,
          codeResult: message.result,
          isInput: message.isInput,
          flag: message.flag,
        }));

        setLocalInput(initialMessages[0].isInput);
        localStorage.setItem("formatId", initialMessages[0].formatId);
        localStorage.setItem(
          "currentStoryId",
          initialMessages[0].currentStoryId
        );
        localStorage.setItem("code", initialMessages[0].code);
        localStorage.setItem("codeResult", initialMessages[0].codeResult);
        localStorage.setItem("codeIsInput", initialMessages[0].isInput);
        setMessages(initialMessages);

        if (localStorage.getItem("formatId") == 4) {
          navigate("/problem");
        }
        if (
          localStorage.getItem("formatId") == 3 &&
          localStorage.getItem("codeIsInput") == "false"
        ) {
          navigate("/inputfalse");
        } else {
          navigate("/inputtrue");
        }
      })
      .catch((error) => {
        console.error("진행해야 할 스토리 불러오기 오류:", error);
      });
  }, []);
}
