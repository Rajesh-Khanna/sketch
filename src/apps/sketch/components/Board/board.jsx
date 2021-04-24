import React, { useEffect, useState } from 'react';
import SketchBoard from './sketchBoard';
import ChatBoard from './chatBoard';
import { Row, Col } from 'antd';
import Palette from '../../buttons';

import { MAX_FONT, MIN_FONT } from '../../constants';

const Board = props => {
    // font and colours
    const [font, setFont] = useState(5);
    const [color, setColor] = useState('black');

    const { sketchChannel } = props;
    const [ brush, setBrush ] = useState();
    const [ chat, setChat ] = useState();

    useEffect(() => {
      setBrush(sketchChannel.current.getChannel('brush'));
      setChat(sketchChannel.current.getChannel('chat'));
    }, []);

    const handleFont = (f) => {
      setFont(f);
    }

  const handleColor = (c) => {
      setColor(c);
  }

  const increaseFont = () => {
    setFont(prevFont => {
      return prevFont < MAX_FONT? prevFont + 1: prevFont;
    })
  }
  
  const reduceFont = () => {
    setFont(prevFont => {
      return prevFont > MIN_FONT? prevFont - 1 : prevFont;
    })
  }

  const paletteHandler = {
    font: handleFont,
    color: handleColor,
    getColor: () => { return color },
    increaseFont: increaseFont,
    reduceFont: reduceFont,
  }

  return (
    <Row>
      <Col xs={24} xl={20}>
        {
          brush 
            ? <>
                <SketchBoard brush = {brush} font = {font} color = {color} paletteHandler = {paletteHandler} />
                <Palette handleFont={handleFont} handleColor={handleColor}/>
              </>
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