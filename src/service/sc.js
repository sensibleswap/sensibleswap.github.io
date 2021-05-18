import WebSocket from 'socket.io-client';

export default class sc {

    constructor() {
        this.baseUrl = 'ws://127.0.0.1:8888';
        this.init();
    }
    init() {
        const ws = new WebSocket(this.baseUrl);
        ws.send("chart");
        ws.emit("chart")
        ws.on("connection", () => {
            console.log('...')
            ws.send("chart");
          });
        ws.onopen = (evt) => {
            console.log("Connection open ...");
            ws.send("chart");
            ws.emit("chart")
        }
        ws.onmessage = (evt) => {
            console.log(evt)
        };


        ws.onerror = () => {

        }

        ws.onclose = () => {
            setTimeout(() => {
                this.init();
            }, 3000);
        };

        this.ws = ws;
    }
}