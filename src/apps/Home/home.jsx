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
            <Row justify='center'>
                <Col md={12} className='room-text'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis totam eaque impedit sunt error praesentium dicta debitis vero? Debitis repudiandae maxime iure adipisci quam. Necessitatibus voluptate sunt laborum architecto rem?
                </Col>
            </Row>
        </div>
    );
}

export default EmptyPage;