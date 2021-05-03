import React, { useEffect, useState, useRef } from 'react';
import SketchBoard from './sketchBoard';
import ChatBoard from './chatBoard';
import {getNWords} from '../../words';
import Timer from './timer';
import { Row, Col, Modal, Button } from 'antd';

import { MAX_FONT, MIN_FONT } from '../../constants';
import Palette from './../Palette';

const Board = props => {
    // font and colours
    const [font, setFont] = useState(5);
    const [color, setColor] = useState('black');

    const playerIds = useRef([]);
    const [isWordModalVisible, setWordModalVisible ] = useState(false);
    const [timer, setTimer] = useState(-1);
    const [timerFlag, setTimerFlag] = useState(0);
    const choosedWord = useRef('');
    const wordList = useRef(['','','']);
    const background = useRef();
    const { sketchChannel, getMyInfo, getPlayerById, userType, allPlayers } = props;
    const [ brush, setBrush ] = useState();
    const [ chat, setChat ] = useState();

    useEffect(() => {
      setBrush(sketchChannel.current.getChannel('brush'));
      setChat(sketchChannel.current.getChannel('chat'));
      background.current = sketchChannel.current.getChannel('background');
      playerIds.current = Object.keys(allPlayers);
      initTurn();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTimeOut = () => {
      if(userType === 'HOST') {
        console.log('hello');//
        sketchChannel.current.activityManager.setGameSession(false);
        // send scores
        initiateSession();
      }
    }

    const chooseWord = (index) => {
      console.log(wordList.current[index]);//
      let wordObj = {
        "type": "SELECTED_WORD",
        "word": wordList.current[index]
      };
      background.current.send(JSON.stringify(wordObj));
      setWordModalVisible(false);
    }

    const generateBlanks = () => {
      return '_ _ _ _ _ _ _';
    }

    const initiateSession = () => {
      if(userType === 'HOST') {
        /** timeout is added so that users get the time to check the scores
         * Note: Initially(when the page loads for the first time), it might happen that host sends the message
         * before guests start listening. Adding time out also mitigates this issue.
         */
        if (playerIds.current.length){
          console.log(playerIds.current); //
          console.log(playerIds.current[playerIds.current.length-1]); //
          const userId = playerIds.current[playerIds.current.length-1]
          setTimeout(() => {
            console.log('message sent');//
            let initObj = {
              "type": "INIT_TURN",
              "userId": userId,
              "roundNum": 0
            };
            background.current.send(JSON.stringify(initObj));
          }, 2000);
          playerIds.current.pop();
        }
        else {
          // Game over logic
        }
      }
    }

    const initTurn = () => {
      console.log('initTurn');//

      background.current.onmessage = (message) => {
        console.log('message received');//
        console.log(message.data);//
        let obj = JSON.parse(message.data);
        switch (obj.type) {
          case "INIT_TURN":
            if (getMyInfo().id === obj.userId){
              wordList.current = getNWords(3);
              console.log('words generated');
              console.log(wordList.current);//
              setWordModalVisible(true);
            }
            break;

          case "SELECTED_WORD":
            if(userType === 'HOST') {
              choosedWord.current = obj.word;
              sketchChannel.current.activityManager.setCurrWord(choosedWord.current);
              sketchChannel.current.activityManager.setGameSession(true);
              let blanks = generateBlanks(choosedWord.current);
              let blankObj = {
                "type": "BLANKS",
                "blanks": blanks
              };
              background.current.send(JSON.stringify(blankObj));
            }
            break;

          case "BLANKS":
            setTimer(10);
            setTimerFlag((timerFlag) => timerFlag+1)
            break;

          default:
            console.log('unkown type: ' + obj.type);
        }  
      }

      initiateSession();
    }

    const handleFont = (f) => {
      setFont(f);
    }

  const handleColor = (c) => {
      setColor(c);
  }

  const increaseFont = () => {
    setFont(prevFont => {
      return prevFont < MAX_FONT? prevFont + 1: prevFont;
    })
  }
  
  const reduceFont = () => {
    setFont(prevFont => {
      return prevFont > MIN_FONT? prevFont - 1 : prevFont;
    })
  }

  const paletteHandler = {
    font: handleFont,
    color: handleColor,
    getColor: () => { return color },
    increaseFont: increaseFont,
    reduceFont: reduceFont,
  }

  return (
    <>
      <Row justify='center'>
        <Col lg={20} xs={24}>
          <Row>
            <Col lg={20} xs={24}>
              {
                brush 
                  ? <>
                      <SketchBoard brush = {brush} font = {font} color = {color} paletteHandler = {paletteHandler} />
                      <Palette handleFont={handleFont} handleColor={handleColor}/>
                      <Timer timer={timer} setTimer={setTimer} timerFlag={timerFlag} handleTimeOut={handleTimeOut}/>
                    </>
                  : <></>
              }
            </Col>
            <Col lg={4} xs={24}>
              {
                chat
                  ? <ChatBoard chat = {chat} getPlayerById={getPlayerById} getMyInfo={getMyInfo}/>
                  : <></>
              }
            </Col>
          </Row>
        </Col>
      </Row>
      <Modal title="Choose Word" visible={isWordModalVisible} closable={false} destroyOnClose={true} footer={null}>
        <Button type="text" onClick={() => chooseWord(0)}>{wordList.current[0]}</Button>
        <Button type="text" onClick={() => chooseWord(1)}>{wordList.current[1]}</Button>
        <Button type="text" onClick={() => chooseWord(2)}>{wordList.current[2]}</Button>
      </Modal>
    </>
    );
}

export default Board;