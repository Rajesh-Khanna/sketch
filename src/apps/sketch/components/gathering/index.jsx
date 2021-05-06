import React, { useState, useRef, useEffect} from 'react';
import { Input, Button, Card, Row, Col, Modal } from 'antd';
import { APP_STATE, META_TYPES } from '../../constants';
import { gridStyle } from '../../style';

const GatheringSpace = props => {
    const metaChannel = useRef();
    const [players, setPlayers] = useState([]);
    const [isNameModalVisible, setNameModalVisible ] = useState(true);
    const [nameValue, setNameValue ] = useState('player');
    // eslint-disable-next-line no-unused-vars
    const { userType, hostLobbyKey = '', dataChannel, setAppState, setMyInfo, setAllPlayers } = props;
    const [ shareURL, setShareURL] = useState('');
    const turns = useRef(); 
    const rounds = useRef(); 


    const startBoard = () => {
        metaChannel.current.send(JSON.stringify({type: META_TYPES.START_GAME, turns: turns.current.state.value, rounds: rounds.current.state.value }));
    }

    useEffect(() => {
        console.log({hostLobbyKey})
        setShareURL(window.location.protocol + "//" + window.location.host + window.location.pathname + `?k=${hostLobbyKey}`);
        metaChannel.current = dataChannel.current.getChannel('meta');

        metaChannel.current.onmessage = (message) => {
            console.log(message);
            const messageObj = JSON.parse(message.data);
            switch(messageObj.type){
                case META_TYPES.PLAYERS:
                    setPlayers(messageObj.players);
                    setAllPlayers(messageObj.players);
                    break;
                case META_TYPES.START_GAME:
                    setAppState(APP_STATE.ACTIVE_BOARD);
                    break;
                default:
                    console.log(messageObj);
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onTextChange = (e) => {
        if(e.key === 'Enter'){
            if(nameValue.length > 0) {
                const id = Math.random().toString(36).slice(-6);
                metaChannel.current.send(JSON.stringify({ type: META_TYPES.NEW_PLAYER, userId: id, name: nameValue }));
                setMyInfo(id,nameValue);
                setNameModalVisible(false);
            }
        }
    }

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
                        <center>
                        {
                            userType === 'HOST'?   
                                (
                                    <>
                                    <Input ref={turns} addonBefore="Timeout per turn" defaultValue={80} type="number" />
                                    <Input ref={rounds} addonBefore="Rounds" defaultValue={3} type="number" />
                                    <Button type="primary" onClick={startBoard}> Start Board </Button>
                                    </>
                                ):(
                                    'Waiting for host to start the game...'
                                )
                        }
                        </center>
                        {
                            players ?
                            (
                                <Card>
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
            <Modal title="Basic Modal" visible={isNameModalVisible} closable={false} destroyOnClose={true} footer={null}>
                <Input onChange={e => setNameValue(e.target.value)} onKeyDown={onTextChange} value={nameValue}/>
            </Modal>
        </>
    );
}

export default GatheringSpace;  