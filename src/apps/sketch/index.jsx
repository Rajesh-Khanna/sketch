import React, {useEffect, useRef, useState} from 'react';
import { Modal, Row, Col } from 'antd';

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
        activityManager.setSignalEndOnStartGame(false);
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

    return (<>
        {(() => {
                switch(appState) { 
                    case APP_STATE.HOST: 
                        console.log('host state');
                        return <SketchHost handleHost = {handleHost}/> 
                    case APP_STATE.GATHERING:
                        console.log('gathering state');
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
                        console.log('disconnected state');
                        return (
                            <Modal className='blob' title={disconnectMessage.current} visible={isSessionDisconnected} closable={false} destroyOnClose={true} footer={null}>
                                <center>
                                    <a type='primary' href={HOME_PAGE_URL}> Go To Home</a>
                                </center>
                            </Modal>
                        );
                    case APP_STATE.PASSIVE_BOARD:
                        console.log('passive state');
                        return <></>
                    case APP_STATE.ACTIVE_BOARD:
                        console.log('active state');
                        return <Board sketchChannel={dataChannel} getMyInfo={getMyInfo} getPlayerById={getPlayerById} allPlayers={allPlayers.current} />;
                    case APP_STATE.TERMINAL:
                        console.log('terminal state');
                        return <></>;
                    default:
                        console.log('default state');
                        return (
                            <Row justify='center'>
                                <Col>
                                <section id="global">

                                    <div id="top" class="mask">
                                    <div class="plane"></div>
                                    </div>
                                    <div id="middle" class="mask">
                                    <div class="plane"></div>
                                    </div>

                                    <div id="bottom" class="mask">
                                    <div class="plane"></div>
                                    </div>
                                    <p id="connectingText" ><i>CONNECTING...</i></p>

                                    </section>
                                </Col>
                            </Row>
                        );
                }
            })()}
        </>);
}

export default Sketch;
