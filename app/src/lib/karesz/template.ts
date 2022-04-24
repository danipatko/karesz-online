import { REPLACE, RULES } from './rules';
import getMultiPlayerTemplate from './templates/Multiplayer';
import { PlayerCode, Player, TemplateSettings, random } from './types';

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
    private players: PlayerCode[] = [];

    private constructor(type: 'singleplayer' | 'multiplayer') {
        this.type = type;
        return this;
    }

    public static of(type: 'singleplayer' | 'multiplayer'): Template {
        return new Template(type);
    }

    public setMap(
        width: number,
        height: number,
        objects?: { [key: string]: number }
    ): Template {
        this.settings.MAP_WIDTH = width;
        this.settings.MAP_HEIGHT = height;
        if (objects) this.settings.MAP_OBJECTS = objects;
        return this;
    }

    public addPlayers(
        onFail: (
            id: string,
            severity: 'warning' | 'error',
            reason: string
        ) => void,
        ...players: Player[]
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

    public create(): string {
        return this.type === 'singleplayer'
            ? 'not yet bruh'
            : getMultiPlayerTemplate(this.rand, this.settings, this.players);
    }

    // this function should be responsible for detecting disallowed code
    private safetyCheck(code: string): {
        error: string;
        severity: 'warning' | 'error';
    } | null {
        for (const rule of RULES)
            if (code.match(rule.find))
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
        code.replaceAll(
            /void\s+FELADAT\s*\(\s*\)/gm,
            this.type === 'singleplayer'
                ? 'static void Main(string[] args)'
                : `static void Thread${index}${this.rand}`
        );
        // replace writelines so that players can see their logs
        code.replaceAll(
            /Console\.(WriteLine|Write)\((?<value>.*)\)/g,
            `Console.WriteLine($"[{ROUND${this.rand}}]: ${name} > "+$1)`
        );
        for (const replacement of REPLACE) {
            code.replaceAll(
                replacement.replace,
                !replacement.usefn
                    ? replacement.name
                    : `${replacement.name}_${this.rand}(${index}${
                          replacement.args ? ',' + replacement.args : ''
                      })`
            );
        }
        return { code, length: code.split('\n').length };
    }
}
