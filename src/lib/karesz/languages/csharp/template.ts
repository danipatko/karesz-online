import { randstr } from '$lib/util/util';

export interface KareszFunctions {
    std:'in'|'out'|'none';
    cmd:string;
    match:{ x:RegExp, s?:RegExp|undefined }|RegExp;
}

const functionsToInject = (stdin:string, stdout:string):string => {
    return `\npublic static bool ${stdin}(string c,string m){System.Console.WriteLine($"in:{c}");string v=System.Console.ReadLine();return v==m;}
    public static int ${stdin}(string c){System.Console.WriteLine($"in:{c}");string v=System.Console.ReadLine();return int.Parse(v);}
    public static void ${stdout}(string c){System.Console.WriteLine($"out:{c}");}\n`;
}

/**
 * Replace function with extras: select a string from matched one that will be placed on :x:
 */
const replaceX = (s:string, match:RegExp, key:string, select?:RegExp|undefined):string => {
    if(!select)
        select = sel;
    const r = s.match(match);
    if (!r) return s;
    r.map(x => {
        s = s.replaceAll(x, key.replaceAll(':x:', x.match(select)[0].trim()));
    });
    return s;
}

/**
 * Replace a series of strings/matches in a string
 */
const replace = (args:object, s:string):string => {
    for(const key in args) 
        s = args[key].x ? replaceX(s, args[key].x, key, args[key].s) : s.replaceAll(args[key], key);
    return s;
}

/**
 * Insert a string to a string at a specific index
 */
const insert = (s:string, toAdd:string, at:number):string =>
    [s.slice(0, at), toAdd, s.slice(at)].join('');

// Regex capture for the content between two parenthesis
const sel:RegExp = /(?<=\()(.*?)(?=\))/gm;

export const replaceKareszFunctions = (str:string, config:Array<KareszFunctions>):string|undefined => {
    const stdout = `_${randstr(30)}`;
    const stdin = `_${randstr(30)}`;

    const toReplace = { ...FORM_REFORMAT };
    for(const key in config) 
        toReplace[ config[key].std != 'none' 
        ? `${config[key].std=='in' ? stdin : stdout}(${config[key].cmd.includes('"') ? config[key].cmd : `"${config[key].cmd}"` })`
        : `${config[key].cmd}`
    ] = config[key].match;
    
    str = replace(toReplace, str);
    const match = /public\s+class\s+Program[\n\r\s]+\{/gm.exec(str);
    // Unable to locate Program class
    if(! match)
        return;
    
    // insert util functions to start of script
    return insert(str, functionsToInject(stdin, stdout), str.indexOf(match[0]) + match[0].length);
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
export const BASE_CONFIG:Array<KareszFunctions> = [
    { std:'out', cmd:'step', match:/Lépj\s*\(\s*\)/gm },
    { std:'out', cmd:'turn 1', match: /Fordulj_jobbra\s*\(\s*\)/gm },
    { std:'out', cmd:'turn -1', match: /Fordulj_balra\s*\(\s*\)/gm },
    { std:'out', cmd:'turn -1', match: /Fordulj\s*\(\s*balra\s*\)/gm },
    { std:'out', cmd:'turn 1', match: /Fordulj\s*\(\s*jobbra\s*\)/gm },
    { std:'out', cmd:'pickup', match: /Vegyél_fel_egy_kavicsot\s*\(\s*\)/gm },
    { std:'none', cmd:'2', match: /fekete/gm },
    { std:'none', cmd:'3', match: /piros/gm },
    { std:'none', cmd:'4', match: /zöld/gm },
    { std:'none', cmd:'5', match: /sárga/gm },
    { std:'out', cmd:'place', match: /Tegyél_le_egy_kavicsot\s*\(\s*\)/gm },
    { std:'out', cmd:'"place "+:x:', match: { x:/Tegyél_le_egy_kavicsot\s*\(.*\)/gm } },
    { std:'in', cmd:'"up","0"', match: /Északra_néz\s*\(\s*\)/gm },
    { std:'in', cmd:'"down","2"', match: /Délre_néz\s*\(\s*\)/gm },
    { std:'in', cmd:'"left","3"', match: /Keletre_néz\s*\(\s*\)/gm },
    { std:'in', cmd:'"right","1"', match: /Nyugatra_néz\s*\(\s*\)/gm },
    { std:'in', cmd:'look', match: /Merre_néz\s*\(\s*\)/gm },
    { std:'in', cmd:'"isrock","true"', match: /Van_e_itt_kavics\s*\(\s*\)/gm },
    { std:'in', cmd:'under', match: /Mi_van_alattam\s*\(\s*\)/gm },
    { std:'in', cmd:'"wallahead","true"', match: /Van_e_előttem_fal\s*\(\s*\)/gm },
    { std:'in', cmd:'"outofbounds","true"', match: /Kilépek_e_a_pályáról\s*\(\s*\)/gm },
    { std:'out', cmd:'"turn"+:x:', match: { x: /Fordulj\s*\(.*\)/gm } },
];

/**
 * Base regular expressions to replace the Form namespace with Program, void FELADAT with void Main and restrict imports
 */
export const FORM_REFORMAT = {
    'public class Program': /public\s+partial\s+class\s+Form1\s+:\s+Form/gm,
    '\t\tstatic :x:':{ x:/.*[a-zA-Z]+\s+[a-zA-Z\_\u00C0-\u00ff]+\s*\(.*\)[\n\r\s]*\{/gm, s:/.*/gms },
    'void Main(string[] args)':/void\s+FELADAT\s*\(\.*\)/gm,
    '':/using(?!.*(Linq|Collections|System\;|Text|Threading).*).+/gm    // restrict imports
}
