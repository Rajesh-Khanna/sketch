import React, {useEffect, useState} from 'react';
import { Row, Col } from 'antd';

import { VariableSizeList as List } from 'react-window';
import { CHAT_TYPE } from './../../constants';
  
const ChatBoard = props => {

    const { chat, getMyInfo, getPlayerById, disable, timer } = props;
    const [messages, setMessage] = useState([]);
    useEffect(() => {
        chat.onmessage = (message) => {
            setMessage(prev => {
                const data = JSON.parse(message.data);
                return [data, ...prev];
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !disable) {
            chat.send(JSON.stringify({type: CHAT_TYPE.GUESS, userId: getMyInfo().id, time: timer, data: event.target.value}));
            event.target.value = '';
        }
    };

    const MessageRow = ({ index, style }) => {
        const name = getPlayerById(messages[index].userId).name;
        const msg = messages[index].data
        const isDisplayCloseness = messages[index].isClose & (getMyInfo().id === messages[index].userId)

        if(messages[index].type === CHAT_TYPE.SOLVED){
            return(
                <div style={style}><b style={{ color:'green' }}>{name}: GUESSED CORRECTLY</b></div>
            )
        }
        else if(messages[index].type === CHAT_TYPE.CORRECT_WORD){
            return(
                <div style={style}><b style={{ color:'darkorange' }}>The Correct word is "{msg}"</b></div>
            )
        }
        else if(isDisplayCloseness) {
            return (
                    <div style={style}><b>{name}: </b>{msg} <b style={{ color:'orange' }}>(is close!)</b></div>
            )
        }
        return(
            <div style={style}><b>{name}: </b>{msg}</div>
        )
    }

    return (
      <div className='roboto_font halfHeight' style={{border: '2px solid black'}}>
        <Row>
            <Col span='24'>
                <input style={{ width: '100%', border: 'none', borderBottom: 'solid thin' }} placeholder="Enter to send" onKeyDown={handleKeyDown} disabled={disable}/>
            </Col>
        </Row>
        <Row>
            <Col>
                <List
                    height={150}
                    width={250}
                    itemCount={messages.length}
                    itemSize={() => 25}
                >
                    {MessageRow}
                </List>
            </Col>
        </Row>
      </div>
    );
}

export default ChatBoard;
