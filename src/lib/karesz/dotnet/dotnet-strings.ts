const UTIL_FUNCTIONS_FOR_CSHARP = 
`
\t\tpublic static bool stdin(string command,string match){Console.WriteLine($"in:{command}");string value=Console.ReadLine();return value==match;}
\t\tpublic static int stdin(string command){Console.WriteLine($"in:{command}");string value=Console.ReadLine();return int.Parse(value);}
\t\tpublic static void stdout(string command){Console.WriteLine($"out:{command}");}
`;

/**
 * Replace function with extras: select a string from matched one that will be placed on :x:
 * @param s the base string
 * @param match primary match
 * @param key string to replace match with
 * @param select string to replace :x: with
 * @returns replaced string
 */
 const riplace = (s:string, match:RegExp, key:string, select:RegExp) => {
    const r = s.match(match);
    if (!r) return s;
    
    r.map(x => {
        s = s.replaceAll(x, key.replaceAll(':x:', x.match(select)[0].trim()));
    });
    return s;
}

/**
 * Replace a series of strings/matches in a string
 * @returns {string} replaced string
 */
const replace = (args:object, s:string):string => {
    for(const key in args) 
        s = args[key].x ? riplace(s, args[key].x, key, args[key].s) : s.replaceAll(args[key], key);
    return s;
}

/**
 * Insert a string to a string at a specific index
 */
const insert = (s:string, toAdd:string, at:number):string => 
    [s.slice(0, at), toAdd, s.slice(at)].join('');

// Regex capture for the content between two parenthesis
const sel = /(?<=\()(.*?)(?=\))/gm;

export const replaceKareszFunctions = (str:string):string => {
    // Instert utility functions after 
    // 'public partial class Form1 : Form {'

    str = replace({
        'public class Program': /public\s+partial\s+class\s+Form1\s+:\s+Form/gm,
        'stdout("step")':/Lépj\s*\(\s*\)/gm,
        'stdout("turn 1")':/Fordulj_jobbra\s*\(\s*\)/gm,
        'stdout("turn -1")':/Fordulj_balra\s*\(\s*\)/gm,
        'stdout("turn -1") ':/Fordulj\s*\(\s*balra\s*\)/gm,
        'stdout("turn 1") ':/Fordulj\s*\(\s*jobbra\s*\)/gm,
        'stdout("pickup")':/Vegyél_fel_egy_kavicsot\s*\(\s*\)/gm,
        'stdout("place")':/Tegyél_le_egy_kavicsot\s*\(\s*\)/gm,
        'stdout("place "+:x:)':{ x:/Tegyél_le_egy_kavicsot\s*\(.*\)/gm, s:sel },
        'stdin("up","0")':/Északra_néz\s*\(\s*\)/gm,
        'stdin("down","2")':/Délre_néz\s*\(\s*\)/gm,
        'stdin("left","3")':/Keletre_néz\s*\(\s*\)/gm,
        'stdin("right","1")':/Nyugatra_néz\s*\(\s*\)/gm,
        'stdin("look")':/Merre_néz\s*\(\s*\)/gm,
        'stdin("isrock","true")':/Van_e_itt_kavics\s*\(\s*\)/gm,
        'stdin("under")':/Mi_van_alattam\s*\(\s*\)/gm,
        'stdin("wallahead","true")':/Van_e_előttem_fal\s*\(\s*\)/gm,
        'stdin("outofbounds","true")':/Kilépek_e_a_pályáról\s*\(\s*\)/gm,
        'stdout("turn "+:x:)':{ x: /Fordulj\s*\(.*\)/gm, s:sel }, 
        '\t\tstatic :x:':{ x:/.*[a-zA-Z]+\s+[a-zA-Z\_\u00C0-\u00ff]+\s*\(.*\)[\n\r\s]*\{/gm, s:/.*/gms },
        'void Main(string[] args)':/void\s+FELADAT\s*\(\s*\)/gm,
        '':/using(?!.*(Linq|Collections|System\;|Text|Threading).*).+/gm,
        // ^\s*
    }, str); 

    const match = /public\s+class\s+Program[\n\r\s]+\{/gm.exec(str);
    // Unable to locate Program
    if(! match)
        return;

    // insert util functions to start of script
    return insert(str, UTIL_FUNCTIONS_FOR_CSHARP, str.indexOf(match[0]) + match[0].length);
}

/**
 * Write a string to the stdin of a child process
 * @param mono the child process to write to
 * @param data writeable string
 */
export const write = (mono:any, data:string):void => {
    if(! mono.stdin.writable) return;
    // these 3 commands are necessary for std inputs
    mono.stdin.cork();
    mono.stdin.write(`${data}\n`);
    mono.stdin.uncork();
}

