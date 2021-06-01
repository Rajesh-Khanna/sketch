/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef } from "react";
import { DEFAULT_BACKGROUND_COLOR } from './../../constants';
import { isScreenLarge } from './../../utils';


export default function SketchBoard(props) {

    const { brush, disable, refresh, sketchBoardRef } = props;

    const canvasRef = useRef(null);
    const contextRef = useRef(null);      

    const prepareCanvas = () => {
      const canvas = canvasRef.current
      const width = isScreenLarge()? window.innerWidth*5/8 : window.innerWidth - 10;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${width/2}px`;
      canvas.style.cursor = 'crosshair';

      canvas.width = width;
      canvas.height = width/2;

      const context = canvas.getContext("2d")
      context.fillStyle = DEFAULT_BACKGROUND_COLOR;
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.lineCap = "round";
      context.lineJoin = 'round'

      context.strokeStyle = props.color;
      context.lineWidth = props.font;
      contextRef.current = context;

    };
  
    const isDrawing = useRef(false);
    const startPos = useRef({});

    const setIsDrawing = (val) => {
        isDrawing.current = val;
    }

    const draw = ({ start, end, thick, color }) => {
        contextRef.current.strokeStyle = (color || props.color) === 'eraser'? DEFAULT_BACKGROUND_COLOR : props.color;
        contextRef.current.lineWidth = thick || props.font;
        contextRef.current.beginPath();
        contextRef.current.moveTo(start.x, start.y);
        contextRef.current.lineTo(end.x, end.y);
        contextRef.current.stroke();
        contextRef.current.closePath();
    }

    const startDrawing = ({nativeEvent}) => {
        const { offsetX, offsetY } = nativeEvent;
        startPos.current = { x: offsetX, y: offsetY };
        contextRef.current.strokeStyle = 'black';
        setIsDrawing(true);
    };

    const finishDrawing = () => {
        setIsDrawing(false);
    };

    const send = (start, end) => {
        brush.send(JSON.stringify( { start, end, thick: props.font, color: props.color } ));
    }

    const mouseMove = ({ nativeEvent }) => {
        if (!isDrawing.current || disable)
            return;
        const { offsetX, offsetY } = nativeEvent;
        const end = {x: offsetX, y: offsetY};
        draw({ start: startPos.current, end } );
        send(startPos.current, end);
        startPos.current = end;
    }

    useEffect(() => {
        brush.onmessage = (message) => {
            if( Array.isArray(message.data)){
                const points = JSON.parse(message.data);
                points.forEach(point => {
                    draw(point);
                })
            }else{
                draw(JSON.parse(message.data));
            }
        }

    }, []);

    useEffect(() => {
        console.log(sketchBoardRef);
    }, [sketchBoardRef]);

    useEffect(() => {
        prepareCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canvasRef]);
    
    useEffect(() => {
        contextRef.current.fillStyle = DEFAULT_BACKGROUND_COLOR;
        contextRef.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);  
    }, [refresh]);

    return (
        <center>
            <canvas
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={mouseMove}
                ref={canvasRef}
            />
        </center>
    );

    // return <Sketch setup={setup} draw={draw} />;
}