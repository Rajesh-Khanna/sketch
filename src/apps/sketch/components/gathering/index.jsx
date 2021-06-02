import React, { useState, useRef, useEffect} from 'react';
import { Input, Button, Card, Row, Col, Modal, Divider } from 'antd';
import { APP_STATE, META_TYPES, ROUNDS, TURN_TIME, HOME_PAGE_URL } from '../../constants';
import { gridStyle } from '../../style';

const GatheringSpace = props => {
    const metaChannel = useRef();
    const [players, setPlayers] = useState([]);
    const [isSessionDisconnected, setSessionDisconnect] = useState(false);
    const [isNameModalVisible, setNameModalVisible ] = useState(false);
    const [nameValue, setNameValue ] = useState('player');
    // eslint-disable-next-line no-unused-vars
    const { userType, hostLobbyKey = '', dataChannel, setAppState, setMyInfo, setAllPlayers, myInfo, allPlayers, getMyInfo } = props;
    const [ shareURL, setShareURL] = useState('');
    const [ gameMeta, setGameMeta ] = useState({ rounds: ROUNDS, turns: TURN_TIME });
    const turns = useRef(); 
    const rounds = useRef(); 


    const startBoard = () => {
        metaChannel.current.send(JSON.stringify({type: META_TYPES.START_GAME, turns: turns.current.state.value, rounds: rounds.current.state.value }));
    }

    const handleSessionDisconnected = () => {
        metaChannel.current.onclose = (e) => { setSessionDisconnect(true); }
    }

    useEffect(() => {
        console.log({hostLobbyKey})
        setShareURL(window.location.protocol + "//" + window.location.host + window.location.pathname + `?k=${hostLobbyKey}`);
        metaChannel.current = dataChannel.current.getChannel('meta');

        handleSessionDisconnected();

        metaChannel.current.onmessage = (message) => {
            console.log(message);
            const messageObj = JSON.parse(message.data);
            switch(messageObj.type){
                case META_TYPES.PLAYERS:
                    console.log(messageObj.players);//
                    setPlayers(messageObj.players);
                    setAllPlayers(messageObj.players);
                    break;
                case META_TYPES.START_GAME:
                    setAppState(APP_STATE.ACTIVE_BOARD);
                    break;
                case META_TYPES.END_GAME:
                    setAppState(APP_STATE.GATHERING);
                    break;
                case META_TYPES.HEART_BEAT:
                    console.log({ type: META_TYPES.ALIVE, userId: getMyInfo()}) //
                    metaChannel.current.send(JSON.stringify({ type: META_TYPES.ALIVE, userId: getMyInfo().id}));
                    break;
                case META_TYPES.TURN_TIME:
                    setGameMeta(p => { return { ...p, turns: messageObj.value } });
                    break;
                case META_TYPES.ROUND_NUM:
                    setGameMeta(p => { return { ...p, rounds: messageObj.value } });
                    break;
                default:
                    console.log(messageObj);
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        console.log(myInfo);
        if (!myInfo.id) {
            setNameModalVisible(true);
        }
        else {
            let keys = Object.keys(allPlayers);
            console.log(keys);//
            console.log(players);//
            let p = [];
            for (let i=0; i< keys.length; i++) {
                console.log(allPlayers[keys[i]]);//
                p.push({'userId':keys[i], 'name':allPlayers[keys[i]].name});
            }
            console.log(p)//
            setPlayers(p);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nameValue]);

    const sumbitName = () => {
        if(nameValue.length > 0) {
            const id = Math.random().toString(36).slice(-6);
            metaChannel.current.send(JSON.stringify({ type: META_TYPES.NEW_PLAYER, userId: id, name: nameValue }));
            setMyInfo(id,nameValue);
            setNameModalVisible(false);
        }
    }

    const onTextChange = (e) => {
        if(e.key === 'Enter'){
            sumbitName();
        }
    }

    const updateTurnTime = (e) => {
        metaChannel.current.send(JSON.stringify({ type: META_TYPES.TURN_TIME, value: e.target.value }));
    }

    const updateRoundNum = (e) => {
        metaChannel.current.send(JSON.stringify({ type: META_TYPES.ROUND_NUM, value: e.target.value }));
    }

    return (
        <>
            <div id = 'waitingRoom'>
                <Row justify='center'>
                    <Col md={24} lg={16}>
                        <Row wrap={false} justify='center' align='middle'>
                            <Col flex="none">
                                <Card className='clearBg'> Share this link </Card>
                            </Col>
                            <Col flex="auto">
                                <Card  className='clearBg'>{shareURL}</Card>
                            </Col>
                            <Col flex="auto">
                                <Button className='clearBg' onClick={()=>{navigator.clipboard.writeText(shareURL)}}>copy</Button>
                            </Col>
                        </Row>
                            <Divider> Game Settings </Divider>
                        {
                            userType === 'HOST'?   
                                (
                                    <>
                                    <Row justify='center' gutter={[4, 4]}>
                                        <Col md={24} lg={6}>
                                            Time per turn
                                        </Col>
                                        <Col md={24} lg={4}>
                                            <Input style={{ textAlign: 'center' }} ref={turns} onChange={updateTurnTime} defaultValue={10} type="number" />
                                        </Col>
                                    </Row>
                                    <Row justify='center' gutter={[4, 4]}>
                                        <Col md={24} lg={6}>
                                            Rounds
                                        </Col>
                                        <Col md={24} lg={4}>
                                            <Input style={{ textAlign: 'center' }} ref={rounds} onChange={updateRoundNum} defaultValue={3} type="number" /> <br />
                                        </Col>
                                    </Row>
                                    <Row justify='center'>
                                        <Col md={24} lg={6}  style={{ textAlign: 'center', padding: '8px' }}>
                                            <Button type="primary" className='startButton' onClick={startBoard}> Start Board </Button>
                                        </Col>                                    
                                    </Row>
                                    </>
                                ):(
                                    <>
                                        <Card  className='clearBg'>
                                            <p>
                                                Time per turn: {gameMeta.turns}
                                            </p>
                                            <p>
                                                Rounds: {gameMeta.rounds}
                                            </p>
                                            <p style={{ textAlign: 'center', border: 'solid' }}>
                                                Waiting for Host to start the game.
                                            </p>
                                        </Card>
                                    </>
                                )
                        }
                        <Divider > Players </Divider>
                        {
                            players ?
                            (
                                <Card  className='clearBg'>
                                    {players.map((item, index) => (
                                        <Card.Grid style={gridStyle} key={index}>{item.name}</Card.Grid>
                                    ))}
                                </Card>
                            ):(
                                ''
                            )
                        }
                    </Col>
                </Row>
            </div>
            <Modal className='blob' title="Name" visible={isNameModalVisible} closable={false} destroyOnClose={true} footer={null}>
                Type your name and press ENTER <br/>
                <Input style={{ margin: '4px' }} onChange={e => setNameValue(e.target.value)} onKeyDown={onTextChange} value={nameValue}/>
                <br />
                <center>
                    <Button type='primary' onClick={sumbitName}> Submit </Button>
                </center>
            </Modal>
            <Modal className='blob' title="Unable to Connect to Server" visible={isSessionDisconnected} closable={false} destroyOnClose={true} footer={null}>
                <center>
                    <Button type='primary' onClick={() => { window.history.pushState(null, HOME_PAGE_URL); setSessionDisconnect(false);}}> Go To Home</Button>
                </center>
            </Modal>
        </>
    );
}

export default GatheringSpace;  