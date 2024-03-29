import ProcessCode from './process';
import getMultiPlayerTemplate from '../templates/Multiplayer';
import getSinglePlayerTemplate from '../templates/Singleplayer';
import {
    random,
    PlayerStart,
    PlayerStartState,
    TemplateSettings,
} from '../types';
import { maps } from '../../shared/dotmaps';

export class Template {
    // settings
    private settings: TemplateSettings = {
        TIMEOUT: 2000,
        MAP_WIDTH: 20,
        MAP_HEIGHT: 20,
        MAP_OBJECTS: new Map<string, number>(),
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

    public addObjects(objectEntries: [string, number][] | Map<string, number>) {
        this.settings.MAP_OBJECTS = new Map(objectEntries);
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
        let start: number = 411;
        let index: number = 0;
        for (const player of players.values()) {
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
            index++;
        }

        return this;
    }

    // set the correct template
    public generate(mapName: string): { code: string; rand: string } {
        console.log('creating map', this.settings.MAP_OBJECTS);
        this.code = getMultiPlayerTemplate(
            this.rand,
            this.settings,
            this.players,
            mapName.length ? maps[mapName] : undefined
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
        onFail: (a: { severity: string; error: string }) => void,
        mapName: string
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

        this.code = getSinglePlayerTemplate(
            this.rand,
            this.settings,
            {
                ...player,
                code,
            },
            mapName.length ? maps[mapName] : undefined
        );

        return this;
    }
}
