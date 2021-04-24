import React from 'react';
import { Button, Tooltip } from 'antd';

export default function Palette(props) {
    return (
        <div>
            <Button onClick={ () => props.handleFont(1)}> 1px </Button>
            <Button onClick={ () => props.handleFont(5)}> 5px </Button>
            <Button onClick={ () => props.handleFont(10)}> 10px </Button>
            <Tooltip placement="top" title='or click "d"'>
                <Button onClick={ () => props.handleColor('black')}> pen </Button>
            </Tooltip>
            <Tooltip placement="top" title='or click "e"'>
                <Button onClick={ () => props.handleColor('eraser')}> eraser </Button>
            </Tooltip>
        </div>
    );
}