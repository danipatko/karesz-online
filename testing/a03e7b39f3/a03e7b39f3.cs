using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

class Program
{
    struct Command__1ffa70c8963a4750f046
    {
        public string Str__1ffa70c8963a4750f046 { get; set; }
        public bool Input__1ffa70c8963a4750f046 { get; set; }
        public Command__1ffa70c8963a4750f046(string s, bool io)
        {
            Str__1ffa70c8963a4750f046 = s;
            Input__1ffa70c8963a4750f046 = io;
        }
    }
    static Dictionary<int, Command__1ffa70c8963a4750f046> Commands__1ffa70c8963a4750f046 = new Dictionary<int, Command__1ffa70c8963a4750f046>();
    static Dictionary<int, string> Results__1ffa70c8963a4750f046 = new Dictionary<int, string>();
    static Barrier Bar__1ffa70c8963a4750f046 = new Barrier(2, (b) =>
    {
        Results__1ffa70c8963a4750f046.Clear();
        foreach(int key in Commands__1ffa70c8963a4750f046.Keys)
        {
            Console.WriteLine($"0425d695d4 {key} {(Commands__1ffa70c8963a4750f046[key].Input__1ffa70c8963a4750f046 ? '>' : '<')} {Commands__1ffa70c8963a4750f046[key].Str__1ffa70c8963a4750f046}");
            if (Commands__1ffa70c8963a4750f046[key].Input__1ffa70c8963a4750f046) Results__1ffa70c8963a4750f046[key] = Console.ReadLine();
        }
        Commands__1ffa70c8963a4750f046.Clear();
    });

    static bool stdin__1ffa70c8963a4750f046(int i, string c, string m)
    {
        Commands__1ffa70c8963a4750f046[i] = new Command__1ffa70c8963a4750f046(c, true);
        Bar__1ffa70c8963a4750f046.SignalAndWait();
        return Results__1ffa70c8963a4750f046[i] == m;
    }

    static int stdin__1ffa70c8963a4750f046(int i, string c)
    {
        Commands__1ffa70c8963a4750f046[i] = new Command__1ffa70c8963a4750f046(c, true);
        Bar__1ffa70c8963a4750f046.SignalAndWait();
        return int.Parse(Results__1ffa70c8963a4750f046[i]);
    }

    static void stdout__1ffa70c8963a4750f046(int i, string c)
    {
        Commands__1ffa70c8963a4750f046[i] = new Command__1ffa70c8963a4750f046(c, false);
        Bar__1ffa70c8963a4750f046.SignalAndWait();
    }
    static void Kill__1ffa70c8963a4750f046() {
        Thread.Sleep(2000);
        Environment.Exit(0);
    }
    static void Main()
    {
        new Thread(Kill__1ffa70c8963a4750f046).Start();
        Parallel.Invoke(_391656633cb6ce412a36,_4bffd921994ab5b6d94c);
        Bar__1ffa70c8963a4750f046.Dispose();
    }

    /* USER CODE */

    
static void _391656633cb6ce412a36()
{
    stdout__1ffa70c8963a4750f046(0, "r");
    while(!stdin__1ffa70c8963a4750f046(0, "o","1")) {
        stdout__1ffa70c8963a4750f046(0, "f");
    }
    while(!stdin__1ffa70c8963a4750f046(0, "o","1")) {
        stdout__1ffa70c8963a4750f046(0, "f");
    }
}


static void _4bffd921994ab5b6d94c()
{
    stdout__1ffa70c8963a4750f046(1, "r");
    while(!stdin__1ffa70c8963a4750f046(1, "o","1")) {
        stdout__1ffa70c8963a4750f046(1, "f");
    }
    while(!stdin__1ffa70c8963a4750f046(1, "o","1")) {
        stdout__1ffa70c8963a4750f046(1, "f");
    }
}
}
