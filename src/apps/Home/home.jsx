import React from 'react';
import { Row, Col } from 'antd';

const EmptyPage = ({setactivateRoom}) => {

    const createRoom = () => {
        setactivateRoom(true);
    }

    return (
        <div>
            <Row justify='center'>
                <Col>
                    <div class="patterns">
                        <svg width="100%" height="100%">
                            <defs>
                                <style>
                                    @import url("https://fonts.googleapis.com/css?  family=Lora:400,400i,700,700i");
                                </style>            
                            </defs>
                            <rect x="0" y="0" width="100%" height="100%" fill="url(#polka-dots)"> </rect>
                            <text x="50%" y="40%"  text-anchor="middle"  >
                                Sketch
                            </text>
                        </svg>
                    </div>
                    
                </Col>
            </Row>
            <Row justify='center'>
                <Col className='rooms-container'>
                    <button className='room-buttons' onClick={createRoom}> Create Room </button>
                </Col>
            </Row>
            <Row justify='center'>
                <Col className='introText' sm={24} md={16} lg={8}>
                    <center><h3>How to play?</h3></center>
                    <p>
                        Click on create room and a link will be generated. Share that link with your friends for them to join this room, and you can start the game when everyone joined.
                    </p>
                    <h3>Rules of the game</h3>
                    <ul>
                        <li>Its a simple game of pictionary</li>
                        <li>The drawer will be given a word which he has to convey to his friends by drawing</li>
                        <li>The faster other players guess the word from the drawing greater the points that they get</li>
                        <li>In this fashion each player will get an chance to draw per round</li>
                        <li>Finally who ever has the highest score wins</li>
                    </ul>
                </Col>
            </Row>
        </div>
    );
}

export default EmptyPage;