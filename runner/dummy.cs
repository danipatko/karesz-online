using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

class Program
{
    struct Command_asdf
    {
        public string Str_asdf { get; set; }
        public bool Input_asdf { get; set; }
        public Command_asdf(string s, bool io)
        {
            Str_asdf = s;
            Input_asdf = io;
        }
    }
    static Dictionary<int, Command_asdf> Commands_asdf = new Dictionary<int, Command_asdf>();
    static Dictionary<int, string> Results_asdf = new Dictionary<int, string>();
    static Barrier Bar_asdf = new Barrier(2, (b) =>
    {
        Results_asdf.Clear();
        foreach(int key in Commands_asdf.Keys)
        {
            Console.WriteLine($" {(Commands_asdf[key].Input_asdf ? '>' : '<')} {Commands_asdf[key].Str_asdf}");
            if (Commands_asdf[key].Input_asdf) Results_asdf[key] = Console.ReadLine();
        }
        Console.WriteLine("");
        Commands_asdf.Clear();
    });

    static bool stdin_asdf(int i, string c, string m)
    {
        Commands_asdf[i] = new Command_asdf(c, true);
        Bar_asdf.SignalAndWait();
        return Results_asdf[i] == m;
    }

    static int stdin_asdf(int i, string c)
    {
        Commands_asdf[i] = new Command_asdf(c, true);
        Bar_asdf.SignalAndWait();
        return int.Parse(Results_asdf[i]);
    }

    static void stdout_asdf(int i, string c)
    {
        Commands_asdf[i] = new Command_asdf(c, false);
        Bar_asdf.SignalAndWait();
    }
    static void Kill_asdf()
    {
        Thread.Sleep(2000);
        Environment.Exit(0);
    }
    static void Main()
    {
        new Thread(Kill_asdf).Start();
        Parallel.Invoke(epic_thread, second_thread);
        Bar_asdf.Dispose();
    }

    /* USER CODE */

        static void epic_thread()
        {
            stdout_asdf(1, "3 1");
            while(!stdin_asdf(1, "e")) {
                stdout_asdf(1, "0");
            }
            while(!stdin_asdf(1, "e")) {
                stdout_asdf(1, "0");
            }
        }
        static void second_thread()
        {
            stdout_asdf(1, "3 1");
            while(!stdin_asdf(1, "e")) {
                stdout_asdf(1, "0");
            }
            while(!stdin_asdf(1, "e")) {
                stdout_asdf(1, "0");
            }
        }
}