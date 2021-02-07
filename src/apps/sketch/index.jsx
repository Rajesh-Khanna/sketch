import React, {useState, useEffect, useRef} from 'react';
import {APP_STATE} from './constants';

// componenets
import SketchHost from './components/sketchHost/SketchHost';
import { Layout } from 'antd';
import GatheringSpace from './components/gathering/index';
import Board from './components/Board/board';

// utils
import { getURLParam } from './utils';
import sketchSync from './comms/sketchChannels';
import { sketchChannelHandler, messageChannelHandler } from './comms/channels';

const Sketch = () => {
    const [appState, setAppState] = useState(); 
    const roomId = useRef('');
    const userType = useRef('');
    
    const sketchIncoming = useRef([]);
    const messageIncoming = useRef([]);

    const sketchReciever = message => {
        sketchIncoming.current.push(message);
    }
    const messageReciever = message => {
        messageIncoming.current.push(message);
    }
    
    const sketchChannel = new sketchChannelHandler(sketchReciever);
    const messageChannel = new messageChannelHandler(messageReciever);
    
    const syncBoard = new sketchSync(sketchChannel, messageChannel);

    const { Header, Footer, Content } = Layout;
    const setRoomId = (id) => {
        roomId.current = id;
    }

    const handleGuest = () => {
        // write guest setup logic
        syncBoard.startGUEST();
        userType.current = 'GUEST';

        setAppState(APP_STATE.GATHERING);
    }

    const handleHost = () => {
        // write hosting logic
        syncBoard.startHOST();
        userType.current = 'HOST';

        setAppState(APP_STATE.GATHERING);
    }

    const startBoard = () => {
        setAppState(APP_STATE.ACTIVE_BOARD);
    }

    // useEffects
    useEffect(() => {
        const id = getURLParam('id');
        if(id){
            setRoomId(id);
            handleGuest(id);
        }
        else
            setAppState(APP_STATE.HOST);
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
                            return <GatheringSpace userType={userType.current} startBoard={startBoard}/>
                        case APP_STATE.PASSIVE_BOARD:
                            return <></>
                        case APP_STATE.ACTIVE_BOARD:
                            return <Board sketchChannel={sketchChannel}/>;
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