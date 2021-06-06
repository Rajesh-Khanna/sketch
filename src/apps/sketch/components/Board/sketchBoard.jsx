/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef } from "react";
import { DEFAULT_BACKGROUND_COLOR } from './../../constants';
import { isScreenLarge } from './../../utils';


export default function SketchBoard(props) {

    const { brush, disable, refresh, sketchBoardRef, paletteHandler, fillColorFlag, undo, setUndo } = props;

    const { getColor } = paletteHandler;
    const canvasRef = useRef(null);
    const contextRef = useRef(null);      

    const undoHistory = useRef([]);

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

      context.strokeStyle = getColor();
      context.lineWidth = props.font;
      contextRef.current = context;

    };
  
    const isDrawing = useRef(false);
    const startPos = useRef({});

    const setIsDrawing = (val) => {
        isDrawing.current = val;
    }

    const draw = ({ start, end, thick, color }) => {
        console.log({color, color2: getColor()});
        contextRef.current.strokeStyle = (color || getColor()) === 'eraser'? DEFAULT_BACKGROUND_COLOR : color || getColor();
        contextRef.current.lineWidth = thick || props.font;
        contextRef.current.beginPath();
        contextRef.current.moveTo(start.x, start.y);
        contextRef.current.lineTo(end.x, end.y);
        contextRef.current.stroke();
        contextRef.current.closePath();
    }

    const getRGB = (data, x, y) => {
        const index = y * (canvasRef.current.width * 4) + x * 4;
        const rgba = `rgba(${data[index]}, ${data[index+1]}, ${data[index+2]}, ${data[index+3] / 255})`;
        return rgba;
    }

    const setRGB = (data, targetRGBA, x, y) => {
        const index = y * (canvasRef.current.width * 4) + x * 4;

        // console.log('previous colors: ',data[index],data[index+1],data[index+2],data[index+3]);
        data[index] = targetRGBA[0];
        data[index+1] = targetRGBA[1];
        data[index+2] = targetRGBA[2];
        data[index+3] = targetRGBA[3];
        // console.log('after colors: ',data[index],data[index+1],data[index+2],data[index+3]);
    }

    const hexToRGBA = (hex) => {
        var c;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length === 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return [(c>>16)&255, (c>>8)&255, c&255, 1];
        }
    }

    const fillColor = (point) => {
        console.log('pointer pointed to: ',point);
        console.log('canvas width: ',canvasRef.current.width);
        console.log('canvas height: ',canvasRef.current.height);

        var pixel = contextRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
        var data = pixel.data;

        let copiedData = Object.assign({}, data);


        const pointerRGBA = getRGB(copiedData,point.x,point.y);
        console.log('pixel color: ',pointerRGBA);

        var targetRGBA = hexToRGBA(getColor())
        console.log('target fill color rgba:', targetRGBA);

        var visited = new Array(canvasRef.current.width);

        for (var i = 0; i < visited.length; i++) {
            visited[i] = new Array(canvasRef.current.height);
        }
        for ( i = 0; i < visited.length; i++) {
            for (var j = 0; j < visited[i].length; j++) {
                visited[i][j] = 0;
            }
        }

        let arr = [{x:point.x, y:point.y}];
        var p;
        while(!(arr.length === 0)) {
            p = arr[arr.length - 1];
            // if(visited[p.x][p.y]===1) {
            //     arr.pop();
            //     continue;
            // }
            // console.log(p);
            visited[p.x][p.y] = 1;
            arr.pop();
            if (pointerRGBA === getRGB(copiedData,p.x,p.y)) {
                setRGB(data, targetRGBA, p.x, p.y);

                if (p.x>0 && p.y>0 && visited[p.x-1][p.y-1]===0) {
                    arr.push({x:p.x-1,y:p.y-1});
                    visited[p.x-1][p.y-1] = 1;
                }
                if (p.y>0 && visited[p.x][p.y-1]===0) {
                    arr.push({x:p.x,y:p.y-1});
                    visited[p.x][p.y-1] = 1;
                }
                if (p.x<canvasRef.current.width-1 && p.y>0 && visited[p.x+1][p.y-1]===0) {
                    arr.push({x:p.x+1,y:p.y-1});
                    visited[p.x+1][p.y-1] = 1;
                }
                if (p.x>0 && visited[p.x-1][p.y]===0) {
                    arr.push({x:p.x-1,y:p.y});
                    visited[p.x-1][p.y] = 1;
                }
                if (p.x<canvasRef.current.width-1 && visited[p.x+1][p.y]===0) {
                    arr.push({x:p.x+1,y:p.y});
                    visited[p.x+1][p.y] = 1;
                }
                if (p.x>0 && p.y<canvasRef.current.height-1 && visited[p.x-1][p.y+1]===0) {
                    arr.push({x:p.x-1,y:p.y+1});
                    visited[p.x-1][p.y+1] = 1;
                }
                if (p.y<canvasRef.current.height-1 && visited[p.x][p.y+1]===0) {
                    arr.push({x:p.x,y:p.y+1});
                    visited[p.x][p.y+1] = 1;
                }
                if (p.x<canvasRef.current.width-1 && p.y<canvasRef.current.height-1 && visited[p.x+1][p.y+1]===0) {
                    arr.push({x:p.x+1,y:p.y+1});
                    visited[p.x+1][p.y+1] = 1;
                }
            }
        }
        contextRef.current.putImageData(pixel,0,0);
    }

    const startDrawing = (event) => {
        // const { offsetX, offsetY } = nativeEvent;
        const { offsetX, offsetY } = event.nativeEvent;
        var rect = canvasRef.current.getBoundingClientRect();
        startPos.current = {x: offsetX || event.touches[0].clientX - rect.left, y: offsetY || event.touches[0].clientY - rect.top};
        contextRef.current.strokeStyle = getColor();
        setIsDrawing(true);
        if (fillColorFlag) {
            fillColor(startPos.current);
        }
    };

    const finishDrawing = () => {
        setIsDrawing(false);
        // limiting undo to 5 steps only (to save memory). Might increase it later after testing
        if(undoHistory.current.length === 5) {
            undoHistory.current.shift();
        }
        console.log('saving history...');
        undoHistory.current.push(contextRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height));
    };

    const send = (start, end) => {
        start = {x: start.x / canvasRef.current.width, y: start.y / canvasRef.current.height };
        end = {x: end.x / canvasRef.current.width, y: end.y / canvasRef.current.height };
        console.log({color: getColor()});
        brush.send(JSON.stringify( { start, end, thick: props.font, color: getColor() } ));
    }

    const mouseMove = (event) => {
        if (!isDrawing.current || disable)
            return;
        const { offsetX, offsetY } = event.nativeEvent;
        var rect = canvasRef.current.getBoundingClientRect();

        const end = {x: offsetX || event.touches[0].clientX - rect.left, y: offsetY || event.touches[0].clientY - rect.top};
        draw({ start: startPos.current, end } );
        send(startPos.current, end);
        startPos.current = end;
    }

    const projectPoints = (point) => {
        let { start, end } = point;
        start = {x: start.x * canvasRef.current.width, y: start.y * canvasRef.current.height };
        end = {x: end.x * canvasRef.current.width, y: end.y * canvasRef.current.height };
        return { ...point, start, end };
    }

    useEffect(() => {
        brush.onmessage = (message) => {
            if( Array.isArray(message.data)){
                const points = JSON.parse(message.data);
                points.forEach(point => {
                    draw(projectPoints(point));
                });
            }else{
                draw(projectPoints(JSON.parse(message.data)));
            }
        }

    }, []);

    useEffect(() => {
        if(undo === true) {
            setUndo(false);
            if(!(undoHistory.current.length === 0)) {
                console.log('retrieving history...');
                var pix = undoHistory.current[undoHistory.current.length-1];
                undoHistory.current.pop();
                contextRef.current.putImageData(pix,0,0);
            }
        }
    }, [undo]);

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
                onTouchStart={startDrawing}
                onTouchEnd={finishDrawing}
                onTouchMove={mouseMove}
                ref={canvasRef}
            />
        </center>
    );

    // return <Sketch setup={setup} draw={draw} />;
}