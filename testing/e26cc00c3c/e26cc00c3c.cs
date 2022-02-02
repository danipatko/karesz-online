using System;
using System.Threading;
using System.Collections.Generic;
using System.Numerics;

namespace Karesz
{
    class Program
    {
        static bool stdin(int i, string c, string m)
        {
            Commands[i] = new Command($"> 2f9146a72a {i} {c}", m);
            WaitAndReset(i);
            return Results[i] == "1";
        }
        static int stdin(int i, string c)
        {
            Commands[i] = new Command($"> 2f9146a72a {i} {c}");
            WaitAndReset(i);
            return Results[i];
        }
        static void stdout(int i, string c)
        {
            Commands[i] = new Command($"< 2f9146a72a {i} {c}");
            WaitAndReset(i);
        }
        static void WaitAndReset(int i)
        {
            ((ManualResetEvent)WH[i]).Set();
            CanContinueEvent.WaitOne(1000);
            CanContinueEvent.Reset();
        }
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
        static void ExecuteCommands()
        {
            Results.Clear();
            foreach(int key in Commands.Keys)
            {
                if (Commands[key].IO) Results[key] = stdin(Commands[key]);
                else Console.WriteLine(Commands[key].command);
            }
            Commands.Clear();
            CanContinueEvent.Set();
        }
        static int stdin(Command c)
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
        static WaitHandle[] WH =
        {
            new ManualResetEvent(false),
new ManualResetEvent(false),
        };
        static void Main(string[] args)
        {
            new Thread(new ThreadStart(_e965680017b37d1533a7)).Start();
new Thread(new ThreadStart(_046d286fa24be70a079a)).Start();
            new Thread(new ThreadStart(() => KillAfter(2000))).Start();
            while (true)
            {
                WaitHandle.WaitAll(WH);
                ResetWaitHandlers();
                ExecuteCommands();
            }
        }

        /* USER CODE HERE */

        
        static void _e965680017b37d1533a7()
        {
            stdout("r");
            while(!stdin("o","1")) {
                stdout("f");
            }
            while(!stdin("o","1")) {
                stdout("f");
            }
        }



        static void _046d286fa24be70a079a()
        {
            stdout("r");
            while(!stdin("o","1")) {
                stdout("f");
            }
            while(!stdin("o","1")) {
                stdout("f");
            }
        }
    }
}
