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
	mouse.config.mouseSpeed = 200;
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
    }
  });
});
