using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Concurrent;

class Program
{
    static ConcurrentDictionary<int, (bool, string)> Commands_0b8zZmkWAn = new ConcurrentDictionary<int, (bool, string)>();
    static ConcurrentDictionary<int, string> Results_0b8zZmkWAn = new ConcurrentDictionary<int, string>();

    static Barrier Bar_0b8zZmkWAn = new Barrier(2, (b) =>
    {
        Results_0b8zZmkWAn.Clear();
        foreach (var item in Commands_0b8zZmkWAn)
        {
            Console.WriteLine($"rwnYy4Txiv {item.Key} {item.Value.Item2}");
            if (item.Value.Item1) Results_0b8zZmkWAn.TryAdd(item.Key, Console.ReadLine());
        }
        Console.WriteLine("4FjfgLbjD3");
        Commands_0b8zZmkWAn.Clear();
    });

    static bool stdin_0b8zZmkWAn(int i, string c, string m)
    {
        Commands_0b8zZmkWAn.TryAdd(i, (true, c));
        Bar_0b8zZmkWAn.SignalAndWait();
        if (Results_0b8zZmkWAn.TryGetValue(i, out string res)) return res == m;
        else return false;
    }

    static int stdin_0b8zZmkWAn(int i, string c)
    {
        Commands_0b8zZmkWAn.TryAdd(i, (true, c));
        Bar_0b8zZmkWAn.SignalAndWait();
        return int.Parse(Results_0b8zZmkWAn[i]);
    }

    static void stdout_0b8zZmkWAn(int i, string c)
    {
        Commands_0b8zZmkWAn.TryAdd(i, (false, c));
        Bar_0b8zZmkWAn.SignalAndWait();
    }
    static void Kill_0b8zZmkWAn() 
    {
        Thread.Sleep(2000);
        Environment.Exit(0);
    }
    static void Main()
    {
        new Thread(Kill_0b8zZmkWAn).Start();
        Parallel.Invoke(thread_1, thread_2);
        // Bar_0b8zZmkWAn.Dispose();
    }

    /* USER CODE */

    static void thread_1() { while(true) stdout_0b8zZmkWAn(0, "0"); }


static void thread_2() { while(true) stdout_0b8zZmkWAn(1, "0"); }
}