import { randstr } from '../../../karesz/util';
import type { ReplacementRules } from './config';

const ALLOWED_IMPORTS_CSHARP = [
    'System',
    'System.Threading',
    'System.Collections.Generic',
    'System.Numerics',
];

interface ReplaceRules {
    [replaceTo: string]: { match: RegExp; x: boolean };
}

export class Template {
    public readonly rand: string = `_${randstr(20)}`;
    public readonly key: string = randstr(10);
    public readonly roundKey: string = randstr(10);
    protected code: string;
    private readonly betweenParanthesis: RegExp = /(?<=\()(.*?)(?=\))/gm;
    private rules: ReplaceRules = {};
    public error: string | undefined;

    constructor(rawCode: string, ruleSet: Array<ReplacementRules>) {
        this.code = rawCode;
        // generate replacement rules
        for (const key in ruleSet) {
            this.rules[
                ruleSet[key].std == 'none'
                    ? ruleSet[key].cmd // colors
                    : `${ruleSet[key].std == 'in' ? 'stdin' : 'stdout'}_${
                          this.rand
                      }(:i:, ${
                          ruleSet[key].cmd.toString().includes('"')
                              ? ruleSet[key].cmd
                              : `"${ruleSet[key].cmd}"`
                      })`
            ] = { match: ruleSet[key].match, x: ruleSet[key].x === true };
        }
        this.replace(0, this.code);
    }

    /**
     * Replaces the `FELADAT` function with `Main`
     */
    protected replaceMain(): void {
        // main already exists
        if (this.code.match(/void\s+Main\s*\((.*|\s*)\)/gm)) {
            this.error = 'Main function already exists in user submitted code.';
            return;
        }
        const newCode = this.code.replace(
            /void\s+FELADAT\s*\((.*|\s*)\)/gm,
            'static void Main(string[] args)'
        );
        // no replacements occured
        if (newCode == this.code) {
            this.error =
                'Unable to find FELADAT function in user submitted code. Aborting.';
            return;
        }
        this.code = newCode;
    }

    /**
     * Replace :x: with the content between two paranthesis
     */
    private replaceX(s: string, match: RegExp, key: string): string {
        const r = s.match(match);
        if (!r) return s;
        let parenthesisMatch: RegExpMatchArray | null;
        r.map((x) => {
            parenthesisMatch = x.match(this.betweenParanthesis);
            if (parenthesisMatch === null) return;
            // @ts-ignore
            s = s.replaceAll(
                x,
                key.replace(/\:x\:/g, parenthesisMatch[0].trim())
            );
        });
        return s;
    }

    /**
     * Replace a series of strings/matches in a string
     */
    protected _replace(index: number, code?: string): string {
        var s = code ?? this.code;
        for (const key in this.rules)
            s = this.rules[key].x
                ? this.replaceX(
                      s,
                      this.rules[key].match,
                      key.replace(/\:i\:/gm, index.toString())
                  )
                : // @ts-ignore
                  s.replaceAll(
                      this.rules[key].match,
                      key.replace(/\:i\:/gm, index.toString())
                  );
        return s;
    }

    public replace(
        index: number,
        code?: string | undefined
    ): { code?: string; caller?: string } {
        this.replaceMain();
        this.code = this._replace(index, code ?? this.code);
        return {};
    }

    /**
     * Get the template code with the imports, namespace, main class
     */
    public get _code(): string {
        return `
${ALLOWED_IMPORTS_CSHARP.map((x) => `using ${x};`).join('\n')}
namespace Karesz
{
    class Program
    {
        static bool stdin_${
            this.rand
        }(string c,string m){Console.WriteLine($"> ${
            this.key
        } 0 {c}");string l=Console.ReadLine();return l==m;}
        static int stdin_${this.rand}(string c){Console.WriteLine($"> ${
            this.key
        } 0 {c}");string l=Console.ReadLine();return int.Parse(l);}
        static void stdout_${this.rand}(string c){Console.WriteLine($"< ${
            this.key
        } 0 {c}");}
        
        ${this.code}
    }
}`;
    }
}
