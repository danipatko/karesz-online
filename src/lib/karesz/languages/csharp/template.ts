import { randstr } from '../../../karesz/util';
import { Conversion, RULES, RULESET } from './config';

const ALLOWED_IMPORTS_CSHARP = [
    'System',
    'System.Threading',
    'System.Collections.Generic',
    'System.Numerics',
];

export class Template {
    public readonly rand: string = `_${randstr(20)}`;
    public readonly key: string = randstr(10);
    public readonly roundKey: string = randstr(10);
    private readonly betweenParanthesis: RegExp = /(?<=\()(.*?)(?=\))/gm;
    protected players: { [key: string]: string };
    public multiPlayer: boolean;
    public errors: { id: string; description: string }[] = [];

    constructor(players: { [id: string]: string }) {
        this.players = players;
        this.multiPlayer = Object.keys(players).length > 1;
    }

    /**
     * Run safety checks on user-submitted code.
     * Filters the input with an array of regex
     */
    private runChecks(input: string, id: string): string {
        let res: RegExpMatchArray | null = null;
        for (const key in RULESET) {
            res = input.match(RULESET[key].regex);
            if (res === null) continue;

            if (RULESET[key].action == 'disqualify') {
                delete this.players[id];
                this.errors.push({
                    description: RULESET[key].reason ?? 'bruh',
                    id,
                });
                return '';
            } else
                return input.replace(
                    RULESET[key].regex,
                    RULESET[key].replace ?? ''
                );
        }
        return input;
    }

    /**
     * Get the content from two parenthesis in a string
     */
    private getInner(str: string): string | undefined {
        const match = str.match(this.betweenParanthesis);
        return match === null ? undefined : match[0];
    }

    /**
     * Replace all karesz functions
     */
    private replace(input: string, id: string): string {
        let command: string = '';
        let match: RegExpMatchArray | null;
        for (const key in RULES) {
            // replace constants (such as 'fekete')
            if (RULES[key].std == 'none') {
                input = input.replace(RULES[key].regex, RULES[key].command);
                continue;
            }
            // capture means that the arguments of the original command keeps it's value, by adding the expression to the command as a string
            // replace :x: in the command
            if (RULES[key].capture) {
                match = input.match(RULES[key].regex);
                if (match === null) continue;

                command = RULES[key].command.replace(
                    /\:x\:/gm,
                    this.getInner(match[0]) ?? '""' // replace with empty string if no match (hardly possible)
                );
            } else {
                // simply replace
                command = input.replace(
                    RULES[key].regex,
                    RULES[key].command.includes(`"`)
                        ? RULES[key].command
                        : `"${RULES[key].command}"`
                );
            }
            input = input.replace(
                RULES[key].regex,
                // std[in|out]_[random](id,command,match)
                `std${RULES[key].std}_${this.rand}(${id}, ${command})`
            );
        }
        return input;
    }

    /**
     * Replaces the `FELADAT` function with `Main`
     */
    private replaceEntry(input: string, id: string): string {
        const newCode = input.replace(
            /void\s+FELADAT\s*\((.*|\s*)\)/gm,
            this.multiPlayer && id
                ? `static void _${id}()`
                : 'static void Main(string[] args)'
        );

        // no replacements occured
        if (newCode == input) {
            this.errors.push({
                id,
                description:
                    'Unable to find FELADAT entry. Make sure your submitted code contains a void type FELADAT function.',
            });
            delete this.players[id];
            return '';
        }
        return newCode;
    }

    /**
     * Get the template code with the imports, namespace, main class
     */
    public get code(): string {
        // prepare players' code
        for (const key in this.players) {
            this.players[key] = this.runChecks(this.players[key], key);
            this.players[key] = this.replaceEntry(this.players[key], key);
            this.players[key] = this.replace(this.players[key], key);
        }
        return this.multiPlayer
            ? getMultiPlayerTemplate(
                  this.rand,
                  this.key,
                  this.players,
                  this.roundKey
              )
            : getSingleTemplate(this.rand, this.key, this.players[0]);
    }
}

/**
 * Template code for single player
 */
const getSingleTemplate = (rand: string, key: string, code: string) => `
${ALLOWED_IMPORTS_CSHARP.map((x) => `using ${x};`).join('\n')}
namespace Karesz
{
    class Program
    {
        static bool stdin_${rand}(string c,string m){Console.WriteLine($"> ${key} {c}");string l=Console.ReadLine();return l==m;}
        static int stdin_${rand}(string c){Console.WriteLine($"> ${key} {c}");string l=Console.ReadLine();return int.Parse(l);}
        static void stdout_${rand}(string c){Console.WriteLine($"< ${key} {c}");}
        
        ${code}
    }
}`;

/**
 * Template code for multiplayer
 */
const getMultiPlayerTemplate = (
    rand: string,
    key: string,
    threads: { [key: string]: string },
    roundKey: string
) => `
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

class Program
{
    struct Command_${rand}
    {
        public string Str_${rand} { get; set; }
        public bool Input_${rand} { get; set; }
        public Command_${rand}(string s, bool io)
        {
            Str_${rand} = s;
            Input_${rand} = io;
        }
    }
    static Dictionary<int, Command_${rand}> Commands_${rand} = new Dictionary<int, Command_${rand}>();
    static Dictionary<int, string> Results_${rand} = new Dictionary<int, string>();
    static Barrier Bar_${rand} = new Barrier(${
    Object.keys(threads).length
}, (b) =>
    {
        Results_${rand}.Clear();
        foreach(int key in Commands_${rand}.Keys)
        {
            Console.WriteLine($"${key} {key} {(Commands_${rand}[key].Input_${rand} ? '>' : '<')} {Commands_${rand}[key].Str_${rand}}");
            if (Commands_${rand}[key].Input_${rand}) Results_${rand}[key] = Console.ReadLine();
        }
        Console.WriteLine("${roundKey}");
        Commands_${rand}.Clear();
    });

    static bool stdin_${rand}(int i, string c, string m)
    {
        Commands_${rand}[i] = new Command_${rand}(c, true);
        Bar_${rand}.SignalAndWait();
        return Results_${rand}[i] == m;
    }

    static int stdin_${rand}(int i, string c)
    {
        Commands_${rand}[i] = new Command_${rand}(c, true);
        Bar_${rand}.SignalAndWait();
        return int.Parse(Results_${rand}[i]);
    }

    static void stdout_${rand}(int i, string c)
    {
        Commands_${rand}[i] = new Command_${rand}(c, false);
        Bar_${rand}.SignalAndWait();
    }
    static void Kill_${rand}() {
        Thread.Sleep(2000);
        Environment.Exit(0);
    }
    static void Main()
    {
        new Thread(Kill_${rand}).Start();
        Parallel.Invoke(${Object.keys(threads).join(',')});
        Bar_${rand}.Dispose();
    }

    /* USER CODE */

    ${Object.keys(threads)
        .map((x) => threads[x])
        .join('\n\n')}
}`;
