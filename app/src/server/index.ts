import { createServer } from 'http';
import next from 'next';
import { Server } from 'socket.io';
import SessionManager from '../lib/karesz/manager';

const randCode = () => Math.floor(1000 + Math.random() * 9000);

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const httpserver = createServer(async (req, res) => {
    return await handle(req, res);
});

app.prepare().then(() => {
    httpserver.listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
    });
});

const gameManager = new Map<number, SessionManager>();
const io = new Server(httpserver);

io.on('connection', (socket) => {
    console.log(`${socket.id} connected`); // debug

    // fetch minimal game data / check if exists
    socket.on('prejoin', ({ code }: { code: number }) => {
        console.log(`prejoining to ${code}`);

        const game = gameManager.get(code);
        socket.emit('prejoin', {
            playerCount:
                code != 0 && game === undefined ? -1 : game?.playerCount ?? 0,
        });
    });

    socket.on('join', ({ name, code }: { name: string; code: number }) => {
        console.log(`Adding ${name} to existing game (${code}) ...'`); // debug

        const game = gameManager.get(code);
        // game not found
        if (game === undefined) return;
        game.addPlayer({ name, socket });
    });

    socket.on('create', ({ name }: { name: string }) => {
        console.log(`Creating ${name}'s game`); // debug

        // random four digit gamecode
        let code = randCode();
        while (gameManager.has(code)) code = randCode();

        gameManager.set(
            code,
            new SessionManager({
                code,
                name,
                socket,
                remove: () => gameManager.delete(code),
            })
        );
    });
});
