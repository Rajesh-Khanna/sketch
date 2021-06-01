import React, {useEffect, useRef, useState} from 'react';
import { APP_STATE, SKETCH_CHANNELS, firebaseConfig } from './constants';

// componenets
import SketchHost from './components/sketchHost/SketchHost';
import { Layout, Row, Col } from 'antd';
import GatheringSpace from './components/gathering/index';
import Board from './components/Board/board';
import rtcFirebase from 'webrtc-firebase';
// utils
import { insertParam } from './utils';
// import sketchSync from './comms/sketchChannels';
// import { sketchChannelHandler, messageChannelHandler } from './comms/channels';

// import { Host, Guest } from './communication/HG';
import { ActivityManager } from './communication/ActivityManager';

const Sketch = () => {
    const dataChannel = useRef();
    const myInfo = useRef({});
    const allPlayers = useRef({});
    // eslint-disable-next-line no-unused-vars
    const [appState, setAppState] = useState(); 
    const [hostLobbyKey, setHostLobbyKey] = useState(null);
    const roomId = useRef('');
    const userType = useRef('');
    
    const { Header, Footer, Content } = Layout;
    const setRoomId = (id) => {
        roomId.current = id;
    }

    const setAllPlayers = (data) => {
        allPlayers.current = data.reduce((acc, curr) => {
            return { [curr.userId]: { name: curr.name }, ...acc };
        }, {});
    } 

    const getPlayerById = (id) => {
        return allPlayers.current[id] || { name: 'MISSING' };
    }
 
    const setMyInfo = (id, name) => {
        myInfo.current = { id, name };
    }

    const getMyInfo = () => myInfo.current;

    const handleGuest = (lobbyKey) => {
        // write guest setup logic
        dataChannel.current = new rtcFirebase.Guest(lobbyKey, firebaseConfig, SKETCH_CHANNELS , () => {
            console.log('APP_STATE.GATHERING');
            setAppState(APP_STATE.GATHERING);
        });
        userType.current = 'GUEST';
    }

    const handleHost = (onLobbyKey) => {
        // write hosting logic
        const activityManager = new ActivityManager();
        dataChannel.current = new rtcFirebase.RoomHost(onLobbyKey, firebaseConfig, SKETCH_CHANNELS, activityManager);
        userType.current = 'HOST';
        setAppState(APP_STATE.GATHERING);
    }

    // useEffects
    useEffect(() => {
        window.addEventListener("beforeunload", function (e) {
            var confirmationMessage = 'You will be disconnected from current session if you leave the page';
        
            (e || window.event).returnValue = confirmationMessage; //Gecko + IE
            return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
        });
        // window.beforeunload = ;

        const urlParams = new URLSearchParams(window.location.search);
        const lobbyKey = urlParams.get('k');
        console.log(lobbyKey);
        if(lobbyKey){
            setRoomId(lobbyKey);
            handleGuest(lobbyKey);
            setHostLobbyKey(lobbyKey);
        }
        else{
            handleHost((hostKey) => {
                insertParam('k', hostKey);
                setHostLobbyKey(hostKey);
            });
        }
    }, []);

    return (
        <Layout className='fullHeight'>
            <Header className='text-light'>
                <Row>
                    <Col md={{ span: 24 }} lg={{ span: 2, offset: 6 }} >
                        Sketch-Room
                    </Col>
                    <Col md={{ span: 24 }} lg={{ span: 2, offset: 6 }} >
                        Other games
                    </Col>
                    <Col md={{ span: 24 }} lg={{ span: 2 }} >
                        About us
                    </Col>
                </Row>
            </Header>
            <Content style={{ padding: '8px' }}>
            {(() => {
                    switch(appState) { 
                        case APP_STATE.HOST: 
                            return <SketchHost handleHost = {handleHost}/> 
                        case APP_STATE.GATHERING:
                            return <GatheringSpace 
                                        hostLobbyKey={hostLobbyKey} 
                                        userType={userType.current} 
                                        dataChannel={dataChannel} 
                                        setAppState={setAppState}
                                        setMyInfo={setMyInfo}
                                        setAllPlayers={setAllPlayers}
                                        myInfo={myInfo.current}
                                        allPlayers={allPlayers.current}
                                        getMyInfo={getMyInfo}
                                    />
                        case APP_STATE.PASSIVE_BOARD:
                            return <></>
                        case APP_STATE.ACTIVE_BOARD:
                            return <Board sketchChannel={dataChannel} getMyInfo={getMyInfo} getPlayerById={getPlayerById} allPlayers={allPlayers.current} />;
                        case APP_STATE.TERMINAL:
                            return <></>;
                        default:
                            <></>;
                    }
                })()
            }
            </Content>
            <Footer style={{ textAlign: 'center' }}> 
                Authors: <a  target="_blank" rel='noreferrer' style={{paddingRight: '5px'}} href="https://github.com/Rajesh-Khanna">@Rajesh</a>
                <a  target="_blank" rel='noreferrer' href="https://github.com/theVirtualMan">@Rohit</a>
            </Footer> 
        </Layout>
    );
}

export default Sketch;
