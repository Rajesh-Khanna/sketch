import React from 'react';
import { Button, Tooltip, Slider, Card } from 'antd';

export default function Palette(props) {

    var circleStyle = {
        display:"inline-block",
        backgroundColor: props.color === 'eraser'? 'white' : props.color,
        borderRadius: props.color === 'eraser'? '0%' : "50%",
        borderStyle: props.color === 'eraser'? 'solid': 'none',
        width: props.font,
        height: props.font,
      };


    const ColorOptions = () => {
        const colors = [ '#000000',
            '#464646',
            '#787878',
            '#b4b4b4',
            '#dcdcdc',
            '#ffffff',
            '#990030',
            '#9c5a3c',
            '#ed1c24',
            '#ffa3b1',
            '#ff7e00',
            '#e5aa7a',
            '#ffc20e',
            '#f5e49c',
            '#fff200',
            '#fff9bd',
            '#a8e61d',
            '#d3f9bc',
            '#22b14c',
            '#9dbb61',
            '#00b7ef',
            '#99d9ea',
            '#4d6df3',
            '#709ad1',
            '#2f3699',
            '#546d8e',
            '#6f3198',
            '#b5a5d5', ];
        
        return  colors.map(color => <Card.Grid style={{ backgroundColor: color, width: '10px' }} onClick={ () => { props.handleColor(color) } } ></Card.Grid>)
    }

    return (
        <div>
            <Slider
                ref={props.sizeRef}
                min={1}
                max={80}
                onChange={props.onFontSlider}
                defaultValue={10}
                value={props.font}
            />
            <Button onClick={ () => props.handleFont(1)}> 1px </Button>
            <Button onClick={ () => props.handleFont(5)}> 5px </Button>
            <Button onClick={ () => props.handleFont(10)}> 10px </Button>

            <Tooltip placement="top" title='or click "d"'>
                <Button onClick={ () => props.handleColor('black')}> pen </Button>
            </Tooltip>
            <Tooltip placement="top" title='or click "e"'>
                <Button onClick={ () => props.handleColor('eraser')}> eraser </Button>
            </Tooltip>
            <Card title="Card Title">
                <ColorOptions />
            </Card>,
            <Card bordered style={{ width: 150, height: 150, textAlign:'center'}}>
                <div style={circleStyle}>
                </div>
            </Card>
        </div>
    );
}