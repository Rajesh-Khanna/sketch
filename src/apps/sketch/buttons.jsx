import React from 'react';
import { Button } from 'antd';

export default function buttons(props) {
    return (
        <div>
            <Button onClick={ () => props.handleFont(1)}> 1px </Button>
            <Button onClick={ () => props.handleFont(5)}> 5px </Button>
            <Button onClick={ () => props.handleFont(10)}> 10px </Button>
            <Button onClick={ () => props.handleColor('black')}> pen </Button>
            <Button onClick={ () => props.handleColor('eraser')}> eraser </Button>
        </div>
    );
}