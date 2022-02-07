using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

class Program
{
    struct Command__e9a37e8527bfbbb99655
    {
        public string Str__e9a37e8527bfbbb99655 { get; set; }
        public bool Input__e9a37e8527bfbbb99655 { get; set; }
        public Command__e9a37e8527bfbbb99655(string s, bool io)
        {
            Str__e9a37e8527bfbbb99655 = s;
            Input__e9a37e8527bfbbb99655 = io;
        }
    }
    static Dictionary<int, Command__e9a37e8527bfbbb99655> Commands__e9a37e8527bfbbb99655 = new Dictionary<int, Command__e9a37e8527bfbbb99655>();
    static Dictionary<int, string> Results__e9a37e8527bfbbb99655 = new Dictionary<int, string>();
    static Barrier Bar__e9a37e8527bfbbb99655 = new Barrier(2, (b) =>
    {
        Results__e9a37e8527bfbbb99655.Clear();
        foreach(int key in Commands__e9a37e8527bfbbb99655.Keys)
        {
            Console.WriteLine($"7564d1958a {(Commands__e9a37e8527bfbbb99655[key].Input__e9a37e8527bfbbb99655 ? '>' : '<')} {Commands__e9a37e8527bfbbb99655[key].Str__e9a37e8527bfbbb99655}");
            if (Commands__e9a37e8527bfbbb99655[key].Input__e9a37e8527bfbbb99655) Results__e9a37e8527bfbbb99655[key] = Console.ReadLine();
        }
        Commands__e9a37e8527bfbbb99655.Clear();
    });

    static bool stdin__e9a37e8527bfbbb99655(int i, string c, string m)
    {
        Commands__e9a37e8527bfbbb99655[i] = new Command__e9a37e8527bfbbb99655(c, true);
        Bar__e9a37e8527bfbbb99655.SignalAndWait();
        return Results__e9a37e8527bfbbb99655[i] == m;
    }

    static int stdin__e9a37e8527bfbbb99655(int i, string c)
    {
        Commands__e9a37e8527bfbbb99655[i] = new Command__e9a37e8527bfbbb99655(c, true);
        Bar__e9a37e8527bfbbb99655.SignalAndWait();
        return int.Parse(Results__e9a37e8527bfbbb99655[i]);
    }

    static void stdout__e9a37e8527bfbbb99655(int i, string c)
    {
        Commands__e9a37e8527bfbbb99655[i] = new Command__e9a37e8527bfbbb99655(c, false);
        Bar__e9a37e8527bfbbb99655.SignalAndWait();
    }

    static void Main()
    {
        Parallel.Invoke(_81a7628aa48241e17bcf,_d7e342235b7073208403);
        Bar__e9a37e8527bfbbb99655.Dispose();
    }

    /* USER CODE */

    
static void _81a7628aa48241e17bcf()
{
    stdout__e9a37e8527bfbbb99655(0, "r");
    while(!stdin__e9a37e8527bfbbb99655(0, "o","1")) {
        stdout__e9a37e8527bfbbb99655(0, "f");
    }
    while(!stdin__e9a37e8527bfbbb99655(0, "o","1")) {
        stdout__e9a37e8527bfbbb99655(0, "f");
    }
}


static void _d7e342235b7073208403()
{
    stdout__e9a37e8527bfbbb99655(1, "r");
    while(!stdin__e9a37e8527bfbbb99655(1, "o","1")) {
        stdout__e9a37e8527bfbbb99655(1, "f");
    }
    while(!stdin__e9a37e8527bfbbb99655(1, "o","1")) {
        stdout__e9a37e8527bfbbb99655(1, "f");
    }
}
}
