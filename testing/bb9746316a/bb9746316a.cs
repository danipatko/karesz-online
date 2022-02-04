using System;
using System.Threading;
using System.Collections.Generic;
using System.Numerics;

namespace Karesz
{
    class Program
    {
        static bool stdin__7cecc06b3a69df477048(int i, string c, string m)
        {
            Commands__7cecc06b3a69df477048[i] = new Command__7cecc06b3a69df477048($"> 44d2575a4c {i} {c}", m);
            WaitAndReset__7cecc06b3a69df477048(i);
            return Results__7cecc06b3a69df477048[i] == 1;
        }
        static int stdin__7cecc06b3a69df477048(int i, string c)
        {
            Commands__7cecc06b3a69df477048[i] = new Command__7cecc06b3a69df477048($"> 44d2575a4c {i} {c}");
            WaitAndReset__7cecc06b3a69df477048(i);
            return Results__7cecc06b3a69df477048[i];
        }
        static void stdout__7cecc06b3a69df477048(int i, string c)
        {
            Commands__7cecc06b3a69df477048[i] = new Command__7cecc06b3a69df477048($"< 44d2575a4c {i} {c}");
            WaitAndReset__7cecc06b3a69df477048(i);
        }
        static void WaitAndReset__7cecc06b3a69df477048(int i)
        {
            ((ManualResetEvent)WH__7cecc06b3a69df477048[i]).Set();
            CanContinueEvent__7cecc06b3a69df477048.WaitOne(1000);
            CanContinueEvent__7cecc06b3a69df477048.Reset();
        }
        public struct Command__7cecc06b3a69df477048
        {
            public string command__7cecc06b3a69df477048;
            public string match__7cecc06b3a69df477048;
            public Command__7cecc06b3a69df477048(string _c, string _m ="")
            {
                command__7cecc06b3a69df477048 = _c; match__7cecc06b3a69df477048 = _m;
            }
            public bool isMatch__7cecc06b3a69df477048 { get => match__7cecc06b3a69df477048 != ""; }
            public bool IO__7cecc06b3a69df477048 { get => command__7cecc06b3a69df477048.StartsWith(">"); }
        }
        static Dictionary<int, Command__7cecc06b3a69df477048> Commands__7cecc06b3a69df477048 = new Dictionary<int, Command__7cecc06b3a69df477048>();
        static Dictionary<int, int> Results__7cecc06b3a69df477048 = new Dictionary<int, int>();
        static ManualResetEvent CanContinueEvent__7cecc06b3a69df477048 = new ManualResetEvent(false);
        static void ExecuteCommands__7cecc06b3a69df477048()
        {
            Results__7cecc06b3a69df477048.Clear();
            foreach(int key in Commands__7cecc06b3a69df477048.Keys)
            {
                if (Commands__7cecc06b3a69df477048[key].IO__7cecc06b3a69df477048) Results__7cecc06b3a69df477048[key] = _stdin__7cecc06b3a69df477048(Commands__7cecc06b3a69df477048[key]);
                else Console.WriteLine(Commands__7cecc06b3a69df477048[key].command__7cecc06b3a69df477048);
            }
            Commands__7cecc06b3a69df477048.Clear();
            CanContinueEvent__7cecc06b3a69df477048.Set();
        }
        static int _stdin__7cecc06b3a69df477048(Command__7cecc06b3a69df477048 c)
        {
            Console.WriteLine(c.command__7cecc06b3a69df477048);
            string input = Console.ReadLine();
            return c.isMatch__7cecc06b3a69df477048 ? input == c.match__7cecc06b3a69df477048 ? 1 : 0 : int.Parse(input);
        }
        static void ResetWaitHandlers__7cecc06b3a69df477048()
        {
            foreach (ManualResetEvent mre in WH__7cecc06b3a69df477048)
                mre.Reset();
        }
        static void KillAfter__7cecc06b3a69df477048(int ms)
        {
            Thread.Sleep(ms);
            Environment.Exit(0);
        }
        static WaitHandle[] WH__7cecc06b3a69df477048 =
        {
            new ManualResetEvent(false),
new ManualResetEvent(false),
        };
        static void Main(string[] args)
        {
            new Thread(new ThreadStart(_8ab9494de18e05f1e6eb)).Start();
new Thread(new ThreadStart(_60a676448d80bb80987f)).Start();
            new Thread(new ThreadStart(() => KillAfter__7cecc06b3a69df477048(2000))).Start();
            while (true)
            {
                WaitHandle.WaitAll(WH__7cecc06b3a69df477048);
                ResetWaitHandlers__7cecc06b3a69df477048();
                ExecuteCommands__7cecc06b3a69df477048();
            }
        }

        /* USER CODE HERE */

        
static void _8ab9494de18e05f1e6eb()
{
    stdout__7cecc06b3a69df477048(0, "r");
    while(!stdin__7cecc06b3a69df477048(0, "o","1")) {
        stdout__7cecc06b3a69df477048(0, "f");
    }
    while(!stdin__7cecc06b3a69df477048(0, "o","1")) {
        stdout__7cecc06b3a69df477048(0, "f");
    }
}



static void _60a676448d80bb80987f()
{
    stdout__7cecc06b3a69df477048(1, "r");
    while(!stdin__7cecc06b3a69df477048(1, "o","1")) {
        stdout__7cecc06b3a69df477048(1, "f");
    }
    while(!stdin__7cecc06b3a69df477048(1, "o","1")) {
        stdout__7cecc06b3a69df477048(1, "f");
    }
}
    }
}
