import React from 'react';
import { Button, Slider, Col, Row, Tooltip } from 'antd';

import {MAX_FONT, MIN_FONT} from '../constants'
import { IoMdColorFill } from 'react-icons/io';
import { FaEraser, FaPaintBrush, FaUndo, FaTrashAlt } from 'react-icons/fa';

export default function Palette(props) {

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
        
        return  colors.map(color => <Col> <Button className='colorButton' style={{ backgroundColor: color}} onClick={ () => { props.handleColor(color) } } > </Button> </Col>)
    }

    const marks = {
        [MIN_FONT]: MIN_FONT,
        [MAX_FONT]: MAX_FONT,
    }

    return (
        <div>
            <Row>
                <Col md={24} lg={12} style={{ padding: '5px' }}>
                    <Row justify="space-around">
                        <Col>
                            <Tooltip title = 'small'>
                                <Button className='actionButton' onClick={ () => props.handleFont(2)}> small </Button>
                            </Tooltip>
                        </Col>
                        <Col>
                            <Tooltip title = 'medium'>
                                <Button className='actionButton' onClick={ () => props.handleFont(25)}> md </Button>
                            </Tooltip>
                        </Col>
                        <Col>
                            <Tooltip title = 'large'>
                                <Button className='actionButton' onClick={ () => props.handleFont(60)}> lg  </Button>
                            </Tooltip>
                        </Col>
                        <Col>
                            <Tooltip title = 'undo'>
                                <Button className='actionButton' onClick={ () => props.handleUndo()}> <FaUndo /> </Button>
                            </Tooltip>
                        </Col>
                        <Col>
                            <Tooltip title = 'clear screen'>
                                <Button className='actionButton' onClick={ () => props.handleClear()}> <FaTrashAlt /> </Button>
                            </Tooltip>
                        </Col>
                        <Col>
                            <Tooltip title = 'color Bucket'>
                                <Button className='actionButton' onClick={ () => props.handleFillColor(true)}> <IoMdColorFill /> </Button>
                            </Tooltip>
                        </Col>
                        <Col>
                            <Tooltip title = 'brush'>
                                <Button className='actionButton' onClick={ () => {props.handleColor('black'); props.handleFillColor(false)}}> <FaPaintBrush/> </Button>
                            </Tooltip>
                        </Col>
                        <Col>
                            <Tooltip title = 'eraser'>
                                <Button className='actionButton' onClick={ () => props.handleColor('eraser')}> <FaEraser/> </Button>
                            </Tooltip>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Slider
                                className='sizeSlider'
                                marks={marks}
                                ref={props.sizeRef}
                                min={MIN_FONT}
                                max={MAX_FONT}
                                onChange={props.onFontSlider}
                                defaultValue={10}
                                value={props.font}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col md={24} lg={12} style={{ padding: '5px' }}>
                    <Row>
                        <ColorOptions />
                    </Row>
                </Col>
            </Row>
        </div>
    );
}