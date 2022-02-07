using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

class Program
{
    struct Command__e0232c069185e21edf76
    {
        public string Str__e0232c069185e21edf76 { get; set; }
        public bool Input__e0232c069185e21edf76 { get; set; }
        public Command__e0232c069185e21edf76(string s, bool io)
        {
            Str__e0232c069185e21edf76 = s;
            Input__e0232c069185e21edf76 = io;
        }
    }
    static Dictionary<int, Command__e0232c069185e21edf76> Commands__e0232c069185e21edf76 = new Dictionary<int, Command__e0232c069185e21edf76>();
    static Dictionary<int, string> Results__e0232c069185e21edf76 = new Dictionary<int, string>();
    static Barrier Bar__e0232c069185e21edf76 = new Barrier(2, (b) =>
    {
        Results__e0232c069185e21edf76.Clear();
        foreach(int key in Commands__e0232c069185e21edf76.Keys)
        {
            Console.WriteLine($"287b467abb {key} {(Commands__e0232c069185e21edf76[key].Input__e0232c069185e21edf76 ? '>' : '<')} {Commands__e0232c069185e21edf76[key].Str__e0232c069185e21edf76}");
            if (Commands__e0232c069185e21edf76[key].Input__e0232c069185e21edf76) Results__e0232c069185e21edf76[key] = Console.ReadLine();
        }
        Commands__e0232c069185e21edf76.Clear();
    });

    static bool stdin__e0232c069185e21edf76(int i, string c, string m)
    {
        Commands__e0232c069185e21edf76[i] = new Command__e0232c069185e21edf76(c, true);
        Bar__e0232c069185e21edf76.SignalAndWait();
        return Results__e0232c069185e21edf76[i] == m;
    }

    static int stdin__e0232c069185e21edf76(int i, string c)
    {
        Commands__e0232c069185e21edf76[i] = new Command__e0232c069185e21edf76(c, true);
        Bar__e0232c069185e21edf76.SignalAndWait();
        return int.Parse(Results__e0232c069185e21edf76[i]);
    }

    static void stdout__e0232c069185e21edf76(int i, string c)
    {
        Commands__e0232c069185e21edf76[i] = new Command__e0232c069185e21edf76(c, false);
        Bar__e0232c069185e21edf76.SignalAndWait();
    }

    static void Main()
    {
        Parallel.Invoke(_0e434878d018dd98bb98,_c4bf3c2669efb3f46412);
        Bar__e0232c069185e21edf76.Dispose();
    }

    /* USER CODE */

    
static void _0e434878d018dd98bb98()
{
    stdout__e0232c069185e21edf76(0, "r");
    while(!stdin__e0232c069185e21edf76(0, "o","1")) {
        stdout__e0232c069185e21edf76(0, "f");
    }
    while(!stdin__e0232c069185e21edf76(0, "o","1")) {
        stdout__e0232c069185e21edf76(0, "f");
    }
}


static void _c4bf3c2669efb3f46412()
{
    stdout__e0232c069185e21edf76(1, "r");
    while(!stdin__e0232c069185e21edf76(1, "o","1")) {
        stdout__e0232c069185e21edf76(1, "f");
    }
    while(!stdin__e0232c069185e21edf76(1, "o","1")) {
        stdout__e0232c069185e21edf76(1, "f");
    }
}
}
