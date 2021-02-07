import userEvent from '@testing-library/user-event';
import React from 'react';
import { Button } from 'antd';

const GatheringSpace = props => {

    const { userType, startBoard } = props;

    return (
        <>
            {
                userType === 'HOST'? 
                    (
                        <Button onClick={startBoard}> Start Board </Button>
                    ):(
                        'Host is connecting...'
                    )
            }
        </>
    )
}

export default GatheringSpace;