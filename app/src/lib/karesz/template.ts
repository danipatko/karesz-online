import { REPLACE, RULES } from './rules';
import getMultiPlayerTemplate from './templates/Multiplayer';
import getSinglePlayerTemplate from './templates/Singleplayer';
import {
    random,
    PlayerStart,
    PlayerStartState,
    TemplateSettings,
} from './types';

export class Template {
    // settings
    private settings: TemplateSettings = {
        TIMEOUT: 5000,
        MAP_WIDTH: 20,
        MAP_HEIGHT: 20,
        MAP_OBJECTS: {},
        MIN_PLAYERS: 1,
        MAX_ITERATIONS: 5000,
    };

    public static create(): Template {
        return new Template();
    }

    public setTimeout(ms: number) {
        this.settings.TIMEOUT = ms;
        return this;
    }

    public setIterations(iterations: number) {
        this.settings.MAX_ITERATIONS = iterations;
        return this;
    }

    public setMap({ x, y }: { x: number; y: number }) {
        this.settings.MAP_WIDTH = x;
        this.settings.MAP_HEIGHT = y;
        return this;
    }

    public addObjects(objects: { [key: string]: number }) {
        this.settings.MAP_OBJECTS = objects;
        return this;
    }

    public setMinPlayers(min: number) {
        this.settings.MIN_PLAYERS = min;
        return this;
    }

    public multiPlayer(): MultiplayerTemplate {
        return new MultiplayerTemplate(this.settings);
    }

    public singlePlayer(): SingleplayerTemplate {
        return new SingleplayerTemplate(this.settings);
    }
}

class ProcessCode {
    // detect disallowed code
    protected safetyCheck(code: string): {
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
    protected replace(
        index: number,
        code: string,
        name: string,
        rand: string,
        type: 'single' | 'multi'
    ): { code: string; length: number } {
        // replace entry
        code = code.replaceAll(
            /void\s+FELADAT\s*\(\s*\)/gm,
            type == 'single'
                ? 'static void Main(string args[])'
                : `void Thread${index}${rand}()`
        );

        // replace writelines so that players can see their logs
        code = code.replaceAll(
            /Console\.(WriteLine|Write)\((?<value>.*)\)/g,
            `Console.WriteLine($"[{ROUND${rand}}]: ${name} > "+$1)`
        );

        for (const replacement of REPLACE) {
            // replace with a function alias
            if (replacement.usefn)
                code = code.replaceAll(
                    replacement.replace,
                    this.getFunction(
                        type,
                        replacement.name,
                        rand,
                        index,
                        replacement.args
                    )
                );
            // replace a variable with a value
            else code = code.replaceAll(replacement.replace, replacement.name);
        }

        return { code, length: code.split('\n').length };
    }

    // get function alias
    private getFunction(
        type: string,
        name: string,
        rand: string,
        index: number,
        args?: string
    ): string {
        if (type == 'single') return `${name}${rand}(${args ?? ''})`;
        return `${name}${rand}(${index}${args ? ',' + args : ''})`;
    }
}

class MultiplayerTemplate extends ProcessCode {
    // used in the template so that players cannot interfere with built in functions
    public rand: string = random();
    // the final template
    public code: string = '';
    // settings
    private settings: TemplateSettings;

    constructor(settings: TemplateSettings) {
        super();
        this.settings = settings;
    }

    // array containing player start states and their code
    private players: PlayerStartState[] = [];

    // add a bunch of players to the template
    public addPlayers(
        players: PlayerStart[], // starting positions, names and codes
        onFail: (
            // callback function if a player is disqualified
            id: string,
            severity: 'warning' | 'error',
            reason: string
        ) => void
    ): MultiplayerTemplate {
        let start: number = 404;

        for (const [index, player] of players.entries()) {
            const scResult = this.safetyCheck(player.code);

            if (scResult && scResult.severity === 'error') {
                onFail(player.id, scResult.severity, scResult.error);
                continue;
            }

            const { code, length } = this.replace(
                index,
                player.code,
                player.name,
                this.rand,
                'multi'
            );

            this.players.push({
                ...player,
                code,
                startln: start,
                endln: start + length + 1, // (additional newline)
            });

            start += length;
        }

        return this;
    }

    // set the correct template
    public generate(): { code: string; rand: string } {
        this.code = getMultiPlayerTemplate(
            this.rand,
            this.settings,
            this.players
        );
        return this;
    }

    // get the person who wrote the code in the given line
    public blame(line: number): string | null {
        for (const player of this.players)
            if (line >= player.startln && line <= player.endln)
                return player.id;

        return null;
    }
}

class SingleplayerTemplate extends ProcessCode {
    // used in the template so that players cannot interfere with built in functions
    public rand: string = random();
    // the final template
    public code: string = '';
    // settings
    private settings: TemplateSettings;

    constructor(settings: TemplateSettings) {
        super();
        this.settings = settings;
    }

    // create the template
    public generate(
        player: PlayerStart,
        onFail: (a: { severity: string; error: string }) => void
    ): SingleplayerTemplate | null {
        const scResult = this.safetyCheck(player.code);

        if (scResult && scResult.severity === 'error') {
            onFail({ ...scResult });
            return null;
        }

        const { code } = this.replace(
            0,
            player.code,
            player.name,
            this.rand,
            'single'
        );

        this.code = getSinglePlayerTemplate(this.rand, this.settings, {
            ...player,
            code,
        });

        return this;
    }
}
