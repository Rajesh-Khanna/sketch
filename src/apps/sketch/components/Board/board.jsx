import React from 'react';
import SketchBoard from './sketchBoard';

const Board = props => {

    const { sketchChannel } = props;

    return (
      <>
        <SketchBoard sketchChannel = {sketchChannel}/>
      </>
    );
}

export default Board;