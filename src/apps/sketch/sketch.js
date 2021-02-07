import { activeShape } from './shapes';

export default function sketch(p) {
    let canvas;
    let currShape = new activeShape();
    let othersShapes = [];
    let sketchChannel;
    let messageChannel;

    p.setup = () => {
        console.log('setup');
        let cnv = p.createCanvas(1000, 600);
        cnv.parent('drawBoard');
        p.noFill();
        p.background(225);
    }

    p.draw = () => {
        p.background('orangered');
        p.ellipse(150, 100, 100, 100);
        if (p.mouseIsPressed === true) {
            currShape.setStart(p.mouseX, p.mouseY);
            currShape.setEnd(p.pmouseX, p.pmouseY);
            const copyObj = new Shape();
            copyObj.copy(currShape.clone());
            this.sketchChannel.pushShape(currShape);
            currShape.drawShape(p);
        }
        othersShapes.forEach(element => {
            element.drawShape();
        });
        othersShapes = [];
    }

    p.myCustomRedrawAccordingToNewPropsHandler = (newProps) => {
        if (canvas) //Make sure the canvas has been created
            p.fill(newProps.color);
    }
}