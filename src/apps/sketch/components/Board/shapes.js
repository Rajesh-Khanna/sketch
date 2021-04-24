import { DEFAULT_BACKGROUND_COLOR } from './../../constants';
import { isScreenLarge } from './../../utils';

export class Shape {
    props = {
        start: {
            x: 0,
            y: 0,
        },
        end: {
            x: 0,
            y: 0,
        },
        color: 'black',
        thick: 1,
    }
    drawShape(p) {
        if (this.props && this.props.start) {
            p.strokeWeight(this.props.thick);
            if (this.props.color === 'eraser') {
                p.stroke(DEFAULT_BACKGROUND_COLOR);
            } else {
                p.stroke(this.props.color);
            }
            p.line(this.props.start.x, this.props.start.y, this.props.end.x, this.props.end.y);
        }
    }
    clone() {
        return JSON.parse(JSON.stringify(this.props));
    }
    copy(props, scale = false) {
        const width = isScreenLarge() ? window.innerWidth * 5 / 6 : window.innerWidth;
        if (scale) {
            props.start.x *= width;
            props.start.y *= width;
            props.end.x *= width;
            props.end.y *= width;
            props.thick *= width;
        }
        this.props = {...props };
    }
    export (scale = false) {
        const width = isScreenLarge() ? window.innerWidth * 5 / 6 : window.innerWidth;
        if (scale) {
            const scaleProp = Object.assign(this.props);
            scaleProp.start.x /= width;
            scaleProp.start.y /= width;
            scaleProp.end.x /= width;
            scaleProp.end.y /= width;
            scaleProp.thick /= width;
            return JSON.stringify(scaleProp);
        }
        return JSON.stringify(this.props);
    }
}

export class activeShape extends Shape {
    setStart(x, y) {
        this.props.start.x = x;
        this.props.start.y = y;
    }
    setEnd(x, y) {
        this.props.end.x = x;
        this.props.end.y = y;
    }
    setColor(shapeColor) {
        this.props.color = shapeColor;
    }
    setFont(thickness) {
        this.props.thick = thickness;
    }

    isStationary() {
        if (this.props.end.x === this.props.start.x && this.props.end.y === this.props.start.y)
            return true;
        return false;
    }
}