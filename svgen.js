const fs = require('fs');

const sizeX = 40;
const sizeY = 40;

const scale = 4000;
const sx = scale / sizeX;
const sy = scale / sizeX;

let result = '';

for (var x = 0; x <= sizeX * sx; x += sx) {
    for (let y = 0; y <= sizeY * sy; y += sy) {
        result += `<rect width="${sx}" height="${sy}" x="${x}" y="${y}"></rect>\n`;
    }
}

fs.writeFileSync('svg.svg', result);

console.log(result);
