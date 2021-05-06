import React, { useEffect, useState, useRef } from 'react';
import SketchBoard from './sketchBoard';
import ChatBoard from './chatBoard';
import {getNWords} from '../../words';
import Timer from './timer';
import { Table, Row, Col, Modal, Button } from 'antd';

import { MAX_FONT, MIN_FONT } from '../../constants';
import Palette from './../Palette';

const Board = props => {
    // font and colours
    const [font, setFont] = useState(5);
    const [color, setColor] = useState('black');

    const scoreColumns = useRef([
      {
        title: 'Player',
        dataIndex: 'name',
      },
      {
        title: 'Score',
        dataIndex: 'sessionScore',
        sorter: {
          compare: (a, b) => a.sessionScore - b.sessionScore,
          multiple: 1,
        },
      },
    ]);
    const [sessionScores, setSessionScores] = useState();
    const [isWordModalVisible, setWordModalVisible ] = useState(false);
    const [isScoresVisible, setIsScoreVisible] = useState(false);
    const [timer, setTimer] = useState(0);
    const [timerFlag, setTimerFlag] = useState(0);
    const wordList = useRef(['','','']);
    const background = useRef();

    const sizeRef = useRef();
    const { sketchChannel, getMyInfo, getPlayerById, userType, allPlayers } = props;
    const [ brush, setBrush ] = useState();
    const [ chat, setChat ] = useState();

    // eslint-disable-next-line no-unused-vars
    const [ disableBoard, setDisableBoard ] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [ disableChat, setDisableChat ] = useState(false);

    useEffect(() => {
      setBrush(sketchChannel.current.getChannel('brush'));
      setChat(sketchChannel.current.getChannel('chat'));
      background.current = sketchChannel.current.getChannel('background');
      initTurn();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const chooseWord = (index) => {
      console.log(wordList.current[index]);//
      let wordObj = {
        "type": "SELECTED_WORD",
        "word": wordList.current[index]
      };
      background.current.send(JSON.stringify(wordObj));
      setWordModalVisible(false);
    }

    const initTurn = () => {
      console.log('initTurn');//

      background.current.onmessage = (message) => {
        console.log('message received');//
        console.log(message.data);//
        let obj = JSON.parse(message.data);
        switch (obj.type) {
          case "INIT_TURN":
            setIsScoreVisible(false);
            if (getMyInfo().id === obj.userId){
              wordList.current = getNWords(3);
              console.log('words generated');
              console.log(wordList.current);//
              setWordModalVisible(true);
            }
            break;

          case "BLANKS":
            setTimer(10);
            setTimerFlag((timerFlag) => timerFlag+1)
            break;

          case "END_TURN":
            console.log("testing end turn");//
            console.log(obj.scores);//
            setSessionScores(obj.scores);
            setIsScoreVisible(true);
            console.log(sessionScores);//
            break;

          default:
            console.log('unkown type: ' + obj.type);
        }  
      }
    }

    const handleFont = (f) => {
      sizeRef.current.state.ref = f;
      setFont(f);
    }

  const handleColor = (c) => {
      setColor(c);
  }

  const increaseFont = () => {
    setFont(prevFont => {
      sizeRef.current.state.value = prevFont < MAX_FONT? prevFont + 1: prevFont;
      return prevFont < MAX_FONT? prevFont + 1: prevFont;
    })
  }
  
  const reduceFont = () => {
    setFont(prevFont => {
      sizeRef.current.state.value = prevFont > MIN_FONT? prevFont - 1 : prevFont;
      return prevFont > MIN_FONT? prevFont - 1 : prevFont;
    })
  }

  const onFontSlider = (e) => {
    console.log({e});
    setFont(e);
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

                      <SketchBoard brush = {brush} font = {font} color = {color} paletteHandler = {paletteHandler} disable={disableBoard}/>
                      {disableBoard
                        ? <></>
                        : <Palette handleFont={handleFont} handleColor={handleColor} sizeRef={sizeRef} onFontSlider={onFontSlider} color={color} font={font}/>
                      }
                      <Timer timer={timer} setTimer={setTimer} timerFlag={timerFlag} handleTimeOut={handleTimeOut}/>
                    </>
                  : <></>
              }
            </Col>
            <Col lg={4} xs={24}>
              {
                chat
                  ? <ChatBoard chat = {chat} getPlayerById={getPlayerById} getMyInfo={getMyInfo} disable={disableChat}/>
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
      <Modal title="Scores" visible={isScoresVisible} closable={false} destroyonClose={true} footer={null}>
        <Table columns={scoreColumns.current} dataSource={sessionScores}/>
      </Modal>
    </>
    );
}

export default Board;