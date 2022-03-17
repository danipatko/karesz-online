using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

class Program
{
    struct Command_
    {
        public string C_ { get; }
        public bool IO_ { get; }
        public Command_(string c, bool io)
        {
            C_ = c;
            IO_ = io;
        }
    }
    static Dictionary<int, Command_> Commands_ = new Dictionary<int, Command_>();
    static Dictionary<int, string> Results_ = new Dictionary<int, string>();
    static Barrier Bar_ = new Barrier(2, (b) =>
    {
        Results_.Clear();
        foreach(int key in Commands_.Keys)
        {
            Console.WriteLine($"random_key {key} {Commands_[key].C_}");
            if (Commands_[key].IO_) Results_[key] = Console.ReadLine();
        }
        Console.WriteLine("round_key");
        Commands_.Clear();
    });

    static bool stdin_(int i, string c, string m)
    {
        Commands_.Add(i, new Command_(c, true));
        Bar_.SignalAndWait();
        return Results_[i] == m;
    }

    static int stdin_(int i, string c)
    {
        Commands_.Add(i, new Command_(c, true));
        Bar_.SignalAndWait();
        return int.Parse(Results_[i]);
    }

    static void stdout_(int i, string c)
    {
        Commands_.Add(i, new Command_(c, false));
        Bar_.SignalAndWait();
    }
    static void Kill_()
    {
        Thread.Sleep(2000);
        Environment.Exit(0);
    }
    static void Main()
    {
        new Thread(Kill_).Start();
        Parallel.Invoke(epic_thread, second_thread);
        Bar_.Dispose();
    }

    /* USER CODE */

    static void epic_thread()
        {
            stdout_(0, "3 1");
            while(!stdin_(0, "a","1")) {
                stdout_(0, "0");
            }
            while(!stdin_(0, "a","1")) {
                stdout_(0, "0");
            }
        }


static void second_thread()
        {
            stdout_(1, "3 1");
            while(!stdin_(1, "a","1")) {
                stdout_(1, "0");
            }
            while(!stdin_(1, "a","1")) {
                stdout_(1, "0");
            }
        }
}