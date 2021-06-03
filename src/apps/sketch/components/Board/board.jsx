import React, { useCallback, useEffect, useState, useRef } from 'react';
import SketchBoard from './sketchBoard';
import ChatBoard from './chatBoard';
import {getNWords} from '../../words';
import Timer from './timer';
import { Table, Row, Col, Modal, Button, notification } from 'antd';


import {MAX_FONT, MIN_FONT, HOME_PAGE_URL} from '../../constants';
import Palette from './../Palette';
import { EditFilled, DisconnectOutlined } from '@ant-design/icons';

function useHookWithRefCallback() {
  const ref = useRef(null)
  const setRef = useCallback(node => {
    if (ref.current) {
      console.log({'ref.current': ref.current});
      // Make sure to cleanup any events/references added to the last instance
    }
    
    if (node) {
      console.log({node});
      // Check if a node is actually passed. Otherwise node would be null.
      // You can now do what you need to, addEventListeners, measure, etc.
    }
    
    // Save a reference to the node
    ref.current = node
  }, [])
  
  return [setRef]
}

const Board = props => {
    // font and colours
    const [font, setFont] = useState(5);
    const [color, setColor] = useState('black');
    const [sketchBoardRef] = useHookWithRefCallback();

    const sessionScoreColumns = useRef([
      {
        title: 'Player',
        dataIndex: 'name',
      },
      {
        title: 'Score',
        dataIndex: 'sessionScore',
      },
    ]);

    const scoreColumns = useRef([
      {
        title: 'Player',
        dataIndex: 'userId',
        props:{ className:'clearBg' },
        render: (text, row, index) => {
          if (text === currPlayer.current) {
            return (
              <>
                <b>{getPlayerById(text).name}</b>
                <EditFilled /> 
              </>
            );
          }
          return <span>{getPlayerById(text).name}</span>;
        },
      },
      {
        title: 'Score',
        dataIndex: 'score',
        props:{ className:'clearBg' }
      },
    ]);
    const [displayBlank, setDisplayBlank] = useState(false);
    const blank = useRef('');
    const word = useRef('');
    const [sessionScores, setSessionScores] = useState();
    const [scores, setScores] = useState();
    const [isWordModalVisible, setWordModalVisible ] = useState(false);
    const correctWord = useRef('');
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
    const [isSessionDisconnected, setSessionDisconnect] = useState(false);

    // eslint-disable-next-line no-unused-vars
    const [ disableBoard, setDisableBoard ] = useState(true);
    // eslint-disable-next-line no-unused-vars
    const [ disableChat, setDisableChat ] = useState(false);

    const [api, contextHolder] = notification.useNotification();

    const openNotification = id => {
      api.info({
        icon: <DisconnectOutlined />,
        message: `Payer ${getPlayerById(id).name} got Disconnected`,
        placement: 'topLeft',
      });
    };

    useEffect(() => {
      console.log(allPlayers);
      setScores(Object.keys(allPlayers).reduce((acc,id) => {
        return [ ...acc, { userId: id, score: 0 } ];
      }, []));
      setBrush(sketchChannel.current.getChannel('brush'));
      setChat(sketchChannel.current.getChannel('chat'));
      background.current = sketchChannel.current.getChannel('background');

      handleSessionDisconnected();

      initTurn();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSessionDisconnected = () => {
      background.current.onclose = (e) => { setSessionDisconnect(true); }
    }

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

    const getSessionSortedScores = (sessionScores) => {
      return sessionScores.sort((a,b) => {
          return b.sessionScore - a.sessionScore;
      });
    }

    const getSortedScores = (scores) => {
        return scores.sort((a,b) => {
            return b.score - a.score;
        });
    }

    const getOrderedScores = (scores) => {
      return scores.sort((a,b) => {
          return b.index - a.index;
      });
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
            currPlayer.current = myInfo.id;
            if (myInfo.id === obj.userId) {
              setDisableBoard(false);
              setDisableChat(true);

              wordList.current = getNWords(3);
              console.log(wordList.current);//
              setWordModalVisible(true);
              setTimeout(() => {
                console.log('word choosing time out',word.current);
                if(word.current === '') {
                  console.log('word not choosen');
                  chooseWord(Math.floor(Math.random() * (3)));
                }
              }, 10000);
            }
            else {
              currPlayer.current = obj.userId;
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
            setScores(getOrderedScores(obj.scores));
            setSessionScores(getSessionSortedScores(obj.scores));
            setDisplayBlank(false);
            word.current = '';
            blank.current = '';
            correctWord.current = obj.correctWord;
            setIsScoreVisible(true);
            console.log(sessionScores);//
            break;

          case "WINNER":
            currPlayer.current = '';
            setScores(getSortedScores(obj.scores));
            setIsGameOver(true);
            break;

          case "DISCONNECTED":
            openNotification(obj.id);
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

  var circleStyle = {
    display:"inline-block",
    backgroundColor: color === 'eraser'? 'white' : color,
    borderRadius: color === 'eraser'? '0%' : "50%",
    borderStyle: color === 'eraser'? 'solid': 'none',
    width: font,
    height: font,
  };

  return (
    <>
      {contextHolder}
      <div>Round: {roundNum}</div>
      <Row justify='center'>
        <Col lg={4} className='fullHeight'>
          <Table className='clearBg' columns={scoreColumns.current} dataSource={scores} pagination={false}/>
        </Col>

        <Col lg={16}>
          {
            brush 
              ? <>
                  {
                    displayBlank? 
                      <Row style={{background:'white', margin: '4px'}}  align="middle">
                        <Col span={4}>
                          <Timer timer={timer} setTimer={setTimer} timerFlag={timerFlag}/>
                        </Col>
                        <Col span={20}>
                          <div  style={{ fontWeight: 'bold', textAlign: 'center', padding: '4px'}}> {blank.current} </div>
                        </Col>
                      </Row>
                      : <></>
                  }
                    <div style={{ position: 'relative' }}>
                    {disableBoard
                    ? <></>
                    :<div bordered style={{ width: font, height: font, marginLeft: '10px' , textAlign:'center', position: 'absolute'}}>
                      <div style={circleStyle}>
                      </div>
                    </div>
                  }
                    <SketchBoard ref = {sketchBoardRef} sketchBoardRef={sketchBoardRef} brush = {brush} font = {font} color = {color} paletteHandler = {paletteHandler} disable={disableBoard} refresh={refreshBoard}/>
                  </div>
                  {disableBoard
                    ? <></>
                    : <Palette handleFont={handleFont} handleColor={handleColor} sizeRef={sizeRef} onFontSlider={onFontSlider} color={color} font={font}/>
                  }
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
      <Modal className='blob' title="Choose Word" visible={isWordModalVisible} closable={false} destroyOnClose={true} footer={null}>
        <Button type="text" onClick={() => chooseWord(0)}>{wordList.current[0]}</Button>
        <Button type="text" onClick={() => chooseWord(1)}>{wordList.current[1]}</Button>
        <Button type="text" onClick={() => chooseWord(2)}>{wordList.current[2]}</Button>
      </Modal>
      <Modal className='blob' title="Scores" visible={isScoresVisible} closable={false} destroyonClose={true} footer={null}>
        <center>
          <h3> Word is: <b> {correctWord.current} </b> </h3>
        </center>
        <Table columns={sessionScoreColumns.current} dataSource={sessionScores} pagination={false}/>
      </Modal>
      <Modal className='blob' title="Leader Board" visible={isGameOver} closable={false} destroyonClose={true} footer={null}>
        <Table columns={scoreColumns.current} dataSource={scores} pagination={false}/>
      </Modal>
      <Modal className='blob' title="Unable to Connect to Server" visible={isSessionDisconnected} closable={false} destroyonClose={true} footer={null}>
        <center>
          <a type='primary' href={HOME_PAGE_URL}> Go To Home</a>
        </center>
      </Modal>
    </>
    );
}

export default Board;