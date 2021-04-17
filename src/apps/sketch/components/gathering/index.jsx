import React, { useState, useEffect} from 'react';
import { Button, Card, Row, Col } from 'antd';

const GatheringSpace = props => {

    const { userType, startBoard, hostLobbyKey } = props;
    const [ shareURL, setShareURL] = useState('');
    useEffect(() => {
        console.log({hostLobbyKey})
        setShareURL(window.location.protocol + "//" + window.location.host + window.location.pathname + `?k=${hostLobbyKey}`);
    }, [hostLobbyKey]);

    return (
        <>
            <Row justify='center'>
                <Col span={12}>
                    {
                    userType === 'HOST'? 
                        (
                            <>
                                <Row wrap={false} justify='center' align='middle'>
                                    <Col flex="none">
                                        <Card> Share this link </Card>
                                    </Col>
                                    <Col flex="auto">
                                        <Card>{shareURL}</Card>
                                    </Col>
                                </Row>        
                                <Button type="primary" onClick={startBoard}> Start Board </Button>
                            </>
                        ):(
                            'Host is connecting...'
                        )
                    }
                </Col>
            </Row>
        </>
    )
}

export default GatheringSpace;