import { Command } from '../../../karesz/core/types';

export interface ReplacementRules {
    std: 'in' | 'out' | 'none';
    cmd: string | number;
    match: RegExp;
    x?: boolean;
}

/**
 * These are the functions to replace
 * The three util functions:
 * int  | stdin(string command) -> writes command and receives and integer in stdin
 * bool | stdin(string command, string match) -> writes command and compares it with the match value
 * void | stdout(string command) -> simply writes command
 * KEYS:
 * - std:in/out -> use 'in' if you're expecting a return value
 * - cmd: the command that needs to be interpreted
 * - match: regular expression - all matches from the code will be replaced
 *     - x: if you have a value in code (for example 'Tegyél_le_egy_kavicsot(fekete)'), in the command you can specify :x:
 *          to be the replaced with the value of the regular expression given in s (e.g. "place "+fekete)
 *     - s: select a string from base match. if omitted, it will select the value between the brackets
 */
export const RULES: Array<ReplacementRules> = [
    { std: 'out', cmd: Command.forward, match: /Lépj\s*\(\s*\)/gm },
    {
        std: 'out',
        cmd: Command.turn_right,
        match: /Fordulj_jobbra\s*\(\s*\)/gm,
    },
    { std: 'out', cmd: Command.turn_left, match: /Fordulj_balra\s*\(\s*\)/gm },
    {
        std: 'out',
        cmd: Command.turn_left,
        match: /Fordulj\s*\(\s*balra\s*\)/gm,
    },
    {
        std: 'out',
        cmd: Command.turn_right,
        match: /Fordulj\s*\(\s*jobbra\s*\)/gm,
    },
    {
        std: 'out',
        cmd: Command.pick_up_rock,
        match: /Vegyél_fel_egy_kavicsot\s*\(\s*\)/gm,
    },
    {
        std: 'out',
        cmd: `"${Command.place_rock} 2"`,
        match: /Tegyél_le_egy_kavicsot\s*\(\s*\)/gm,
    },
    {
        std: 'out',
        cmd: `"${Command.place_rock}"+:x:`,
        match: /Tegyél_le_egy_kavicsot\s*\(.*\)/gm,
        x: true,
    },
    {
        std: 'in',
        cmd: `"${Command.check_direction}","0"`,
        match: /Északra_néz\s*\(\s*\)/gm,
    },
    {
        std: 'in',
        cmd: `"${Command.check_direction}","2"`,
        match: /Délre_néz\s*\(\s*\)/gm,
    },
    {
        std: 'in',
        cmd: `"${Command.check_direction}","3"`,
        match: /Keletre_néz\s*\(\s*\)/gm,
    },
    {
        std: 'in',
        cmd: `"${Command.check_direction}","1"`,
        match: /Nyugatra_néz\s*\(\s*\)/gm,
    },
    { std: 'in', cmd: Command.check_direction, match: /Merre_néz\s*\(\s*\)/gm },
    {
        std: 'in',
        cmd: `"${Command.check_under}","1"`,
        match: /Van_e_itt_kavics\s*\(\s*\)/gm,
    },
    {
        std: 'in',
        cmd: Command.check_field,
        match: /Mi_van_alattam\s*\(\s*\)/gm,
    },
    {
        std: 'in',
        cmd: `"${Command.check_wall}","1"`,
        match: /Van_e_előttem_fal\s*\(\s*\)/gm,
    },
    {
        std: 'in',
        cmd: `"${Command.check_bounds}","1"`,
        match: /Kilépek_e_a_pályáról\s*\(\s*\)/gm,
    },
    {
        std: 'out',
        cmd: `"${Command.turn_direction}"+:x:`,
        match: /Fordulj\s*\(.*\)/gm,
        x: true,
    },
    { std: 'none', cmd: '2', match: /fekete/gm },
    { std: 'none', cmd: '3', match: /piros/gm },
    { std: 'none', cmd: '4', match: /zöld/gm },
    { std: 'none', cmd: '5', match: /sárga/gm },
];
