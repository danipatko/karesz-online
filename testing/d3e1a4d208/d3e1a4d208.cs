using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

class Program
{
    struct Command__6f1f70be8870a1d5a073
    {
        public string Str__6f1f70be8870a1d5a073 { get; set; }
        public bool Input__6f1f70be8870a1d5a073 { get; set; }
        public Command__6f1f70be8870a1d5a073(string s, bool io)
        {
            Str__6f1f70be8870a1d5a073 = s;
            Input__6f1f70be8870a1d5a073 = io;
        }
    }
    static Dictionary<int, Command__6f1f70be8870a1d5a073> Commands__6f1f70be8870a1d5a073 = new Dictionary<int, Command__6f1f70be8870a1d5a073>();
    static Dictionary<int, string> Results__6f1f70be8870a1d5a073 = new Dictionary<int, string>();
    static Barrier Bar__6f1f70be8870a1d5a073 = new Barrier(2, (b) =>
    {
        Results__6f1f70be8870a1d5a073.Clear();
        foreach(int key in Commands__6f1f70be8870a1d5a073.Keys)
        {
            Console.WriteLine($"93d687741f {key} {(Commands__6f1f70be8870a1d5a073[key].Input__6f1f70be8870a1d5a073 ? '>' : '<')} {Commands__6f1f70be8870a1d5a073[key].Str__6f1f70be8870a1d5a073}");
            if (Commands__6f1f70be8870a1d5a073[key].Input__6f1f70be8870a1d5a073) Results__6f1f70be8870a1d5a073[key] = Console.ReadLine();
        }
        Commands__6f1f70be8870a1d5a073.Clear();
    });

    static bool stdin__6f1f70be8870a1d5a073(int i, string c, string m)
    {
        Commands__6f1f70be8870a1d5a073[i] = new Command__6f1f70be8870a1d5a073(c, true);
        Bar__6f1f70be8870a1d5a073.SignalAndWait();
        return Results__6f1f70be8870a1d5a073[i] == m;
    }

    static int stdin__6f1f70be8870a1d5a073(int i, string c)
    {
        Commands__6f1f70be8870a1d5a073[i] = new Command__6f1f70be8870a1d5a073(c, true);
        Bar__6f1f70be8870a1d5a073.SignalAndWait();
        return int.Parse(Results__6f1f70be8870a1d5a073[i]);
    }

    static void stdout__6f1f70be8870a1d5a073(int i, string c)
    {
        Commands__6f1f70be8870a1d5a073[i] = new Command__6f1f70be8870a1d5a073(c, false);
        Bar__6f1f70be8870a1d5a073.SignalAndWait();
    }
    static void Kill__6f1f70be8870a1d5a073() {
        Thread.Sleep(2000);
        Environment.Exit(0);
    }
    static void Main()
    {
        new Thread(Kill__6f1f70be8870a1d5a073).Start();
        Parallel.Invoke(_45300672e785e37d65e3,_934c9c678edd4680de8c);
        Bar__6f1f70be8870a1d5a073.Dispose();
    }

    /* USER CODE */

    
static void _45300672e785e37d65e3()
{
    stdout__6f1f70be8870a1d5a073(0, "r");
    while(!stdin__6f1f70be8870a1d5a073(0, "o","1")) {
        stdout__6f1f70be8870a1d5a073(0, "f");
    }
    while(!stdin__6f1f70be8870a1d5a073(0, "o","1")) {
        stdout__6f1f70be8870a1d5a073(0, "f");
    }
}


static void _934c9c678edd4680de8c()
{
    stdout__6f1f70be8870a1d5a073(1, "r");
    while(!stdin__6f1f70be8870a1d5a073(1, "o","1")) {
        stdout__6f1f70be8870a1d5a073(1, "f");
    }
    while(!stdin__6f1f70be8870a1d5a073(1, "o","1")) {
        stdout__6f1f70be8870a1d5a073(1, "f");
    }
}
}
