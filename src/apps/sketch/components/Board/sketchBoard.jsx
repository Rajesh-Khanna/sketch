import { activeShape, Shape } from './shapes';
import React, {useEffect, useRef} from "react";
import Sketch from "react-p5";
import { DEFAULT_BACKGROUND_COLOR } from './../../constants';
import { isScreenLarge } from './../../utils';

export default function SketchBoard(props) {

    const { brush, paletteHandler, disable, refresh } = props;
    let currShape = new activeShape();
    const othersShapes = useRef([]);

    const touchBrush = useRef(false);

    useEffect(() => {
        console.log({brush});
        console.log(brush);
        brush.onmessage = (message) => {
            const x = new Shape();
            x.copy(JSON.parse(message.data), true);
            othersShapes.current.push(x);
        }

        function onKeyup(e) {
            if(disable)
                return;
            switch(e.key){
                case 'd':
                case 'D':
                    // 1st condition is to handle the case while switching from pencle to eraser
                    touchBrush.current = paletteHandler.getColor() === 'eraser' || !touchBrush.current;
                    paletteHandler.color(paletteHandler.getColor());
                    break;
                case 'e':
                case 'E':
                    touchBrush.current = paletteHandler.getColor() !== 'eraser' || !touchBrush.current;
                    paletteHandler.color('eraser');
                    break;
                case '+':
                    paletteHandler.increaseFont();
                    break;
                case '-':
                    paletteHandler.reduceFont();
                    break;
                default:
                    console.log('');
            } 
        }
        window.addEventListener('keyup', onKeyup);

        return () => window.removeEventListener('keyup', onKeyup);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setup = (p, canvasParentRef) => {
        const width = isScreenLarge()? window.innerWidth*5/6 : window.innerWidth;
        p.createCanvas(width, width/2).parent(canvasParentRef);
        p.noFill();
        p.background(DEFAULT_BACKGROUND_COLOR);
    }

    const draw = p => {
        if (refresh) {
            p.background(DEFAULT_BACKGROUND_COLOR);
        }
        if ((p.mouseIsPressed === true || touchBrush.current) && !disable) {
            currShape.setFont(props.font);
            currShape.setColor(props.color);
            currShape.setStart(p.mouseX, p.mouseY);
            currShape.setEnd(p.pmouseX, p.pmouseY);
            if(!currShape.isStationary()){
                const copyObj = new Shape();
                copyObj.copy(currShape.clone());
                if(brush)
                    brush.send(currShape.export(true));
                currShape.drawShape(p);
            }
        }
        othersShapes.current.forEach(element => {
            element.drawShape(p);
        });
        othersShapes.current = [];
    }


    return <Sketch setup={setup} draw={draw} />;
}