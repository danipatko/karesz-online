using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Concurrent;

class Program
{
    static ConcurrentDictionary<int, (bool, string)> Commands_fRUuj5IB3M = new ConcurrentDictionary<int, (bool, string)>();
    static ConcurrentDictionary<int, string> Results_fRUuj5IB3M = new ConcurrentDictionary<int, string>();

    static Barrier Bar_fRUuj5IB3M = new Barrier(2, (b) =>
    {
        Results_fRUuj5IB3M.Clear();
        foreach (var item in Commands_fRUuj5IB3M)
        {
            Console.WriteLine($"b80LqQn1mB {item.Key} {item.Value.Item2}");
            if (item.Value.Item1) Results_.TryAdd(item.Key, Console.ReadLine());
        }
        Console.WriteLine("YYwSeWE4gh");
        Commands_fRUuj5IB3M.Clear();
    });

    static bool stdin_fRUuj5IB3M(int i, string c, string m)
    {
        Commands_fRUuj5IB3M.TryAdd(i, (true, c));
        Bar_fRUuj5IB3M.SignalAndWait();
        if (Results_fRUuj5IB3M.TryGetValue(i, out string res)) return res == m;
        else return false;
    }

    static int stdin_fRUuj5IB3M(int i, string c)
    {
        Commands_fRUuj5IB3M.TryAdd(i, (true, c));
        Bar_fRUuj5IB3M.SignalAndWait();
        return int.Parse(Results_fRUuj5IB3M[i]);
    }

    static void stdout_fRUuj5IB3M(int i, string c)
    {
        Commands_fRUuj5IB3M.TryAdd(i, (false, c));
        Bar_fRUuj5IB3M.SignalAndWait();
    }
    static void Kill_fRUuj5IB3M() 
    {
        Thread.Sleep(2000);
        Environment.Exit(0);
    }
    static void Main()
    {
        new Thread(Kill_fRUuj5IB3M).Start();
        Parallel.Invoke(thread_1, thread_2);
        // Bar_fRUuj5IB3M.Dispose();
    }

    /* USER CODE */

    static void thread_1() { while(true) stdout_fRUuj5IB3M(0, "0"); }


static void thread_2() { while(true) stdout_fRUuj5IB3M(1, "0"); }
}