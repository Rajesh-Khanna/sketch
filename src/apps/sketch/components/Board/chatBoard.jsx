import React, {useEffect, useState} from 'react';
import { Row, Col } from 'antd';

import { VariableSizeList as List } from 'react-window';
import { CHAT_TYPE } from './../../constants';
  
const ChatBoard = props => {

    const { chat, getMyInfo, getPlayerById } = props;
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
        if (event.key === "Enter") {
            console.log(event.target.value);
            chat.send(JSON.stringify({type: CHAT_TYPE.GUESS, userId: getMyInfo().id, data: event.target.value}));
            event.target.value = '';
        }
    };

    const MessageRow = ({ index, style }) => {
        const name = getPlayerById(messages[index].userId).name;
        const msg = messages[index].data
        if(messages[index].type === CHAT_TYPE.SOLVED){
            return(
                <div style={style} color='yellow'><b>{name}: GUESSED CORRECTLY</b></div>
            )
        }
        return(
            <div style={style}><b>{name}: </b>{msg}</div>
        )
    }

    return (
      <div style={{border: '2px solid black'}}>
        <Row>
            <Col>
                <input placeholder="Enter to send" onKeyDown={handleKeyDown} />
            </Col>
        </Row>
        <Row>
            <Col>
                <List
                    height={150}
                    itemCount={messages.length}
                    itemSize={() => 25}
                    width={300}
                >
                    {MessageRow}
                </List>
            </Col>
        </Row>
      </div>
    );
}

export default ChatBoard;
