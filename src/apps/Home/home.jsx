import React from 'react';
import { Row, Col } from 'antd';

const EmptyPage = () => {
    return (
        <div>
            <h1> - Sketch - </h1>
            <Row justify='center'>
                <Col className='rooms-container'>
                    <a className='room-buttons' href='/sketch/room'> Create Room </a> <br />
                </Col>
            </Row>
        </div>
    );
}

export default EmptyPage;