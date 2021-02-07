import React from 'react';
import { Button } from 'antd';

const SketchHost = (props) => {
    const { handleHost } = props;

    return ( <> <Button type="primary" onClick={handleHost}> Host Now </Button> </> );
}

export default SketchHost;