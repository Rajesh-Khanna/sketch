import { activeShape, Shape } from './shapes';
import React, {useEffect, useRef} from "react";
import Sketch from "react-p5";

export default function SketchBoard(props) {

    const { brush } = props;
    let currShape = new activeShape();
    const othersShapes = useRef([]);
    useEffect(() => {
        console.log({brush});
        console.log(brush);
        brush.onmessage = (message) => {
            const x = new Shape();
            x.copy(JSON.parse(message.data))
            othersShapes.current.push(x);
        }
    }, []);

    const setup = (p, canvasParentRef) => {
        p.createCanvas(1000, 600).parent(canvasParentRef);
        p.noFill();
        p.background(225);
    }

    const draw = p => {
        if (p.mouseIsPressed === true) {
            currShape.setStart(p.mouseX, p.mouseY);
            currShape.setEnd(p.pmouseX, p.pmouseY);
            const copyObj = new Shape();
            copyObj.copy(currShape.clone());
            if(brush)
                brush.send(currShape.export());
            currShape.drawShape(p);
        }
        othersShapes.current.forEach(element => {
            element.drawShape(p);
        });
        othersShapes.current = [];
    }

    return <Sketch setup={setup} draw={draw} />;
}