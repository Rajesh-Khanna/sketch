import React, { useEffect, useState, useRef } from 'react';
import SketchBoard from './sketchBoard';
import ChatBoard from './chatBoard';
import {getNWords} from '../../words';
import Timer from './timer';
import { Card, Table, Row, Col, Modal, Button } from 'antd';


import { MAX_FONT, MIN_FONT } from '../../constants';
import Palette from './../Palette';

const Board = props => {
    // font and colours
    const [font, setFont] = useState(5);
    const [color, setColor] = useState('black');

    const sessionScoreColumns = useRef([
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

    const scoreColumns = useRef([
      {
        title: 'Player',
        dataIndex: 'name',
        // render: (text, row, index) => {
        //   if (text === currPlayer.current) {
        //     return <b style={{color: '#ffff00'}} >{text}</b>;
        //   }
        //   return <span>{text}</span>;
        // },
      },
      {
        title: 'Score',
        dataIndex: 'score',
      },
    ]);
    const [displayBlank, setDisplayBlank] = useState(false);
    const blank = useRef('');
    const word = useRef('');
    const [sessionScores, setSessionScores] = useState();
    const [isWordModalVisible, setWordModalVisible ] = useState(false);
    const [isScoresVisible, setIsScoreVisible] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [roundNum, setRoundNum] = useState(1);
    const currPlayer = useRef('');


    const [timer, setTimer] = useState(0);
    const [timerFlag, setTimerFlag] = useState(0);
    const wordList = useRef(['','','']);
    const background = useRef();

    const sizeRef = useRef();
    const { sketchChannel, getMyInfo, getPlayerById, allPlayers } = props;
    const [ brush, setBrush ] = useState();
    const [ chat, setChat ] = useState();
    const [refreshBoard, setRefreshBoard] = useState(false);

    // eslint-disable-next-line no-unused-vars
    const [ disableBoard, setDisableBoard ] = useState(true);
    // eslint-disable-next-line no-unused-vars
    const [ disableChat, setDisableChat ] = useState(false);

    useEffect(() => {
      setSessionScores(Object.values(allPlayers).reduce((acc,player) => {
        return [ ...acc, { name: player.name, score: 0 } ];
      }, []));
      setBrush(sketchChannel.current.getChannel('brush'));
      setChat(sketchChannel.current.getChannel('chat'));
      background.current = sketchChannel.current.getChannel('background');
      initTurn();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const chooseWord = (index) => {
      console.log(wordList.current[index]);//
      word.current = wordList.current[index];
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
            setRefreshBoard(false);

            setIsScoreVisible(false);
            setTimer(obj.timer);
            setRoundNum(obj.roundNum);
            const myInfo = getMyInfo();
            currPlayer.current = myInfo.name;
            if (myInfo.id === obj.userId) {
              setDisableBoard(false);
              setDisableChat(true);

              wordList.current = getNWords(3);
              console.log(wordList.current);//
              setWordModalVisible(true);
            }
            else {
              currPlayer.current = getPlayerById(obj.userId).name;
              setDisableBoard(true);
              setDisableChat(false);
            }
            break;

          case "BLANKS":
            if (word.current === '') {
              blank.current = obj.blanks;
            }
            else {
              blank.current = word.current;
            }
            setDisplayBlank(true);

            setTimerFlag((timerFlag) => timerFlag+1)
            break;

          case "END_TURN":
            console.log("testing end turn");//
            console.log(obj.scores);//
            setRefreshBoard(true);
            setSessionScores(obj.scores);
            setDisplayBlank(false);
            word.current = '';
            blank.current = '';

            setIsScoreVisible(true);
            console.log(sessionScores);//
            break;

          case "WINNER":
            setIsGameOver(true);
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
      {
        displayBlank 
          ? <Card  style={{textAlign: 'center'}}> {blank.current} </Card>
          : <></>
      }
      <div>Round: {roundNum} ({currPlayer.current})</div>
      <Row justify='center'>
        <Col lg={20} xs={24}>
          <Row>
            <Col lg={20} xs={24}>
              {
                brush 
                  ? <>

                      <SketchBoard brush = {brush} font = {font} color = {color} paletteHandler = {paletteHandler} disable={disableBoard} refresh={refreshBoard}/>

                      {disableBoard
                        ? <></>
                        : <Palette handleFont={handleFont} handleColor={handleColor} sizeRef={sizeRef} onFontSlider={onFontSlider} color={color} font={font}/>
                      }
                      <Timer timer={timer} setTimer={setTimer} timerFlag={timerFlag}/>
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
      <Table columns={scoreColumns.current} dataSource={sessionScores}/>
      <Modal title="Choose Word" visible={isWordModalVisible} closable={false} destroyOnClose={true} footer={null}>
        <Button type="text" onClick={() => chooseWord(0)}>{wordList.current[0]}</Button>
        <Button type="text" onClick={() => chooseWord(1)}>{wordList.current[1]}</Button>
        <Button type="text" onClick={() => chooseWord(2)}>{wordList.current[2]}</Button>
      </Modal>
      <Modal title="Scores" visible={isScoresVisible} closable={false} destroyonClose={true} footer={null}>
        <Table columns={sessionScoreColumns.current} dataSource={sessionScores}/>
      </Modal>
      <Modal title="Leader Board" visible={isGameOver} closable={false} destroyonClose={true} footer={null}>
        <Table columns={scoreColumns.current} dataSource={sessionScores}/>
      </Modal>
    </>
    );
}

export default Board;