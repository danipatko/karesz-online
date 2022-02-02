using System;
using System.Threading;
using System.Collections.Generic;
using System.Numerics;

namespace Karesz
{
    class Program
    {
        static bool stdin__2eca2734cd89f326f9a0(int i, string c, string m)
        {
            Commands__2eca2734cd89f326f9a0[i] = new Command__2eca2734cd89f326f9a0($"> 2d3b849dd7 {i} {c}", m);
            WaitAndReset__2eca2734cd89f326f9a0(i);
            return Results__2eca2734cd89f326f9a0[i] == 1;
        }
        static int stdin__2eca2734cd89f326f9a0(int i, string c)
        {
            Commands__2eca2734cd89f326f9a0[i] = new Command__2eca2734cd89f326f9a0($"> 2d3b849dd7 {i} {c}");
            WaitAndReset__2eca2734cd89f326f9a0(i);
            return Results__2eca2734cd89f326f9a0[i];
        }
        static void stdout__2eca2734cd89f326f9a0(int i, string c)
        {
            Commands__2eca2734cd89f326f9a0[i] = new Command__2eca2734cd89f326f9a0($"< 2d3b849dd7 {i} {c}");
            WaitAndReset__2eca2734cd89f326f9a0(i);
        }
        static void WaitAndReset__2eca2734cd89f326f9a0(int i)
        {
            ((ManualResetEvent)WH__2eca2734cd89f326f9a0[i]).Set();
            CanContinueEvent__2eca2734cd89f326f9a0.WaitOne(1000);
            CanContinueEvent__2eca2734cd89f326f9a0.Reset();
        }
        public struct Command__2eca2734cd89f326f9a0
        {
            public string command__2eca2734cd89f326f9a0;
            public string match__2eca2734cd89f326f9a0;
            public Command__2eca2734cd89f326f9a0(string _c, string _m ="")
            {
                command__2eca2734cd89f326f9a0 = _c; match__2eca2734cd89f326f9a0 = _m;
            }
            public bool isMatch__2eca2734cd89f326f9a0 { get => match__2eca2734cd89f326f9a0 != ""; }
            public bool IO__2eca2734cd89f326f9a0 { get => command__2eca2734cd89f326f9a0.StartsWith(">"); }
        }
        static Dictionary<int, Command__2eca2734cd89f326f9a0> Commands__2eca2734cd89f326f9a0 = new Dictionary<int, Command__2eca2734cd89f326f9a0>();
        static Dictionary<int, int> Results__2eca2734cd89f326f9a0 = new Dictionary<int, int>();
        static ManualResetEvent CanContinueEvent__2eca2734cd89f326f9a0 = new ManualResetEvent(false);
        static void ExecuteCommands__2eca2734cd89f326f9a0()
        {
            Results__2eca2734cd89f326f9a0.Clear();
            foreach(int key in Commands__2eca2734cd89f326f9a0.Keys)
            {
                if (Commands__2eca2734cd89f326f9a0[key].IO__2eca2734cd89f326f9a0) Results__2eca2734cd89f326f9a0[key] = stdin__2eca2734cd89f326f9a0(Commands__2eca2734cd89f326f9a0[key]);
                else Console.WriteLine(Commands__2eca2734cd89f326f9a0[key].command__2eca2734cd89f326f9a0);
            }
            Commands__2eca2734cd89f326f9a0.Clear();
            CanContinueEvent__2eca2734cd89f326f9a0.Set();
        }
        static int stdin__2eca2734cd89f326f9a0(Command__2eca2734cd89f326f9a0 c)
        {
            Console.WriteLine(c.command__2eca2734cd89f326f9a0);
            string input = Console.ReadLine();
            return c.isMatch__2eca2734cd89f326f9a0 ? input == c.match__2eca2734cd89f326f9a0 ? 1 : 0 : int.Parse(input);
        }
        static void ResetWaitHandlers__2eca2734cd89f326f9a0()
        {
            foreach (ManualResetEvent mre in WH__2eca2734cd89f326f9a0)
                mre.Reset();
        }
        static void KillAfter__2eca2734cd89f326f9a0(int ms)
        {
            Thread.Sleep(ms);
            Environment.Exit(0);
        }
        static WaitHandle[] WH__2eca2734cd89f326f9a0 =
        {
            new ManualResetEvent(false),
new ManualResetEvent(false),
        };
        static void Main(string[] args)
        {
            new Thread(new ThreadStart(_86e0ae1baa1418767afb)).Start();
new Thread(new ThreadStart(_29be29b58c05841bd59e)).Start();
            new Thread(new ThreadStart(() => KillAfter__2eca2734cd89f326f9a0(2000))).Start();
            while (true)
            {
                WaitHandle.WaitAll(WH__2eca2734cd89f326f9a0);
                ResetWaitHandlers__2eca2734cd89f326f9a0();
                ExecuteCommands__2eca2734cd89f326f9a0();
            }
        }

        /* USER CODE HERE */


void _86e0ae1baa1418767afb()
{
    stdout__2eca2734cd89f326f9a0("r");
    while(Tudok_e_lépni()) {
        stdout__2eca2734cd89f326f9a0("f");
    }
    Fordulj_meg();
    while(Tudok_e_lépni()) {
        stdout__2eca2734cd89f326f9a0("f");
    }
}



void _29be29b58c05841bd59e()
{
    stdout__2eca2734cd89f326f9a0("r");
    while(Tudok_e_lépni()) {
        stdout__2eca2734cd89f326f9a0("f");
    }
    Fordulj_meg();
    while(Tudok_e_lépni()) {
        stdout__2eca2734cd89f326f9a0("f");
    }
}
    }
}