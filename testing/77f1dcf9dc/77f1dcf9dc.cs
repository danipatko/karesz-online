using System;
using System.Threading;
using System.Collections.Generic;
using System.Numerics;

namespace Karesz
{
    class Program
    {
        public struct Command
        {
            public string command;
            public string match;
            public Command(string _c, string _m ="")
            {
                command = _c; match = _m;
            }
            public bool isMatch { get => match != ""; }
            public bool IO { get => command.StartsWith(">"); }
        }
        static Dictionary<int, Command> Commands = new Dictionary<int, Command>();
        static Dictionary<int, int> Results = new Dictionary<int, int>();
        static ManualResetEvent CanContinueEvent = new ManualResetEvent(false);
        static WaitHandle[] WH =
        {
            new ManualResetEvent(false),
            new ManualResetEvent(false),
        };
        static bool stdin(int i, string c, string m)
        {
            Commands[i] = new Command($"9b1706d34c > {i} {c}", m);
            WaitAndReset(i);
            return Results[i] == 1;
        }
        static int stdin(int i, string c)
        {
            Commands[i] = new Command($"9b1706d34c > {i} {c}");
            WaitAndReset(i);
            return Results[i];
        }
        static void stdout(int i, string c)
        {
            Commands[i] = new Command($"9b1706d34c < {i} {c}");
            WaitAndReset(i);
        }
        static void WaitAndReset(int i)
        {
            ((ManualResetEvent)WH[i]).Set();
            CanContinueEvent.WaitOne();
            CanContinueEvent.Reset();
        }
        static void ExecuteCommands()
        {
            Results.Clear();
            foreach(int key in Commands.Keys)
            {
                if (Commands[key].IO) Results[key] = _stdin(Commands[key]);
                else Console.WriteLine(Commands[key].command);
            }
            Console.WriteLine("--- CALLED ---");
            Commands.Clear();
            CanContinueEvent.Set();
        }
        static int _stdin(Command c)
        {
            Console.WriteLine(c.command);
            string input = Console.ReadLine();
            return c.isMatch ? input == c.match ? 1 : 0 : int.Parse(input);
        }
        static void ResetWaitHandlers()
        {
            foreach (ManualResetEvent mre in WH)
                mre.Reset();
        }
        static void KillAfter(int ms)
        {
            Thread.Sleep(ms);
            Environment.Exit(0);
        }
        static void Main(string[] args)
        {
            new Thread(new ThreadStart(_4364907a93924458a788)).Start();
            new Thread(new ThreadStart(_0fcd28030dbd5d5322c1)).Start();
            // new Thread(new ThreadStart(() => KillAfter(2000))).Start();
            while (true)
            {
                WaitHandle.WaitAll(WH);
                Console.WriteLine("Waited ---------");
                ResetWaitHandlers();
                ExecuteCommands();
                Console.WriteLine("Executed ---------");
            }
        }

        /* USER CODE HERE */

        
static void _4364907a93924458a788()
{
    stdout(0, "r");
    while(!stdin(0, "o","1")) {
        stdout(0, "f");
    }
    while(!stdin(0, "o","1")) {
        stdout(0, "f");
    }
}



static void _0fcd28030dbd5d5322c1()
{
    stdout(1, "r");
    while(!stdin(1, "o","1")) {
        stdout(1, "f");
    }
    while(!stdin(1, "o","1")) {
        stdout(1, "f");
    }
}
    }
}
