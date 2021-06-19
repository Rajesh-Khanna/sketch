const getRGB = (canvasRef, data, x, y) => {
    if (data) {
        const index = y * (canvasRef.current.width * 4) + x * 4;
        const rgba = `rgba(${data[index]}, ${data[index+1]}, ${data[index+2]}, ${data[index+3] / 255})`;
        return rgba;
    } else {
        return 'rgba(255,255,255,1)';
    }
}

const setRGB = (canvasRef, data, targetRGBA, x, y) => {
    if (data && targetRGBA) {
        const index = y * (canvasRef.current.width * 4) + x * 4;

        // console.log('previous colors: ',data[index],data[index+1],data[index+2],data[index+3]);
        data[index] = targetRGBA[0];
        data[index + 1] = targetRGBA[1];
        data[index + 2] = targetRGBA[2];
        data[index + 3] = targetRGBA[3];
        // console.log('after colors: ',data[index],data[index+1],data[index+2],data[index+3]);    
    }
}

const hexToRGBA = (hex) => {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return [(c >> 16) & 255, (c >> 8) & 255, c & 255, 255];
    }
}


export const fillBackgroundColor = (canvasRef, contextRef, getColor, point, color) => {
    console.log('pointer pointed to: ', point);

    var pixel = contextRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    var data = pixel.data;

    let copiedData = Object.assign({}, data);

    const pointerRGBA = getRGB(canvasRef, copiedData, point.x, point.y);
    console.log('pixel color: ', pointerRGBA);

    var targetRGBA = hexToRGBA(color || getColor())
    console.log('target fill color rgba:', targetRGBA);

    var visited = new Array(canvasRef.current.width);

    for (var i = 0; i < visited.length; i++) {
        visited[i] = new Array(canvasRef.current.height);
    }
    for (i = 0; i < visited.length; i++) {
        for (var j = 0; j < visited[i].length; j++) {
            visited[i][j] = 0;
        }
    }

    let arr = [{ x: point.x, y: point.y }];
    var p;
    while (!(arr.length === 0)) {
        p = arr[arr.length - 1];
        // if(visited[p.x][p.y]===1) {
        //     arr.pop();
        //     continue;
        // }
        // console.log(p);
        visited[p.x][p.y] = 1;
        arr.pop();
        if (pointerRGBA === getRGB(canvasRef, copiedData, p.x, p.y)) {
            setRGB(canvasRef, data, targetRGBA, p.x, p.y);

            if (p.x > 0 && p.y > 0 && visited[p.x - 1][p.y - 1] === 0) {
                arr.push({ x: p.x - 1, y: p.y - 1 });
                visited[p.x - 1][p.y - 1] = 1;
            }
            if (p.y > 0 && visited[p.x][p.y - 1] === 0) {
                arr.push({ x: p.x, y: p.y - 1 });
                visited[p.x][p.y - 1] = 1;
            }
            if (p.x < canvasRef.current.width - 1 && p.y > 0 && visited[p.x + 1][p.y - 1] === 0) {
                arr.push({ x: p.x + 1, y: p.y - 1 });
                visited[p.x + 1][p.y - 1] = 1;
            }
            if (p.x > 0 && visited[p.x - 1][p.y] === 0) {
                arr.push({ x: p.x - 1, y: p.y });
                visited[p.x - 1][p.y] = 1;
            }
            if (p.x < canvasRef.current.width - 1 && visited[p.x + 1][p.y] === 0) {
                arr.push({ x: p.x + 1, y: p.y });
                visited[p.x + 1][p.y] = 1;
            }
            if (p.x > 0 && p.y < canvasRef.current.height - 1 && visited[p.x - 1][p.y + 1] === 0) {
                arr.push({ x: p.x - 1, y: p.y + 1 });
                visited[p.x - 1][p.y + 1] = 1;
            }
            if (p.y < canvasRef.current.height - 1 && visited[p.x][p.y + 1] === 0) {
                arr.push({ x: p.x, y: p.y + 1 });
                visited[p.x][p.y + 1] = 1;
            }
            if (p.x < canvasRef.current.width - 1 && p.y < canvasRef.current.height - 1 && visited[p.x + 1][p.y + 1] === 0) {
                arr.push({ x: p.x + 1, y: p.y + 1 });
                visited[p.x + 1][p.y + 1] = 1;
            }
        }
    }
    contextRef.current.putImageData(pixel, 0, 0);
}