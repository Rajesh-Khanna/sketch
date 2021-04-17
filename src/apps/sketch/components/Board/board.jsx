import React, { useEffect, useState } from 'react';
import SketchBoard from './sketchBoard';
import ChatBoard from './chatBoard';
import { Row, Col } from 'antd';

const Board = props => {

    const { sketchChannel } = props;
    const [ brush, setBrush ] = useState();
    const [ chat, setChat ] = useState();

    useEffect(() => {
      setBrush(sketchChannel.current.getChannel('brush'));
      setChat(sketchChannel.current.getChannel('chat'));
    }, []);

    return (
      <Row>
      <Col xs={24} xl={20}>
        {
          brush 
            ? <SketchBoard brush = {brush}/>
            : <></>
        }
      </Col>
      <Col xs={24} xl={4}>
      {
          chat 
            ? <ChatBoard chat = {chat} />
            : <></>
        }
        
      </Col>
    </Row>
    );
}

export default Board;