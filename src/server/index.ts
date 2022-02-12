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

    socket.on('join', ({ name, code }: { name: string; code: number }) => {
        console.log(`name: ${name} | code: ${code}`);
        if (!(name && code)) return;

        const game = gameManager.get(code);

        if (game !== undefined) {
            console.log('adding to existing game...');
            game.addPlayer({ name, socket, host: false });
        } else {
            console.log('creating new game');
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
        }
    });
});
