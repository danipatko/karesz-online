import next from 'next';
import { Server } from 'socket.io';
import { createServer } from 'http';
import Session from '../lib/karesz/session';
import { GameMap } from '../lib/shared/types';
import { Runner } from '../lib/karesz/run/runner';
import { Template } from '../lib/karesz/run/template';
import { Spawn } from '../lib/hooks/singleplayer/spawn';
import { GameMapEntries } from '../lib/hooks/shared/map';

const randCode = () => Math.floor(1000 + Math.random() * 9000);

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

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
        const game = gameManager.get(code);
        if (game === undefined)
            return void socket.emit('info', { found: false });

        socket.emit('info', {
            found: true,
            playerCount: game.playerCount,
        });
    });

    socket.on('join', ({ name, code }: { name: string; code: number }) => {
        const game = gameManager.get(code);
        // game not found
        if (game === undefined)
            return void socket.emit('error', {
                error: `Game ${code} could not be found`,
            });

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

    // run singleplayer game
    socket.on(
        'run',
        async ({
            map,
            code,
            spawn,
        }: {
            map: GameMapEntries;
            code: string;
            spawn: Spawn;
        }) => {
            console.log(map, '\n', code, '\n', spawn);

            const template = Template.create()
                .setMap({ x: map.width, y: map.height })
                .addObjects(map.objects)
                .singlePlayer()
                .generate(
                    { code, id: '0', name: 'default', ...spawn },
                    (result) => socket.emit('game_error', { error: result })
                );

            if (!template) return;

            const result = await Runner.run(template.code, 'single');
            console.log(result); // DEBUG

            if (result.exitCode !== 0)
                return void socket.emit('game_error_logs', {
                    stderr: result.stderr,
                    stdout: result.stdout,
                });

            socket.emit('game_result_single', result);
        }
    );
});
