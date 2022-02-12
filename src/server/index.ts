import { createServer } from 'http';
import next from 'next';
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const httpserver = createServer(async (req, res) => {
    return handle(req, res);
});

app.prepare().then(() => {
    httpserver.listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`)
    });
});

const io = new Server(httpserver);

io.on('connection', (socket) => {
    console.log(`${socket.id} connected`);

    socket.on('disconnect', () => console.log(`${socket.id} disconnected`));

    socket.emit('a');
    socket.emit('b');

    socket.on('join', () => {
        console.log('JOIN INVOKED');
    }); 
});