import React, {useEffect, useState} from 'react';
import { Row, Col } from 'antd';

import { VariableSizeList as List } from 'react-window';
  
const ChatBoard = props => {

    const { chat } = props;
    const [messages, setMessage] = useState([]);
    useEffect(() => {
        chat.onmessage = (message) => {
            setMessage(prev => {
                return [message.data, ...prev];
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            console.log(event.target.value);
          chat.send(event.target.value);
          event.target.value = '';
        }
    };

    const MessageRow = ({ index, style }) => (
        <div style={style}>{messages[index]}</div>
    );      

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
