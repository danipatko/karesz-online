using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Concurrent;

class Program
{
    static ConcurrentDictionary<int, (bool, string)> Commands_ = new ConcurrentDictionary<int, (bool, string)>();
    static ConcurrentDictionary<int, string> Results_ = new ConcurrentDictionary<int, string>();

    static Barrier Bar_ = new Barrier(2, (b) =>
    {
        Results_.Clear();
        foreach (var item in Commands_)
        {
            Console.WriteLine($"random_key {item.Key} {item.Value.Item2}");
            if (item.Value.Item1) Results_.TryAdd(item.Key, Console.ReadLine());
        }
        Console.WriteLine("round_key");
        Commands_.Clear();
    });

    static bool stdin_(int i, string c, string m)
    {
        Commands_.TryAdd(i, (true, c));
        Bar_.SignalAndWait();
        if (Results_.TryGetValue(i, out string res)) return res == m;
        else return false;
    }

    static int stdin_(int i, string c)
    {
        Commands_.TryAdd(i, (true, c));
        Bar_.SignalAndWait();
        return int.Parse(Results_[i]);
    }

    static void stdout_(int i, string c)
    {
        Commands_.TryAdd(i, (false, c));
        Bar_.SignalAndWait();
    }
    static void Kill_()
    {
        Thread.Sleep(2000);
        Environment.Exit(0);
    }
    static void Main()
    {
        // new Thread(Kill_).Start();
        Parallel.Invoke(epic_thread, second_thread);
        // Bar_.Dispose();
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