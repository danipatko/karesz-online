using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

class Program
{
    struct Command__e4548bf98d29a720f4cb
    {
        public string Str__e4548bf98d29a720f4cb { get; set; }
        public bool Input__e4548bf98d29a720f4cb { get; set; }
        public Command__e4548bf98d29a720f4cb(string s, bool io)
        {
            Str__e4548bf98d29a720f4cb = s;
            Input__e4548bf98d29a720f4cb = io;
        }
    }
    static Dictionary<int, Command__e4548bf98d29a720f4cb> Commands__e4548bf98d29a720f4cb = new Dictionary<int, Command__e4548bf98d29a720f4cb>();
    static Dictionary<int, string> Results__e4548bf98d29a720f4cb = new Dictionary<int, string>();
    static Barrier Bar__e4548bf98d29a720f4cb = new Barrier(2, (b) =>
    {
        Results__e4548bf98d29a720f4cb.Clear();
        foreach(int key in Commands__e4548bf98d29a720f4cb.Keys)
        {
            Console.WriteLine($"5e67d5916e {key} {(Commands__e4548bf98d29a720f4cb[key].Input__e4548bf98d29a720f4cb ? '>' : '<')} {Commands__e4548bf98d29a720f4cb[key].Str__e4548bf98d29a720f4cb}");
            if (Commands__e4548bf98d29a720f4cb[key].Input__e4548bf98d29a720f4cb) Results__e4548bf98d29a720f4cb[key] = Console.ReadLine();
        }
        Commands__e4548bf98d29a720f4cb.Clear();
    });

    static bool stdin__e4548bf98d29a720f4cb(int i, string c, string m)
    {
        Commands__e4548bf98d29a720f4cb[i] = new Command__e4548bf98d29a720f4cb(c, true);
        Bar__e4548bf98d29a720f4cb.SignalAndWait();
        return Results__e4548bf98d29a720f4cb[i] == m;
    }

    static int stdin__e4548bf98d29a720f4cb(int i, string c)
    {
        Commands__e4548bf98d29a720f4cb[i] = new Command__e4548bf98d29a720f4cb(c, true);
        Bar__e4548bf98d29a720f4cb.SignalAndWait();
        return int.Parse(Results__e4548bf98d29a720f4cb[i]);
    }

    static void stdout__e4548bf98d29a720f4cb(int i, string c)
    {
        Commands__e4548bf98d29a720f4cb[i] = new Command__e4548bf98d29a720f4cb(c, false);
        Bar__e4548bf98d29a720f4cb.SignalAndWait();
    }
    static void Kill__e4548bf98d29a720f4cb() {
        Thread.Sleep(2000);
        Environment.Exit(0);
    }
    static void Main()
    {
        new Thread(Kill__e4548bf98d29a720f4cb).Start();
        Parallel.Invoke(_3fee4a39fea871d8541d,_4d8ab8e9334943f937ec);
        Bar__e4548bf98d29a720f4cb.Dispose();
    }

    /* USER CODE */

    
static void _3fee4a39fea871d8541d()
{
    stdout__e4548bf98d29a720f4cb(0, "r");
    while(!stdin__e4548bf98d29a720f4cb(0, "o","1")) {
        stdout__e4548bf98d29a720f4cb(0, "f");
    }
    while(!stdin__e4548bf98d29a720f4cb(0, "o","1")) {
        stdout__e4548bf98d29a720f4cb(0, "f");
    }
}


static void _4d8ab8e9334943f937ec()
{
    stdout__e4548bf98d29a720f4cb(1, "r");
    while(!stdin__e4548bf98d29a720f4cb(1, "o","1")) {
        stdout__e4548bf98d29a720f4cb(1, "f");
    }
    while(!stdin__e4548bf98d29a720f4cb(1, "o","1")) {
        stdout__e4548bf98d29a720f4cb(1, "f");
    }
}
}
