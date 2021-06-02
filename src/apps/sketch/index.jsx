import React, {useEffect, useRef, useState} from 'react';
import {Button, Layout, Row, Col, Modal} from 'antd';

import { APP_STATE, SKETCH_CHANNELS, firebaseConfig, HOME_PAGE_URL } from './constants';

// componenets
import SketchHost from './components/sketchHost/SketchHost';
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
    const [isSessionDisconnected, setSessionDisconnect] = useState(false);
    const roomId = useRef('');
    const userType = useRef('');
    const disconnectMessage = useRef('Unable to Connect to Server, Try Refreshing the page');
    
    const { Header, Content } = Layout;
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

    const setSessionState = (connectionState, isOfferReceived) => {
        console.log(connectionState, isOfferReceived);
        if (connectionState === 'failed') {
            if(isOfferReceived === false) {
                disconnectMessage.current = "You are trying to connect to an inactive game, please recheck the url"
            }
            else {
                disconnectMessage.current = "Sorry, A technical issue from our side, please reload the page"
            }
            setSessionDisconnect(true);
            setAppState(APP_STATE.DISCONNECTED);
        } else if(connectionState === 'unknown') {
            setSessionDisconnect(true);
            setAppState(APP_STATE.DISCONNECTED);
        }
    };

    const handleGuest = (lobbyKey) => {
        // write guest setup logic
        dataChannel.current = new rtcFirebase.Guest(lobbyKey, firebaseConfig, SKETCH_CHANNELS , () => {
            console.log('APP_STATE.GATHERING');
            setAppState(APP_STATE.GATHERING);
        }, (connectionState, isOfferReceived) => {setSessionState(connectionState, isOfferReceived)});
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Layout className='gradientBg fullHeight' >
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
            <Content className='fullHeight' style={{ padding: '8px', height: '100%' }}>
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
                        case APP_STATE.DISCONNECTED:
                            return (
                                <Modal className='blob' title={disconnectMessage.current} visible={isSessionDisconnected} closable={false} destroyOnClose={true} footer={null}>
                                    <center>
                                        <Button type='primary' onClick={() => { window.history.pushState(null, HOME_PAGE_URL); setSessionDisconnect(false);}}> Go To Home</Button>
                                    </center>
                                </Modal>
                            );
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
            {/* <Footer style={{ textAlign: 'center' }}> 
                Authors: <a  target="_blank" rel='noreferrer' style={{paddingRight: '5px'}} href="https://github.com/Rajesh-Khanna">@Rajesh</a>
                <a  target="_blank" rel='noreferrer' href="https://github.com/theVirtualMan">@Rohit</a>
            </Footer>  */}
        </Layout>
    );
}

export default Sketch;
