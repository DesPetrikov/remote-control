import { httpServer } from './http_server/index.js';
import { WebSocketServer } from 'ws';

import { WEBSOCKET_PORT } from './constants.js';
import { WSServerHandler } from './modules/WSServerHandler.js';

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ port: WEBSOCKET_PORT });

wss.on('connection', WSServerHandler);
process.on('SIGINT', () => {
  wss.close();
  process.exit();
});
