import React, { useState } from 'react';
import SketchBoard from './sketchBoard';
import Buttons from '../../buttons';

const Board = props => {
    // font and colours
    const [font, setFont] = useState(5);
    const [color, setColor] = useState('black');

    const handleFont = (f) => {
        setFont(f);
    }

    const handleColor = (c) => {
        setColor(c);
    }

    return (
        <>
          <SketchBoard sketchChannel = {props.sketchChannel} font = {font} color = {color}/>
          <Buttons handleFont={handleFont} handleColor={handleColor}/>
        </>
    );
}

export default Board;