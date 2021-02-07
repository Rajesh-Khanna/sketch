import { activeShape, Shape } from './shapes';
import React from "react";
import Sketch from "react-p5";

export default function SketchBoard(props) {

    const { sketchChannel } = props;

    let currShape = new activeShape();
    let othersShapes = [];

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
            sketchChannel.pushShape(currShape);
            currShape.drawShape(p);
        }
        othersShapes.forEach(element => {
            element.drawShape();
        });
        othersShapes = [];
    }

    return <Sketch setup={setup} draw={draw} />;
}