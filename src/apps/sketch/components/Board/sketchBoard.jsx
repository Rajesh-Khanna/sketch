import { activeShape, Shape } from './shapes';
import React, {useEffect, useRef} from "react";
import Sketch from "react-p5";
import { DEFAULT_BACKGROUND_COLOR } from './../../constants';
import { isScreenLarge } from './../../utils';

export default function SketchBoard(props) {

    const { brush, paletteHandler } = props;
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

    }, []);

    const setup = (p, canvasParentRef) => {
        const width = isScreenLarge()? window.innerWidth*5/6 : window.innerWidth;
        p.createCanvas(width, width/2).parent(canvasParentRef);
        p.noFill();
        p.background(DEFAULT_BACKGROUND_COLOR);
    }

    const draw = p => {
        if (p.mouseIsPressed === true || touchBrush.current) {
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