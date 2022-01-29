import { randstr } from '$lib/util/util';
import { Template } from './template';
import type { ReplacementRules } from './config';

export class SyncTemplate extends Template {
    public threads:{ code:string; caller?:string; }[] = []; 
    public timeout:number = 2000;

    constructor(rawCode:string[], ruleSet:Array<ReplacementRules>) {
        // irrelevant
        super(rawCode.join('\n\n'), ruleSet);
        for (let i = 0; i < rawCode.length; i++) {
            const { code, caller, error } = this.replaceCode(rawCode[i]);
            if(error !== undefined) console.log(`An error occured while preparing script: ${error}`);
            this.threads.push({ code, caller });        
        }
    }

    public replaceCode(raw:string):{ code?:string; caller?:string; error?:string; } {
        const caller = `_${randstr(20)}`;
        // change FELADAT function name to 'caller'
        var code = raw.replaceAll(/void\s+FELADAT\s*\((\s*|.*)\)/gm, `void ${caller}()`);
        if(code == raw)
            return { error:'Unable to find FELADAT function' };
        code = this._replace(code);
        return { caller, code };
    }

    public override get _code(): string {
        return `using System;
using System.Threading;
using System.Collections.Generic;
using System.Numerics;

namespace Karesz
{
    class Program
    {
        static bool stdin_${this.rand}(int i, string c, string m)
        {
            Commands_${this.rand}[i] = new Command_${this.rand}($"in:{c}", m);
            WaitAndReset_${this.rand}(i);
            return Results_${this.rand}[i] == 1;
        }
        static int stdin_${this.rand}(int i, string c)
        {
            Commands_${this.rand}[i] = new Command_${this.rand}($"in:{c}");
            WaitAndReset_${this.rand}(i);
            return Results_${this.rand}[i];
        }
        static void stdout_${this.rand}(int i, string c)
        {
            Commands_${this.rand}[i] = new Command_${this.rand}($"out:{c}");
            WaitAndReset_${this.rand}(i);
        }
        static void WaitAndReset_${this.rand}(int i)
        {
            ((ManualResetEvent)WH_${this.rand}[i]).Set();
            CanContinueEvent_${this.rand}.WaitOne(1000);
            CanContinueEvent_${this.rand}.Reset();
        }
        public struct Command_${this.rand}
        {
            public string command_${this.rand};
            public string match_${this.rand};
            public Command_${this.rand}(string _c, string _m ="")
            {
                command_${this.rand} = _c; match_${this.rand} = _m;
            }
            public bool isMatch_${this.rand} { get => match_${this.rand} != ""; }
            public bool IO_${this.rand} { get => command_${this.rand}.StartsWith("in:"); }
        }
        static Dictionary<int, Command_${this.rand}> Commands_${this.rand} = new Dictionary<int, Command_${this.rand}>();
        static Dictionary<int, int> Results_${this.rand} = new Dictionary<int, int>();
        static ManualResetEvent CanContinueEvent_${this.rand} = new ManualResetEvent(false);
        static void ExecuteCommands_${this.rand}()
        {
            Results_${this.rand}.Clear();
            foreach(int key in Commands_${this.rand}.Keys)
            {
                if (Commands_${this.rand}[key].IO_${this.rand}) Results_${this.rand}[key] = stdin_${this.rand}(Commands_${this.rand}[key]);
                else Console.WriteLine(Commands_${this.rand}[key].command_${this.rand});
            }
            Commands_${this.rand}.Clear();
            CanContinueEvent_${this.rand}.Set();
        }
        static int stdin_${this.rand}(Command_${this.rand} c)
        {
            Console.WriteLine(c.command_${this.rand});
            string input = Console.ReadLine();
            return c.isMatch_${this.rand} ? input == c.match_${this.rand} ? 1 : 0 : int.Parse(input);
        }
        static void ResetWaitHandlers_${this.rand}()
        {
            foreach (ManualResetEvent mre in WH_${this.rand})
                mre.Reset();
        }
        static void KillAfter_${this.rand}(int ms)
        {
            Thread.Sleep(ms);
            Environment.Exit(0);
        }
        static WaitHandle[] WH_${this.rand} =
        {
            ${this.threads.map(x => 'new ManualResetEvent(false),').join('\n')}
        };
        static void Main(string[] args)
        {
            ${this.threads.map(x => `new Thread(new ThreadStart(${x.caller})).Start();`).join('\n')}
            new Thread(new ThreadStart(() => KillAfter_${this.rand}(${this.timeout}))).Start();
            while (true)
            {
                WaitHandle.WaitAll(WH_${this.rand});
                ResetWaitHandlers_${this.rand}();
                ExecuteCommands_${this.rand}();
            }
        }

        /* USER CODE HERE */

        ${this.threads.map(x => x.code).join('\n\n\n')}
    }
}
`;
    }
}


