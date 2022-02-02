import { randstr } from '$lib/util/util';
import type { ReplacementRules } from './config';

const ALLOWED_IMPORTS_CSHARP = [
    'System',
    'System.Threading',
    'System.Collections.Generic',
    'System.Numerics'
]

interface ReplaceRules {
    [replaceTo:string]: { match:RegExp, x:boolean };
}

export class Template {
    public rand:string = `_${randstr(20)}`;
    public readCode:string = randstr(10);
    public writeCode:string = randstr(10);
    protected code:string;
    private readonly betweenParanthesis:RegExp = /(?<=\()(.*?)(?=\))/gm;
    private rules:ReplaceRules;
    
    constructor(rawCode:string, ruleSet:Array<ReplacementRules>) {
        this.code = rawCode;
        // generate replacement rules
        for(const key in ruleSet) {
            this.rules[ 
                ruleSet[key].std == 'none' ? 
                '' 
                : 
                `${ruleSet[key].std == 'in' ? 'stdin' : 'stdout'}_${this.rand}(${ruleSet[key].cmd.includes('"') ? ruleSet[key].cmd : `"${ruleSet[key].cmd}"` })` 
            ] = { match:ruleSet[key].match, x:ruleSet[key].x !== undefined };
        }
    }

    /**
     * Replaces the `FELADAT` function with `Main`
     */
    protected replaceMain():undefined|{ error?:string; } {
        // main already exists
        if(this.code.match(/void\s+Main\s*\((.*|\s*)\)/gm))
            return { error:'Main function already exists in user submitted code. Aborting.' };        
        const newCode = this.code.replaceAll(/void\s+FELADAT\s*\((.*|\s*)\)/gm, 'static void Main(string[] args)');
        // no replacements occured
        if(newCode == this.code) return { error:'Unable to find FELADAT function in user submitted code. Aborting.' };
        this.code = newCode;
    }

    /**
     * Replace :x: with the content between two paranthesis
     */
    private replaceX(s:string, match:RegExp, key:string):string {
        const r = s.match(match);
        if (!r) return s;
        r.map(x => {
            s = s.replaceAll(x, key.replaceAll(':x:', x.match(this.betweenParanthesis)[0].trim()));
        });
        return s;
    }

    /**
     * Replace a series of strings/matches in a string
     */
    protected _replace(code?:string):string {
        var s = code ?? this.code;
        for(const key in this.rules) 
            s = this.rules[key].x ? this.replaceX(s, this.rules[key].match, key) : s.replaceAll(this.rules[key].match, key);
       return s;
    }

    protected replace():{ error?:string; }|undefined {
        const { error } = this.replaceMain();
        if(error) return { error };
        this.code = this._replace();
    }

    /**
     * Get the template code with the imports, namespace, main class
     */
    public get _code():string {
        return `
${ALLOWED_IMPORTS_CSHARP.map(x => `using ${x};`).join('\n')}
namespace Karesz
{
    class Program
    {
        static bool stdin_${this.rand}(string c,string m){Console.WriteLine($"${this.readCode} 0 {c}");string l=Console.ReadLine();return l==m;}
        static int stdin_${this.rand}(string c){Console.WriteLine($"${this.readCode} 0 {c}");string l=Console.ReadLine();return int.Parse(l);}
        static void stdout_${this.rand}(string c){Console.WriteLine($"${this.writeCode} 0 {c}");}
        
        ${this.code}
    }
}`;
    }
}
