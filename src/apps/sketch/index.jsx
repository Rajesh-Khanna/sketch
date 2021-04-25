import React, {useEffect, useRef, useState} from 'react';
import {APP_STATE} from './constants';

// componenets
import SketchHost from './components/sketchHost/SketchHost';
import { Layout } from 'antd';
import GatheringSpace from './components/gathering/index';
import Board from './components/Board/board';

// utils
import { insertParam } from './utils';
// import sketchSync from './comms/sketchChannels';
// import { sketchChannelHandler, messageChannelHandler } from './comms/channels';

import { Host, Guest } from './communication/HG';

const Sketch = () => {
    const dataChannel = useRef();
    const [players, setPlayers] = useState([]);
    const [userName, setUserName] = useState();
    const [appState, setAppState] = useState(); 
    const [hostLobbyKey, setHostLobbyKey] = useState(null);
    const roomId = useRef('');
    const userType = useRef('');
    
    const { Header, Footer, Content } = Layout;
    const setRoomId = (id) => {
        roomId.current = id;
    }

    const handleGuest = (lobbyKey) => {
        // write guest setup logic
        dataChannel.current = new Guest(lobbyKey, () => {
            setAppState(APP_STATE.GATHERING);
        });
        userType.current = 'GUEST';
    }

    const handleHost = (onLobbyKey) => {
        // write hosting logic
        dataChannel.current = new Host(onLobbyKey);
        userType.current = 'HOST';

        setAppState(APP_STATE.GATHERING);
    }

    // useEffects
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const lobbyKey = urlParams.get('k');
        if(lobbyKey){
            setRoomId(lobbyKey);
            handleGuest(lobbyKey);
        }
        else{
            handleHost((hostKey) => {
                insertParam('k', hostKey);
                setHostLobbyKey(hostKey);
            });
        }
    }, []);

    return (
        <Layout>
            <Header className='text-light'>Sketch Room</Header>
            <Content>
            {(() => {
                    switch(appState) { 
                        case APP_STATE.HOST: 
                            return <SketchHost handleHost = {handleHost}/> 
                        case APP_STATE.GATHERING:
                            return <GatheringSpace 
                                        hostLobbyKey={hostLobbyKey} 
                                        userType={userType.current} 
                                        dataChannel={dataChannel} 
                                        setUserName={setUserName}
                                        setPlayers={setPlayers}
                                        setAppState={setAppState}
                                    />
                        case APP_STATE.PASSIVE_BOARD:
                            return <></>
                        case APP_STATE.ACTIVE_BOARD:
                            return <Board sketchChannel={dataChannel}/>;
                        case APP_STATE.TERMINAL:
                            return <></>;
                        default:
                            <></>;
                    }
                })()
            }
            </Content>
            <Footer> license </Footer> 
        </Layout>
    );
}

export default Sketch;