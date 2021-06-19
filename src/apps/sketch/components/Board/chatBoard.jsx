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
        let row = <></>;
        if(messages[index].type === CHAT_TYPE.SOLVED){
            row = <b style={{ color:'green' }}>{name}: GUESSED CORRECTLY</b>;
        }
        else if(messages[index].type === CHAT_TYPE.CORRECT_WORD){
            row = <b style={{ color:'darkorange' }}>The Correct word is "{msg}"</b>;
        }else{
            row = (<span><b>{name}: </b>{msg}</span>);
        }
        return <div style={{ ...style, background: index % 2? '#ddd': '#fff', paddingLeft: '5px' }}>{row}</div>
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
                    height={400}
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
