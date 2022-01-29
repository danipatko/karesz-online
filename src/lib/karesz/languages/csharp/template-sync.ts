import { randstr } from '$lib/util/util';

export interface KareszSyncVariableNames {
    stdin:string;
    stdout:string;
    WaitAndReset:string;
    Command:{
        self:string;
        command:string;    
        match:string;
        IO:string;
        IsMatch:string;
    };
    Commands:string;
    WH:string;
    Results:string;
    CanContinueEvent:string;
    ExecuteCommands:string;
    STDIN:string;
    ResetWaitHandlers:string;
    KillAfter:string;
}

export interface Thread {
    caller:string;
    functions:string;
}

export const randomVariableNames = ():KareszSyncVariableNames => {
    return {
        stdin:randstr(10),
        stdout:randstr(10),
        WaitAndReset:randstr(10),
        Command:{
            self:randstr(10),
            command:randstr(10),    
            match:randstr(10),
            IO:randstr(10),
            IsMatch:randstr(10),
        },
        Commands:randstr(10),
        WH:randstr(10),
        Results:randstr(10),
        CanContinueEvent:randstr(10),
        ExecuteCommands:randstr(10),
        STDIN:randstr(10),
        ResetWaitHandlers:randstr(10),
        KillAfter:randstr(10),
    }
} 

export const getCode = (threads:Array<Thread>) => {
    const names = randomVariableNames();
    return `
using System;
using System.Threading;
using System.Collections.Generic;

namespace Karesz
{
    class Program
    {
        static bool ${names.stdin}(int i, string c, string m)
        {
            ${names.Commands}[i] = new ${names.Command.self}($"in:{c}", m);
            ${names.WaitAndReset}(i);
            return ${names.Results}[i] == 1;
        }
        static int ${names.stdin}(int i, string c)
        {
            ${names.Commands}[i] = new ${names.Command.self}($"in:{c}");
            ${names.WaitAndReset}(i);
            return ${names.Results}[i];
        }
        static void ${names.stdout}(int i, string c)
        {
            ${names.Commands}[i] = new ${names.Command.self}($"out:{c}");
            ${names.WaitAndReset}(i);
        }
        static void ${names.WaitAndReset}(int i)
        {
            ((ManualResetEvent)${names.WH}[i]).Set();
            ${names.CanContinueEvent}.WaitOne(1000);
            ${names.CanContinueEvent}.Reset();
        }
        public struct ${names.Command.self}
        {
            public string ${names.Command.command};
            public string ${names.Command.match};
            public ${names.Command.self}(string _c, string _m ="")
            {
                ${names.Command.command} = _c; ${names.Command.match} = _m;
            }
            public bool ${names.Command.IsMatch} { get => ${names.Command.match} != ""; }
            public bool ${names.Command.IO} { get => ${names.Command.command}.StartsWith("in:"); }
        }
        static Dictionary<int, ${names.Command.self}> ${names.Commands} = new Dictionary<int, ${names.Command.self}>();
        static Dictionary<int, int> ${names.Results} = new Dictionary<int, int>();
        static ManualResetEvent ${names.CanContinueEvent} = new ManualResetEvent(false);
        static void ${names.ExecuteCommands}()
        {
            ${names.Results}.Clear();
            foreach(int key in ${names.Commands}.Keys)
            {
                if (${names.Commands}[key].${names.Command.IO}) ${names.Results}[key] = ${names.STDIN}(${names.Commands}[key]);
                else Console.WriteLine(${names.Commands}[key].${names.Command.command});
            }
            ${names.Commands}.Clear();
            ${names.CanContinueEvent}.Set();
        }
        static int ${names.STDIN}(${names.Command.self} c)
        {
            Console.WriteLine(c.${names.Command.command});
            string input = Console.ReadLine();
            return c.${names.Command.IsMatch} ? input == c.${names.Command.match} ? 1 : 0 : int.Parse(input);
        }
        static void ${names.ResetWaitHandlers}()
        {
            foreach (ManualResetEvent mre in ${names.WH})
                mre.Reset();
        }
        static void ${names.KillAfter}(int ms)
        {
            Thread.Sleep(ms);
            Environment.Exit(0);
        }
        static WaitHandle[] ${names.WH} =
        {
            ${threads.map(x => 'new ManualResetEvent(false),').join('\n')}
        };
        static void Main(string[] args)
        {
            ${ threads.map(x => `new Thread(new ThreadStart(${x.caller})).Start();`).join('\n')}
            new Thread(new ThreadStart(() => KillAfter(2000))).Start();
            while (true)
            {
                WaitHandle.WaitAll(${names.WH});
                ${names.ResetWaitHandlers}();
                ${names.ExecuteCommands}();
            }
        }

        /* USER CODE HERE */

        ${threads.map(x => x.functions).join('\n\n\n')}
    }
}
`;
}


