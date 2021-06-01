import React, {useEffect, useRef } from "react";
import { DEFAULT_BACKGROUND_COLOR } from './../../constants';
import { setCanvasSize, isScreenLarge } from './../../utils';


export default function SketchBoard(props) {

    const { brush, disable, refresh } = props;

    const canvasRef = useRef(null);
    const contextRef = useRef(null); 
  
    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
      

    const prepareCanvas = () => {
      const canvas = canvasRef.current
      const width = isScreenLarge()? window.innerWidth*4/6 : window.innerWidth;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${width/2}px`;

      canvas.width = width;
      canvas.height = width/2;

      const context = canvas.getContext("2d")
      context.fillStyle = DEFAULT_BACKGROUND_COLOR;
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.lineCap = "round";
      context.lineJoin = 'round'

      context.strokeStyle = "black";
      context.lineWidth = 2;
      contextRef.current = context;

    };
  
    const isDrawing = useRef(false);
    const startPos = useRef({});

    const setIsDrawing = (val) => {
        isDrawing.current = val;
    }

    const draw = ({ start, end, thick, color }) => {
        contextRef.current.strokeStyle = color || contextRef.current.strokeStyle;
        contextRef.current.lineWidth = thick || contextRef.current.lineWidth;
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
        brush.send(JSON.stringify( { start, end, thick: contextRef.current.lineWidth, color: contextRef.current.strokeStyle } ));
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
        prepareCanvas();
    }, [canvasRef]);
    
    useEffect(() => {
        contextRef.current.fillStyle = DEFAULT_BACKGROUND_COLOR;
        contextRef.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);  
    }, [refresh]);

    return (
        <canvas
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseMove={mouseMove}
          ref={canvasRef}
        />
    );

    // return <Sketch setup={setup} draw={draw} />;
}