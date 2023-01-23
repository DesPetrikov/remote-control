import { down, left, mouse, right, up } from '@nut-tree/nut-js';
import WebSocket, { createWebSocketStream } from 'ws';
import { WEBSOCKET_PORT } from '../constants.js';
import { Commands } from '../enums.js';
import { createCircle } from './createCircle.js';
import { createRectangle } from './createRectangle.js';
import { createScreenShot } from './createScreenShot.js';

export const WSServerHandler = (ws: WebSocket.WebSocket) => {
  console.log(`WebSocket connection run successfully on ${WEBSOCKET_PORT} port!`);
  const duplex = createWebSocketStream(ws, {
    encoding: 'utf8',
    decodeStrings: false,
  });
  ws.on('message', async (data) => {
    console.log(`Command: ${String(data)}`);
    const [instruction, ...values] = String(data).split(' ');
    try {
      const { x: posX, y: posY } = await mouse.getPosition();
      if (instruction === Commands.UP) {
        await mouse.move(up(+values[0]));
      } else if (instruction === Commands.DOWN) {
        await mouse.move(down(+values[0]));
      } else if (instruction === Commands.LEFT) {
        await mouse.move(left(+values[0]));
      } else if (instruction === Commands.RIGHT) {
        await mouse.move(right(+values[0]));
      } else if (instruction === Commands.MOUSE_POSITION) {
        duplex.write(`${Commands.MOUSE_POSITION} ${posX},${posY}`);
        console.log(`Result: ${Commands.MOUSE_POSITION} ${posX},${posY}`);
      } else if (instruction === Commands.SQUARE) {
        await createRectangle(+values[0], +values[0]);
      } else if (instruction === Commands.RECTANGLE) {
        await createRectangle(+values[0], +values[1]);
      } else if (instruction === Commands.CIRCLE) {
        await createCircle(+values[0]);
      } else if (instruction === Commands.SCREENSHOT) {
        const base64 = await createScreenShot(posX, posY);
        duplex.write(`${Commands.SCREENSHOT} ${base64}`);
        console.log('Result: ScreenShot was sent');
      }
      if (instruction !== Commands.SCREENSHOT && instruction !== Commands.MOUSE_POSITION) {
        duplex.write(`${String(data)}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  });
};
