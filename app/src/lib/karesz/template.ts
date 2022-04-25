import { REPLACE, RULES } from './rules';
import getMultiPlayerTemplate from './templates/Multiplayer';
import {
    random,
    PlayerStart,
    PlayerStartState,
    TemplateSettings,
} from './types';

export class Template {
    // used in the template so that players cannot interfere with built in functions
    protected rand: string = random();
    // final shit
    public code: string = '';
    private type: 'singleplayer' | 'multiplayer' = 'multiplayer';
    private settings: TemplateSettings = {
        TIMEOUT: 5000,
        MAP_WIDTH: 20,
        MAP_HEIGHT: 20,
        MAP_OBJECTS: {},
        MIN_PLAYERS: 1,
        MAX_ITERATIONS: 5000,
    };
    private players: PlayerStartState[] = [];

    private constructor(type: 'singleplayer' | 'multiplayer') {
        this.type = type;
        return this;
    }

    // choose the type of template
    public static of(type: 'singleplayer' | 'multiplayer'): Template {
        return new Template(type);
    }

    // choose the map size and layout
    public onMap(
        width: number,
        height: number,
        objects?: { [key: string]: number }
    ): Template {
        this.settings.MAP_WIDTH = width;
        this.settings.MAP_HEIGHT = height;
        if (objects) this.settings.MAP_OBJECTS = objects;
        return this;
    }

    // add an array of players
    public addPlayers(
        onFail: (
            id: string,
            severity: 'warning' | 'error',
            reason: string
        ) => void,
        ...players: PlayerStart[]
    ): Template {
        let start: number = this.type === 'singleplayer' ? 0 : 400;
        for (const [index, player] of players.entries()) {
            const result = this.safetyCheck(player.code);
            if (result && result.severity === 'error')
                onFail(player.id, result.severity, result.error);
            else {
                const { code, length } = this.replace(
                    player.code,
                    index,
                    player.name
                );
                console.log(`>>> ${code == player.code}`);
                this.players.push({
                    ...player,
                    code,
                    startln: start,
                    endln: start + length + 1, // (additional newline)
                });
                start += length;
            }
        }
        return this;
    }

    // finally get the code and the random string used to retrieve the last line of the output
    public create(): { code: string; rand: string } {
        console.log(this.players);
        return {
            rand: this.rand,
            code:
                this.type === 'singleplayer'
                    ? 'not yet bruh'
                    : getMultiPlayerTemplate(
                          this.rand,
                          this.settings,
                          this.players
                      ),
        };
    }

    // detect disallowed code
    private safetyCheck(code: string): {
        error: string;
        severity: 'warning' | 'error';
    } | null {
        for (const rule of RULES)
            if (rule.reverse ? !code.match(rule.find) : code.match(rule.find))
                return {
                    error: rule.description,
                    severity: rule.severity,
                };
        return null;
    }

    // replace all functions and variables with their values
    private replace(
        code: string,
        index: number,
        name: string
    ): { code: string; length: number } {
        // replace entry
        code = code.replaceAll(
            /void\s+FELADAT\s*\(\s*\)/gm,
            this.type === 'singleplayer'
                ? 'static void Main(string[] args)'
                : `void Thread${index}${this.rand}()`
        );
        // replace writelines so that players can see their logs
        code = code.replaceAll(
            /Console\.(WriteLine|Write)\((?<value>.*)\)/g,
            `Console.WriteLine($"[{ROUND${this.rand}}]: ${name} > "+$1)`
        );
        for (const replacement of REPLACE) {
            code = code.replaceAll(
                replacement.replace,
                !replacement.usefn
                    ? replacement.name
                    : `${replacement.name}${this.rand}(${index}${
                          replacement.args ? ',' + replacement.args : ''
                      })`
            );
        }
        return { code, length: code.split('\n').length };
    }
}
