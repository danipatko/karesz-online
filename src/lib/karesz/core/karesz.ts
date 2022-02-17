import { modulo, compareTo } from '../util';
import {
    KareszMap,
    Point,
    Karesz,
    Field,
    Rotation,
    FIELD_VALUES,
} from './types';

export default class KareszCore {
    private map: KareszMap;
    public players: Map<string, Karesz>;
    public disqualified: Map<string, Karesz> = new Map<string, Karesz>();
    private proposedPositions: Map<Point, Array<string>> = new Map<
        Point,
        Array<string>
    >();
    private removeList: Array<string> = [];
    public multiPlayer: boolean;
    public winner?: string;
    // TODO: do this
    public events?: {
        onPlayerDeath: (id: string, killedBy: string) => void; // player dying
        onPlayerKill: (id: string, kill: string) => void; // player stepping on another
        onPlayerError: (errors: { id: string; description: string }[]) => void; // called when creating template
        onGameEnd: (winner: string | string[]) => void;
    };

    constructor(players: Map<string, Karesz>, map?: KareszMap) {
        this.players = players;
        this.map = map ?? this.fillMap({ sizeX: 10, sizeY: 10 });
        this.multiPlayer = Object.keys(players).length > 1;
    }

    /**
     * fill map with empty fields
     */
    protected fillMap({
        sizeX,
        sizeY,
    }: {
        sizeX: number;
        sizeY: number;
    }): KareszMap {
        return {
            sizeX,
            sizeY,
            matrix: Array(sizeX)
                .fill(Field.empty)
                .map(() => Array(sizeY).fill(Field.empty)),
        };
    }

    /**
     * Parse a string as a matrix.
     */
    protected parseMapAsString(s: string, separator: string = '\n') {
        this.map.matrix = s
            .split(separator)
            .map((x) =>
                x.split('').map((x) => FIELD_VALUES[parseInt(x)] ?? Field.empty)
            );
    }

    /**
     * Get the coordinates one step forward
     * @param {number} i the index of the player
     */
    protected forward({
        position,
        rotation,
    }: {
        rotation: Rotation;
        position: Point;
    }) {
        // Rotations: 0 up, 1 right, 2 down, 3 left
        return {
            x: position.x + compareTo(rotation, (rotation % 2) + 1),
            y: position.y + compareTo(rotation, (rotation % 2) + 1),
        };
    }

    /**
     * Check if point is still inside the map
     */
    protected inBounds({ x, y }: { x: number; y: number }): boolean {
        return x <= this.map.sizeX && y <= this.map.sizeY && x >= 0 && y >= 0;
    }

    /**
     * Check if field at position is a wall or not
     */
    protected isWall({ x, y }: { x: number; y: number }): boolean {
        return this.map.matrix[x][y] == 1;
    }

    /**
     * Check if player is able to take a step forward
     */
    protected canStep({ x, y }: { x: number; y: number }): boolean {
        return this.inBounds({ x, y }) && !this.isWall({ x, y });
    }

    /**
     * Make steps for all players. Only relevant in karesz-sync. Rules: if two players
     * attempt to step on the same field or they try to step over each other (by stepping
     * on each other's position) both of them get eliminated.
     * It is also possible to eliminate other players by stepping on their fields while they
     * are not moving
     */
    protected makeSteps(): void {
        this.proposedPositions.forEach((players, point) => {
            // two (or more) players stepping on the same field
            if (players.length > 1) {
                players.forEach((x) => this.removeList.push(x));
                return;
            }
            // player being stepped on by another.
            // NOTE: the player is not getting removed from `this.players` map
            // right away, so if they are facing each other and stepping
            // to each other's positions they will both die eventually
            this.players.forEach((x, i) => {
                if (x.position == point && x.proposedPosition === undefined)
                    this.removeList.push(i);
            });
            // actually step
            const p = this.players.get(players[0]);
            if (p === undefined) return;
            this.players.set(players[0], { ...p, position: point });
        });

        this.proposedPositions.clear();
    }

    /**
     * Remove all players included in `this.removeList` and reset.
     * @param callback: called when a player dies
     */
    protected makeRemovals(
        callback?: (id: string, score: number, alive: number) => void
    ): void {
        this.removeList.forEach((x) => {
            const player = this.players.get(x);
            this.players.delete(x);
            if (player) {
                this.disqualified.set(x, player);
                if (callback) callback(x, player.score, this.players.size);
            }
        });
        this.removeList = [];
    }

    /* ---------- KARESZ FUNCTIONS ---------- */

    /**
     * Make one step forward
     * C#: `Lépj()`
     */
    protected proposeStep(player: Karesz, id: string): Karesz {
        const p = this.forward(player);
        // if attempts to step out the map or into a wall, just simply die
        if (!p || !this.canStep(p)) {
            this.removeList.push(id);
            return player;
        }
        const prev = this.proposedPositions.get(p);
        this.proposedPositions.set(
            p,
            prev === undefined ? [id] : prev.concat(id)
        );
        return { ...player, proposedPosition: p };
    }

    /**
     * Make karesz turn left or right by 90 deg
     * Directions: LEFT = -1 | RIGHT = 1
     * C#: `Fordulj()`
     */
    protected turn(player: Karesz, direction: number): Karesz {
        player.rotation = modulo(player.rotation + direction, 4);
        return player;
    }

    /**
     * Check if there's a rock at karesz's position
     * C#: `Van_e_alattam_kavics()`
     */
    protected isRockUnder(player: Karesz): boolean {
        return (
            this.map.matrix[player.position.x][player.position.y] != Field.empty
        );
    }

    /**
     * Put down a rock under karesz
     * C#: `Tegyél_le_egy_kavicsot()`
     */
    protected placeRock(player: Karesz, rockColor: number) {
        this.map.matrix[player.position.x][player.position.y] = rockColor;
    }

    /**
     * Pick up a rock from karesz's position
     * C#: `Vegyél_fel_egy_kavicsot()`
     */
    protected pickUpRock(player: Karesz) {
        this.map.matrix[player.position.x][player.position.y] = Field.empty;
    }

    /**
     * Return the field value of karesz's position
     * C#: `Mi_van_alattam()`
     */
    protected whatIsUnder(player: Karesz): number {
        return (
            this.map.matrix[player.position.x][player.position.y] ?? Field.empty
        );
    }

    /**
     * Check if there's a wall in front of karesz
     * C#: `Va_e_előttem_fal()`
     */
    protected wallAhead(player: Karesz): boolean {
        return this.isWall(this.forward(player));
    }

    /**
     * Check if karesz is facing the edge of the map
     * C#: `Kilépek_e_a_pályáról()`
     */
    protected edgeOfMap(player: Karesz): boolean {
        return this.inBounds(this.forward(player));
    }

    /**
     * Measure the distance between karesz and the closest wall/player.
     * @returns -1 if nothing is visible within 10 blocks
     * C#: `Ultrahang_szenzor()`
     */
    protected radar(player: Karesz): number {
        var steps = 0;
        var position: Point = player.position;
        const rotation: Rotation = player.rotation;
        while (++steps <= 10) {
            position = this.forward({ position, rotation });
            // check wall
            if (this.map.matrix[position.x][position.y] == Field.wall) {
                return steps;
            }
            // don't check other players in multiplayer
            if (!this.multiPlayer) {
                return -1;
            }
            // check player
            // TODO: iterate map object and return steps
            this.players.forEach((x) => {
                if (x.position == position) return steps;
            });
        }
        return -1;
    }

    /**
     * Get what direction is karesz looking at (0-3)
     */
    protected direction(player: Karesz): number {
        return player.rotation;
    }
}

// xd
