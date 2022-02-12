import { randstr } from '../../../karesz/util';
import { Template } from './template';
import type { ReplacementRules } from './config';

export class SyncTemplate extends Template {
    public threads: { code: string; caller?: string }[] = [];
    public timeout: number = 2000;

    constructor(
        rawCode: Map<number, string>,
        ruleSet: Array<ReplacementRules>
    ) {
        // irrelevant
        super('', ruleSet);
        rawCode.forEach((c, i) => {
            const { code, caller } = this.replace(i, c);
            this.threads.push({ code, caller });
        });
    }

    public override replace(
        index: number,
        raw: string
    ): { code?: string; caller?: string } {
        const caller = `_${randstr(20)}`;
        // change FELADAT function name to 'caller'
        var code = raw.replaceAll(
            /void\s+FELADAT\s*\((\s*|.*)\)/gm,
            `static void ${caller}()`
        );
        if (code == raw) {
            this.error = 'Unable to find FELADAT function';
            return;
        }
        code = this._replace(index, code);
        return { caller, code };
    }

    public override get _code(): string {
        return `using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

class Program
{
    struct Command_${this.rand}
    {
        public string Str_${this.rand} { get; set; }
        public bool Input_${this.rand} { get; set; }
        public Command_${this.rand}(string s, bool io)
        {
            Str_${this.rand} = s;
            Input_${this.rand} = io;
        }
    }
    static Dictionary<int, Command_${this.rand}> Commands_${
            this.rand
        } = new Dictionary<int, Command_${this.rand}>();
    static Dictionary<int, string> Results_${
        this.rand
    } = new Dictionary<int, string>();
    static Barrier Bar_${this.rand} = new Barrier(${this.threads.length}, (b) =>
    {
        Results_${this.rand}.Clear();
        foreach(int key in Commands_${this.rand}.Keys)
        {
            Console.WriteLine($"${this.key} {key} {(Commands_${
            this.rand
        }[key].Input_${this.rand} ? '>' : '<')} {Commands_${
            this.rand
        }[key].Str_${this.rand}}");
            if (Commands_${this.rand}[key].Input_${this.rand}) Results_${
            this.rand
        }[key] = Console.ReadLine();
        }
        Commands_${this.rand}.Clear();
    });

    static bool stdin_${this.rand}(int i, string c, string m)
    {
        Commands_${this.rand}[i] = new Command_${this.rand}(c, true);
        Bar_${this.rand}.SignalAndWait();
        return Results_${this.rand}[i] == m;
    }

    static int stdin_${this.rand}(int i, string c)
    {
        Commands_${this.rand}[i] = new Command_${this.rand}(c, true);
        Bar_${this.rand}.SignalAndWait();
        return int.Parse(Results_${this.rand}[i]);
    }

    static void stdout_${this.rand}(int i, string c)
    {
        Commands_${this.rand}[i] = new Command_${this.rand}(c, false);
        Bar_${this.rand}.SignalAndWait();
    }
    static void Kill_${this.rand}() {
        Thread.Sleep(2000);
        Environment.Exit(0);
    }
    static void Main()
    {
        new Thread(Kill_${this.rand}).Start();
        Parallel.Invoke(${this.threads.map((x) => x.caller).join(',')});
        Bar_${this.rand}.Dispose();
    }

    /* USER CODE */

    ${this.threads.map((x) => x.code).join('\n\n')}
}
`;
    }
}

/* 
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

class Program
{
    struct Command_${this.rand}
    {
        public string Str_${this.rand} { get; set; }
        public bool Input_${this.rand} { get; set; }
        public Command_${this.rand}(string s, bool io)
        {
            Str_${this.rand} = s;
            Input_${this.rand} = io;
        }
    }
    static Dictionary<int, Command> Commands_${this.rand} = new Dictionary<int, Command>();
    static Dictionary<int, string> Results_${this.rand} = new Dictionary<int, string>();
    static Barrier Bar_${this.rand} = new Barrier(COUNT HERE, (b) =>
    {
        Results_${this.rand}.Clear();
        foreach(int key in Commands.Keys)
        {
            Console.WriteLine($"key {(Commands_${this.rand}[key].Input_${this.rand} ? '>' : '<')} {Commands_${this.rand}[key].Str_${this.rand}}");
            if (Commands_${this.rand}[key].Input_${this.rand}) Results_${this.rand}[key] = Console.ReadLine();
        }
        Commands_${this.rand}.Clear();
    });

    static bool stdin_${this.rand}(int i, string c, string m)
    {
        Commands_${this.rand}[i] = new Command_${this.rand}(c, true);
        Bar_${this.rand}.SignalAndWait(10000);
        return Results_${this.rand}[i] == m;
    }

    static int stdin_${this.rand}(int i, string c)
    {
        Commands_${this.rand}[i] = new Command_${this.rand}(c, true);
        Bar_${this.rand}.SignalAndWait(10000);
        return int.Parse(Results_${this.rand}[i]);
    }

    static void stdout_${this.rand}(int i, string c)
    {
        Commands_${this.rand}[i] = new Command_${this.rand}(c, false);
        Bar_${this.rand}.SignalAndWait(10000);
    }

    static void Main()
    {
        Parallel.Invoke(action, action1, action2);
        Bar_${this.rand}.Dispose();
    }

    
}

*/
