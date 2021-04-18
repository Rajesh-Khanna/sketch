import React, {useEffect, useState} from 'react';
import { Row, Col } from 'antd';


const ChatBoard = props => {

    const { chat } = props;
    const [messages, setMessage] = useState([]);
    useEffect(() => {
        chat.onmessage = (message) => {
            setMessage(prev => {
                return [...prev, message.data];
            });
        }
    }, []);

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            console.log(event.target.value);
          chat.send(event.target.value);
          event.target.value = '';
        }
    };
    return (
      <>
        <Row>
            <Col>
              {
                <ul>
                    {
                        messages.map(message => {
                            return <li key={message}>{message}</li>
                        })
                    }
                </ul>
              }
            </Col>
        </Row>
        <Row>
            <Col>
                <input placeholder="Enter to send" onKeyDown={handleKeyDown} />
            </Col>
        </Row>
      </>
    );
}

export default ChatBoard;