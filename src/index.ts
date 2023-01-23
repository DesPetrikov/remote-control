import { httpServer } from './http_server/index.js';
import { Button, down, left, mouse, Region, right, straightTo, up } from '@nut-tree/nut-js';
import { WebSocketServer } from 'ws';
import { Commands } from './types.js';

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Connection accepted');
  ws.on('message', async (data) => {
    const [instruction, ...values] = String(data).split(' ');
    const { x: posX, y: posY } = await mouse.getPosition();
    if (instruction === Commands.UP) {
      await mouse.move(straightTo({ x: posX, y: posY - +values[0] }));
    } else if (instruction === Commands.DOWN) {
      await mouse.move(straightTo({ x: posX, y: posY + +values[0] }));
    } else if (instruction === Commands.LEFT) {
      await mouse.move(straightTo({ x: posX - +values[0], y: posY }));
    } else if (instruction === Commands.RIGHT) {
      await mouse.move(straightTo({ x: posX + +values[0], y: posY }));
    } else if (instruction === Commands.MOUSE_POSITION) {
      ws.send(`mouse_position ${posX},${posY}`);
    } else if (instruction === Commands.SQUARE) {
      await mouse.pressButton(Button.LEFT);
      await mouse.move(right(+values[0]));
      await mouse.move(down(+values[0]));
      await mouse.move(left(+values[0]));
      await mouse.move(up(+values[0]));
      await mouse.releaseButton(Button.LEFT);
    } else if (instruction === Commands.RECTANGLE) {
      await mouse.pressButton(Button.LEFT);
      await mouse.move(right(+values[0]));
      await mouse.move(down(+values[1]));
      await mouse.move(left(+values[0]));
      await mouse.move(up(+values[1]));
      await mouse.releaseButton(Button.LEFT);
    } else if (instruction === Commands.CIRCLE) {
      const { x: startX, y: startY } = await mouse.getPosition();
      const [circleCenterX, circleCenterY] = [startX + +values[0], startY];
      await mouse.pressButton(Button.LEFT);
      for (let i = 0; i <= 360; i++) {
			const Y = +values[0] * Math.sin(i * Math.PI / 180)
			const X = +values[0] * Math.cos(i * Math.PI / 180)
        await mouse.move(straightTo({ x: circleCenterX - X, y: circleCenterY - Y }));
      }
      await mouse.releaseButton(Button.LEFT);
    }
  });
});
