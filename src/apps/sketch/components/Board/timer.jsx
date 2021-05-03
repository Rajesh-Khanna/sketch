import React, {useEffect, useRef} from 'react';

const Timer = (props) => {
    const id = useRef(null);
    const { timer, setTimer, timerFlag, handleTimeOut } = props;

    const clear = () => {
        window.clearInterval(id.current);
    }

    useEffect(() => {
        id.current = window.setInterval(() => {
            setTimer((time)=>time-1)
        },1000)
        //return ()=>clear();
    }, [timerFlag]);

    useEffect(() => {
        if (timer === 0) {
            clear();
            handleTimeOut();
        }
    }, [timer]);

    return (
        <div className="Timer">
            <div>Time left : {timer} </div>
        </div>
    );
}

export default Timer;