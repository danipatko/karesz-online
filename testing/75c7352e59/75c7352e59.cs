using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

class Program
{
    struct Command__dde12c7c82a28ba2e011
    {
        public string Str__dde12c7c82a28ba2e011 { get; set; }
        public bool Input__dde12c7c82a28ba2e011 { get; set; }
        public Command__dde12c7c82a28ba2e011(string s, bool io)
        {
            Str__dde12c7c82a28ba2e011 = s;
            Input__dde12c7c82a28ba2e011 = io;
        }
    }
    static Dictionary<int, Command__dde12c7c82a28ba2e011> Commands__dde12c7c82a28ba2e011 = new Dictionary<int, Command__dde12c7c82a28ba2e011>();
    static Dictionary<int, string> Results__dde12c7c82a28ba2e011 = new Dictionary<int, string>();
    static Barrier Bar__dde12c7c82a28ba2e011 = new Barrier(2, (b) =>
    {
        Results__dde12c7c82a28ba2e011.Clear();
        foreach(int key in Commands__dde12c7c82a28ba2e011.Keys)
        {
            Console.WriteLine($"bcee28266d {key} {(Commands__dde12c7c82a28ba2e011[key].Input__dde12c7c82a28ba2e011 ? '>' : '<')} {Commands__dde12c7c82a28ba2e011[key].Str__dde12c7c82a28ba2e011}");
            if (Commands__dde12c7c82a28ba2e011[key].Input__dde12c7c82a28ba2e011) Results__dde12c7c82a28ba2e011[key] = Console.ReadLine();
        }
        Commands__dde12c7c82a28ba2e011.Clear();
    });

    static bool stdin__dde12c7c82a28ba2e011(int i, string c, string m)
    {
        Commands__dde12c7c82a28ba2e011[i] = new Command__dde12c7c82a28ba2e011(c, true);
        Bar__dde12c7c82a28ba2e011.SignalAndWait();
        return Results__dde12c7c82a28ba2e011[i] == m;
    }

    static int stdin__dde12c7c82a28ba2e011(int i, string c)
    {
        Commands__dde12c7c82a28ba2e011[i] = new Command__dde12c7c82a28ba2e011(c, true);
        Bar__dde12c7c82a28ba2e011.SignalAndWait();
        return int.Parse(Results__dde12c7c82a28ba2e011[i]);
    }

    static void stdout__dde12c7c82a28ba2e011(int i, string c)
    {
        Commands__dde12c7c82a28ba2e011[i] = new Command__dde12c7c82a28ba2e011(c, false);
        Bar__dde12c7c82a28ba2e011.SignalAndWait();
    }
    static void Kill__dde12c7c82a28ba2e011() {
        Thread.Sleep(2000);
        Environment.Exit(0);
    }
    static void Main()
    {
        new Thread(Kill__dde12c7c82a28ba2e011).Start();
        Parallel.Invoke(_e580fc6b191e8701105a,_097e8592fa66ef52ec18);
        Bar__dde12c7c82a28ba2e011.Dispose();
    }

    /* USER CODE */

    
static void _e580fc6b191e8701105a()
{
    stdout__dde12c7c82a28ba2e011(0, "r");
    while(!stdin__dde12c7c82a28ba2e011(0, "o","1")) {
        stdout__dde12c7c82a28ba2e011(0, "f");
    }
    while(!stdin__dde12c7c82a28ba2e011(0, "o","1")) {
        stdout__dde12c7c82a28ba2e011(0, "f");
    }
}


static void _097e8592fa66ef52ec18()
{
    stdout__dde12c7c82a28ba2e011(1, "r");
    while(!stdin__dde12c7c82a28ba2e011(1, "o","1")) {
        stdout__dde12c7c82a28ba2e011(1, "f");
    }
    while(!stdin__dde12c7c82a28ba2e011(1, "o","1")) {
        stdout__dde12c7c82a28ba2e011(1, "f");
    }
}
}
