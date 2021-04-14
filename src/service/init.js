'use strict';
import WebSocketApi from './ws';

export default async function({ thresholdlib }) {
  const ws = new WebSocketApi();
  if (process.env.NODE_ENV === 'development') {
    window.ws = ws;
  }

  ws.init();

  await ws.ready();

  }

  ws.on('key', async(data) => {

  });

  ws.on('sign', async(data) => {

  });

  return {
    ws
  }
}
