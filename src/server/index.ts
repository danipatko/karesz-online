import { createServer } from 'http';
import next from 'next';
import { Server } from 'socket.io';
import SessionManager from '../lib/karesz/game/manager';
import { randCode } from '../lib/karesz/util';

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
    console.log(`${socket.id} connected`);

    socket.on('disconnect', () => console.log(`${socket.id} disconnected`));

    socket.on('join', ({ name, code }: { name: string; code: number }) => {
        if (!(name && code)) return;

        const game = gameManager.get(code);

        if (game !== undefined) {
            game.addPlayer({ name, socket, host: false });
        } else {
            let code = randCode();
            while (gameManager.has(code)) code = randCode();

            gameManager.set(
                code,
                new SessionManager({
                    name,
                    socket,
                })
            );

            socket.on('disconnect', () => {
                gameManager.get(code);
            });
        }
    });
});
