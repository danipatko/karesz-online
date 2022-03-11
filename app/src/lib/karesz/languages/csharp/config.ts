import { Command } from '../../../karesz/core/types';

export interface RuleSet {
    regex: RegExp;
    action: 'replace' | 'remove' | 'disqualify'; // replace a specific part of code
    replace?: string;
    reason?: string;
}

export interface Conversion {
    std: 'in' | 'out' | 'none';
    command: string;
    regex: RegExp;
    capture?: boolean; // if enabled, captures the content between the parenthesis and puts it inside the command as a value
}

export const RULESET: RuleSet[] = [];

export const RULES: Conversion[] = [
    { std: 'out', command: Command.forward, regex: /Lépj\s*\(\s*\)/gm },
    {
        std: 'out',
        command: Command.turn_right,
        regex: /Fordulj_jobbra\s*\(\s*\)/gm,
    },
    {
        std: 'out',
        command: Command.turn_left,
        regex: /Fordulj_balra\s*\(\s*\)/gm,
    },
    {
        std: 'out',
        command: Command.turn_left,
        regex: /Fordulj\s*\(\s*balra\s*\)/gm,
    },
    {
        std: 'out',
        command: Command.turn_right,
        regex: /Fordulj\s*\(\s*jobbra\s*\)/gm,
    },
    {
        std: 'out',
        command: Command.pick_up_rock,
        regex: /Vegyél_fel_egy_kavicsot\s*\(\s*\)/gm,
    },
    {
        std: 'out',
        command: `"${Command.place_rock} 2"`,
        regex: /Tegyél_le_egy_kavicsot\s*\(\s*\)/gm,
    },
    {
        std: 'out',
        command: `"${Command.place_rock}"+:x:`,
        regex: /Tegyél_le_egy_kavicsot\s*\(.*\)/gm,
        capture: true,
    },
    {
        std: 'in',
        command: `"${Command.check_direction}","0"`,
        regex: /Északra_néz\s*\(\s*\)/gm,
    },
    {
        std: 'in',
        command: `"${Command.check_direction}","2"`,
        regex: /Délre_néz\s*\(\s*\)/gm,
    },
    {
        std: 'in',
        command: `"${Command.check_direction}","3"`,
        regex: /Keletre_néz\s*\(\s*\)/gm,
    },
    {
        std: 'in',
        command: `"${Command.check_direction}","1"`,
        regex: /Nyugatra_néz\s*\(\s*\)/gm,
    },
    {
        std: 'in',
        command: Command.check_direction,
        regex: /Merre_néz\s*\(\s*\)/gm,
    },
    {
        std: 'in',
        command: `"${Command.check_under}","1"`,
        regex: /Van_e_itt_kavics\s*\(\s*\)/gm,
    },
    {
        std: 'in',
        command: Command.check_field,
        regex: /Mi_van_alattam\s*\(\s*\)/gm,
    },
    {
        std: 'in',
        command: `"${Command.check_wall}","1"`,
        regex: /Van_e_előttem_fal\s*\(\s*\)/gm,
    },
    {
        std: 'in',
        command: `"${Command.check_bounds}","1"`,
        regex: /Kilépek_e_a_pályáról\s*\(\s*\)/gm,
    },
    {
        std: 'out',
        command: `"${Command.turn_direction}"+:x:`,
        regex: /Fordulj\s*\(.*\)/gm,
        capture: true,
    },
    { std: 'none', command: '2', regex: /fekete/gm },
    { std: 'none', command: '3', regex: /piros/gm },
    { std: 'none', command: '4', regex: /zöld/gm },
    { std: 'none', command: '5', regex: /sárga/gm },
];
