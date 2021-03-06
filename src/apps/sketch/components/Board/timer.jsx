import React, {useEffect, useRef} from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';

const Timer = (props) => {
    const id = useRef(null);
    const { timer, setTimer, timerFlag } = props;

    const clear = () => {
        window.clearInterval(id.current);
    }

    useEffect(() => {
        id.current = window.setInterval(() => {
            if(timer >0)
                setTimer((time)=>time-1)
        },1000)
        return ()=>clear();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timerFlag]);

    useEffect(() => {
        if (timer <= 0) {
            clear();
        }
    }, [timer]);

    return (
        <div className="Timer">
            <div style={{ paddingLeft: '4px' }}><ClockCircleOutlined /> {timer} sec </div>
        </div>
    );
}

export default Timer;