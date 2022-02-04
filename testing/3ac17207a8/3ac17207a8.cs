using System;
using System.Threading;
using System.Collections.Generic;
using System.Numerics;

namespace Karesz
{
    class Program
    {
        static bool stdin__b1473d399c890a3ae96d(int i, string c, string m)
        {
            Commands__b1473d399c890a3ae96d[i] = new Command__b1473d399c890a3ae96d($"> d8a4b4e7ae {i} {c}", m);
            WaitAndReset__b1473d399c890a3ae96d(i);
            return Results__b1473d399c890a3ae96d[i] == 1;
        }
        static int stdin__b1473d399c890a3ae96d(int i, string c)
        {
            Commands__b1473d399c890a3ae96d[i] = new Command__b1473d399c890a3ae96d($"> d8a4b4e7ae {i} {c}");
            WaitAndReset__b1473d399c890a3ae96d(i);
            return Results__b1473d399c890a3ae96d[i];
        }
        static void stdout__b1473d399c890a3ae96d(int i, string c)
        {
            Commands__b1473d399c890a3ae96d[i] = new Command__b1473d399c890a3ae96d($"< d8a4b4e7ae {i} {c}");
            WaitAndReset__b1473d399c890a3ae96d(i);
        }
        static void WaitAndReset__b1473d399c890a3ae96d(int i)
        {
            ((ManualResetEvent)WH__b1473d399c890a3ae96d[i]).Set();
            CanContinueEvent__b1473d399c890a3ae96d.WaitOne(1000);
            CanContinueEvent__b1473d399c890a3ae96d.Reset();
        }
        public struct Command__b1473d399c890a3ae96d
        {
            public string command__b1473d399c890a3ae96d;
            public string match__b1473d399c890a3ae96d;
            public Command__b1473d399c890a3ae96d(string _c, string _m ="")
            {
                command__b1473d399c890a3ae96d = _c; match__b1473d399c890a3ae96d = _m;
            }
            public bool isMatch__b1473d399c890a3ae96d { get => match__b1473d399c890a3ae96d != ""; }
            public bool IO__b1473d399c890a3ae96d { get => command__b1473d399c890a3ae96d.StartsWith(">"); }
        }
        static Dictionary<int, Command__b1473d399c890a3ae96d> Commands__b1473d399c890a3ae96d = new Dictionary<int, Command__b1473d399c890a3ae96d>();
        static Dictionary<int, int> Results__b1473d399c890a3ae96d = new Dictionary<int, int>();
        static ManualResetEvent CanContinueEvent__b1473d399c890a3ae96d = new ManualResetEvent(false);
        static void ExecuteCommands__b1473d399c890a3ae96d()
        {
            Results__b1473d399c890a3ae96d.Clear();
            foreach(int key in Commands__b1473d399c890a3ae96d.Keys)
            {
                if (Commands__b1473d399c890a3ae96d[key].IO__b1473d399c890a3ae96d) Results__b1473d399c890a3ae96d[key] = _stdin__b1473d399c890a3ae96d(Commands__b1473d399c890a3ae96d[key]);
                else Console.WriteLine(Commands__b1473d399c890a3ae96d[key].command__b1473d399c890a3ae96d);
            }
            Commands__b1473d399c890a3ae96d.Clear();
            CanContinueEvent__b1473d399c890a3ae96d.Set();
        }
        static int _stdin__b1473d399c890a3ae96d(Command__b1473d399c890a3ae96d c)
        {
            Console.WriteLine(c.command__b1473d399c890a3ae96d);
            string input = Console.ReadLine();
            return c.isMatch__b1473d399c890a3ae96d ? input == c.match__b1473d399c890a3ae96d ? 1 : 0 : int.Parse(input);
        }
        static void ResetWaitHandlers__b1473d399c890a3ae96d()
        {
            foreach (ManualResetEvent mre in WH__b1473d399c890a3ae96d)
                mre.Reset();
        }
        static void KillAfter__b1473d399c890a3ae96d(int ms)
        {
            Thread.Sleep(ms);
            Environment.Exit(0);
        }
        static WaitHandle[] WH__b1473d399c890a3ae96d =
        {
            new ManualResetEvent(false),
new ManualResetEvent(false),
        };
        static void Main(string[] args)
        {
            new Thread(new ThreadStart(_e952879f705a181f73da)).Start();
new Thread(new ThreadStart(_7d3fb2b7092a4a9c905a)).Start();
            new Thread(new ThreadStart(() => KillAfter__b1473d399c890a3ae96d(2000))).Start();
            while (true)
            {
                WaitHandle.WaitAll(WH__b1473d399c890a3ae96d);
                ResetWaitHandlers__b1473d399c890a3ae96d();
                ExecuteCommands__b1473d399c890a3ae96d();
            }
        }

        /* USER CODE HERE */

        
static void _e952879f705a181f73da()
{
    stdout__b1473d399c890a3ae96d(0, "r");
    while(!stdin__b1473d399c890a3ae96d(0, "o","1")) {
        stdout__b1473d399c890a3ae96d(0, "f");
    }
    while(!stdin__b1473d399c890a3ae96d(0, "o","1")) {
        stdout__b1473d399c890a3ae96d(0, "f");
    }
}



static void _7d3fb2b7092a4a9c905a()
{
    stdout__b1473d399c890a3ae96d(1, "r");
    while(!stdin__b1473d399c890a3ae96d(1, "o","1")) {
        stdout__b1473d399c890a3ae96d(1, "f");
    }
    while(!stdin__b1473d399c890a3ae96d(1, "o","1")) {
        stdout__b1473d399c890a3ae96d(1, "f");
    }
}
    }
}
