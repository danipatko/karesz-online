import KareszCore from './karesz';
import { randstr, clamp } from '../util';
import { Command, Karesz, KareszMap } from './types';
import run from '../languages/csharp/runner';

// const BASE_PATH = '/mnt/c/Users/Dani/home/Projects/karesz-online/testing';  // WSL
const BASE_PATH = '/home/karesz-online/testing'; // WSL ROOT
// const BASE_PATH = 'C://Users/Dani/home/Projects/karesz-online/testing';  // WINDOWS
// const BASE_PATH = '/home/dapa/Projects/karesz-online/testing';   // NOTEBOOK
// const BASE_PATH = '/home/liveuser/Projects/karesz-online/testing';   // PENDRIVE

export default class KareszRunner extends KareszCore {
    public lang: 'csharp'; // future support in case new languages are added
    public onPlayerDeath: (index: number) => void;

    constructor(
        lang: 'csharp' = 'csharp',
        players: Map<number, Karesz>,
        onPlayerDeath: (index: number) => void,
        map?: KareszMap
    ) {
        super(players, map);
        this.lang = lang;
        this.onPlayerDeath = onPlayerDeath;
    }

    /**
     * Parse a line of input from the process's stdout
     * INPUT PATTERN: "[key] [i/o] [index] [command] [...value?]"
     * @param input
     */
    public parse = (
        input: string,
        write: (s: string) => void,
        kill: (signal: NodeJS.Signals) => void
    ): void => {
        // io: one character, either '<' for stdout or '>' for stdin
        const [key, index, io, command, value] = input.trim().split(/\s+/gm);

        // console.log(`key: ${key} | index: ${index} | io: ${io} | command: ${command} | value: ${value}`);

        // ignore debug logs
        if (index === undefined || io === undefined || command === undefined)
            return;

        let player = this.players.get(parseInt(index));
        // invalid or removed player, return
        if (player === undefined) return;

        player.steps += command;
        player.proposedPosition = undefined;

        switch (command) {
            case Command.forward:
                player = this.proposeStep(player, parseInt(index));
            case Command.turn_right:
                player = this.turn(player, 1);
            case Command.turn_left:
                player = this.turn(player, -1);
            case Command.check_wall:
                write(this.wallAhead(player) ? '1' : '0');
            case Command.check_bounds:
                write(this.edgeOfMap(player) ? '1' : '0');
            case Command.check_field:
                write(this.whatIsUnder(player).toString());
            case Command.place_rock:
                this.placeRock(player, clamp(parseInt(value), 2, 5));
            case Command.pick_up_rock:
                this.pickUpRock(player);
            case Command.radar:
                write(this.radar(player).toString());
            case Command.check_under:
                write(this.isRockUnder(player) ? '1' : '0');
            case Command.looking_at:
                write(this.direction(player).toString());
            case Command.check_direction:
                write(player.rotation == parseInt(value) ? '1' : '0');
            case Command.turn_direction:
                player = this.turn(player, clamp(parseInt(value), -1, 1));
        }
        this.players.set(parseInt(index), player);
    };

    protected tick(): void {
        this.makeSteps();
        this.makeRemovals();
    }

    public async run({
        players,
    }: {
        players: Map<number, string>;
    }): Promise<{ error?: string; output: string; exitCode: number }> {
        return new Promise<{
            error?: string;
            output: string;
            exitCode: number;
        }>((res) => {
            // check players
            if (this.players.size <= 1) {
                res({
                    error: 'Not enough players',
                    exitCode: 1,
                    output: 'Not enough players',
                });
            }
            // run dotnet
            run({
                players: players,
                basePath: BASE_PATH,
                dataParser: this.parse,
                onTick: this.tick,
            }).then(({ output, exitCode, error }) => {
                res({ output, exitCode, error });
            });
        });
    }
}
