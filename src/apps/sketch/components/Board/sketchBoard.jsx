/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState } from "react";
import { DEFAULT_BACKGROUND_COLOR, BRUSH_TYPE } from './../../constants';
import { isScreenLarge } from './../../utils';

import Palette from './../Palette';

export default function SketchBoard(props) {

    // font and colours
    const [font, setFont] = useState(5);
    const [color, setColor] = useState('#000000');
    const [fillColor, setFillColor] = useState(false);
    const sizeRef = useRef();

    const { brush, disable, refresh, sketchBoardRef } = props;

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
      context.lineWidth = font;
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
        contextRef.current.lineWidth = thick || font;
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
            return [(c>>16)&255, (c>>8)&255, c&255, 255];
        }
    }

    const fillBackgroundColor = (point, color) => {
        console.log('pointer pointed to: ',point);
        console.log('canvas width: ',canvasRef.current.width);
        console.log('canvas height: ',canvasRef.current.height);

        var pixel = contextRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
        var data = pixel.data;

        let copiedData = Object.assign({}, data);

        const pointerRGBA = getRGB(copiedData,point.x,point.y);
        console.log('pixel color: ',pointerRGBA);

        var targetRGBA = hexToRGBA(color || getColor())
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
        if (fillColor) {
            fillBackgroundColor(startPos.current);
            let brushObj = {
                type: BRUSH_TYPE.FILL,
                data: {point: {x: startPos.current.x / canvasRef.current.width, y: startPos.current.y / canvasRef.current.height }, color: getColor() || '#ffffff'}
            }
            brush.send(JSON.stringify(brushObj));
        }
    };

    const saveHistory = () => {
        // limiting undo to 5 steps only (to save memory). Might increase it later after testing
        if(undoHistory.current.length === 5) {
            undoHistory.current.shift();
        }
        console.log('saving history...');
        undoHistory.current.push(contextRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height));
    }

    const retrieveHistory = () => {
        if(!(undoHistory.current.length === 0)) {
            console.log('retrieving history...');
            var pix = undoHistory.current[undoHistory.current.length-1];
            undoHistory.current.pop();
            contextRef.current.putImageData(pix,0,0);
        }
    }

    const finishDrawing = () => {
        setIsDrawing(false);

        // save history
        let brushObj = {
            type: BRUSH_TYPE.SAVE,
        }
        brush.send(JSON.stringify(brushObj));
    };

    const send = (start, end) => {
        start = {x: start.x / canvasRef.current.width, y: start.y / canvasRef.current.height };
        end = {x: end.x / canvasRef.current.width, y: end.y / canvasRef.current.height };
        console.log({color: getColor()});
        let brushObj = {
            type: BRUSH_TYPE.DRAW,
            data: { start, end, thick: font, color: getColor() },
        }
        brush.send(JSON.stringify(brushObj));
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
            const brushMessage = JSON.parse(message.data);
            console.log('brush message:', message.data);

            switch(brushMessage.type) {
                case BRUSH_TYPE.DRAW:
                    if( Array.isArray(brushMessage.data)){
                        const points = brushMessage.data
                        points.forEach(point => {
                            draw(projectPoints(point));
                        });
                    }else{
                        draw(projectPoints(brushMessage.data));
                    }
                    break;
                case BRUSH_TYPE.FILL:
                    fillBackgroundColor({x: Math.floor(brushMessage.data.point.x * canvasRef.current.width), y: Math.floor(brushMessage.data.point.y * canvasRef.current.height)}, brushMessage.data.color);
                    break;
                case BRUSH_TYPE.SAVE:
                    saveHistory();
                    break;
                case BRUSH_TYPE.UNDO:
                    retrieveHistory();
                    break;
                default:
                    console.log('unknown brush type');
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

    const handleFont = (f) => {
		setFillColor(false);
		sizeRef.current.state.ref = f;
		setFont(f);
	}

    const onFontSlider = (e) => {
		setFillColor(false);
        console.log({e});
        setFont(e);
    }

    const handleColor = (c) => {
        console.log({color: c, board: 'board'});
        setColor(c);
    }

    const getColor = () => {
        return color;
    }

    const handleFillColor = (flag) => {
		setFillColor(flag);
	}

    const handleUndo = () => {
        let brushObj = {
            type: BRUSH_TYPE.UNDO,
        }
        brush.send(JSON.stringify(brushObj));
    }

    var circleStyle = {
        display:"inline-block",
        backgroundColor: color === 'eraser'? 'white' : color,
        borderRadius: color === 'eraser'? '0%' : "50%",
        borderStyle: color === 'eraser'? 'solid': 'none',
        width: font,
        height: font,
    };

    return (
        <>
            { disable
                ? <></>
                :<div bordered style={{ width: font, height: font, marginLeft: '10px' , textAlign:'center', position: 'absolute'}}>
                    <div style={circleStyle}>
                    </div>
                </div>
            }
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
            { disable
                    ? <></>
                    : <Palette handleFont={handleFont} handleColor={handleColor} sizeRef={sizeRef} onFontSlider={onFontSlider} color={color} font={font} handleFillColor={handleFillColor} handleUndo={handleUndo}/>
            }
        </>
    );

    // return <Sketch setup={setup} draw={draw} />;
}