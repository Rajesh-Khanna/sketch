import React, { useState, useRef, useEffect} from 'react';
import { Input, Button, Card, Row, Col } from 'antd';
import { APP_STATE } from '../../constants';

const GatheringSpace = props => {
    const metaChannel = useRef();
    const userName = useRef('');
    const players = useRef([]);
    const [playerCount,setPlayerCount] = useState(0);
    const { userType, hostLobbyKey, dataChannel, setUserName, setPlayers, setAppState } = props;
    const [ shareURL, setShareURL] = useState('');

    const gridStyle = {
        width: '25%',
        textAlign: 'center',
    };

    const setName = (name) => {
        userName.current = name;
        setUserName(userName.current);
        let obj = {
            "ADD_PLAYER": name
        };
        metaChannel.current.send(JSON.stringify(obj));
        document.getElementById('waitingRoom').style.filter = 'blur(0px)'
        document.getElementById('userName').style.display = 'none';
    }

    const addPlayers = (name) => {
        const tempList = players.current.concat({name});
        console.log('troubleshoot');
        console.log(players.current);
        console.log(tempList);
        let obj = {
            "PLAYERS_LIST": tempList
        };
        players.current = tempList;
        metaChannel.current.send(JSON.stringify(obj));
        setPlayers(tempList);
    }

    // const onNewPlayer = (playerName) => {
    //     // addPlayer(playerName);
    //     setPlayerCount((pc) => pc+1);
    // }

    const startBoard = () => {
        let obj = {
            "ACTIVATE_BOARD": true
        }
        metaChannel.current.send(JSON.stringify(obj));
        setAppState(APP_STATE.ACTIVE_BOARD);
    }

    useEffect(() => {
        console.log({hostLobbyKey})
        setShareURL(window.location.protocol + "//" + window.location.host + window.location.pathname + `?k=${hostLobbyKey}`);
        metaChannel.current = dataChannel.current.getChannel('meta');
        if(!userName.current) {
            document.getElementById('waitingRoom').style.filter = 'blur(1px)'
            document.getElementById('userName').style.display = '';
        }
        if(userType === 'HOST') {
            metaChannel.current.onmessage = (message) => {
                console.log(message.data);
                const player = JSON.parse(message.data);
                if (player.ADD_PLAYER) {
                    addPlayers(player.ADD_PLAYER);
                }
            };
        }
        if(userType === 'GUEST') {
            metaChannel.current.onmessage = (message) => {
                console.log(message.data);
                const messageObj = JSON.parse(message.data);
                if (messageObj.PLAYERS_LIST) {
                    players.current = messageObj.PLAYERS_LIST;
                    setPlayers(messageObj.PLAYERS_LIST);
                }
                else if (messageObj.ACTIVATE_BOARD) {
                    setAppState(APP_STATE.ACTIVE_BOARD);
                }
            };
        }
    }, []);

    return (
        <>
            <div id = 'waitingRoom'>
                <Row justify='center'>
                    <Col span={12}>
                        <Row wrap={false} justify='center' align='middle'>
                            <Col flex="none">
                                <Card> Share this link </Card>
                            </Col>
                            <Col flex="auto">
                                <Card>{shareURL}</Card>
                            </Col>
                        </Row>
                        {
                            userType === 'HOST'?   
                                (
                                    <Button type="primary" onClick={startBoard}> Start Board </Button>
                                ):(
                                    'Waiting for host to start the game...'
                                )
                        }
                        {
                            players.current ?
                            (
                                <Card>
                                    {players.current.map((item) => (
                                        <Card.Grid style={gridStyle}>{item.name}</Card.Grid>
                                    ))}
                                </Card>
                            ):(
                                ''
                            )
                        }
                    </Col>
                </Row>
            </div>
            <div id = 'userName' style={{display: "none"}}>
                <Row justify='center'>
                    <Col span={12}>
                        <Input style={{ width: 150, textAlign: 'center' }} placeholder="Enter your name" onKeyDown = { (e) => {
                            if (e.key === "Enter") {
                                console.log(e.target.value); 
                                setName(e.target.value);
                            }
                        }}/>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default GatheringSpace;