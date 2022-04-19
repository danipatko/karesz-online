import { createServer } from 'http';
import next from 'next';
import { Server } from 'socket.io';
import Session from '../lib/karesz/manager';

const randCode = () => Math.floor(1000 + Math.random() * 9000);

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const httpserver = createServer(async (req, res) => await handle(req, res));

app.prepare().then(() => {
    httpserver.listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
    });
});

const gameManager = new Map<number, Session>();
const io = new Server(httpserver);

io.on('connection', (socket) => {
    console.log(`${socket.id} connected`); // debug

    // fetch minimal game data / check if exists
    socket.on('info', ({ code }: { code: number }) => {
        // console.log(`prejoining to ${code}`);

        const game = gameManager.get(code);
        if (game === undefined) socket.emit('info', { found: false });
        else
            socket.emit('info', {
                found: true,
                playerCount: game.playerCount,
                code,
            });
    });

    socket.on('join', ({ name, code }: { name: string; code: number }) => {
        const game = gameManager.get(code);
        // game not found
        if (game === undefined) {
            // console.log(`Game ${code} could not be found`);
            socket.emit('error', { error: `Game ${code} could not be found` });
            return;
        }
        // console.log(`Adding ${name} to existing game ${code} ...'`); // debug
        game.addPlayer(socket, name);
    });

    socket.on('create', ({ name }: { name: string }) => {
        // random four digit gamecode
        let code = randCode();
        while (gameManager.has(code)) code = randCode();

        gameManager.set(
            code,
            Session.create(code, () => gameManager.delete(code)).addPlayer(
                socket,
                name
            )
        );
    });
});
