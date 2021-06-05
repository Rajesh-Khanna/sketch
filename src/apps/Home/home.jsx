import React from 'react';
import { Row, Col } from 'antd';

const EmptyPage = ({setactivateRoom}) => {

    const createRoom = () => {
        setactivateRoom(true);
    }

    return (
        <div>
            <h1> - Sketch - </h1>
            <Row justify='center'>
                <Col className='rooms-container'>
                    <button className='room-buttons' onClick={createRoom}> Create Room </button>
                </Col>
            </Row>
        </div>
    );
}

export default EmptyPage;