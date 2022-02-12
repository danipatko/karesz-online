using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

class Program
{
    struct Command__8dbd24d2adc27cbbb004
    {
        public string Str__8dbd24d2adc27cbbb004 { get; set; }
        public bool Input__8dbd24d2adc27cbbb004 { get; set; }
        public Command__8dbd24d2adc27cbbb004(string s, bool io)
        {
            Str__8dbd24d2adc27cbbb004 = s;
            Input__8dbd24d2adc27cbbb004 = io;
        }
    }
    static Dictionary<int, Command__8dbd24d2adc27cbbb004> Commands__8dbd24d2adc27cbbb004 = new Dictionary<int, Command__8dbd24d2adc27cbbb004>();
    static Dictionary<int, string> Results__8dbd24d2adc27cbbb004 = new Dictionary<int, string>();
    static Barrier Bar__8dbd24d2adc27cbbb004 = new Barrier(2, (b) =>
    {
        Results__8dbd24d2adc27cbbb004.Clear();
        foreach(int key in Commands__8dbd24d2adc27cbbb004.Keys)
        {
            Console.WriteLine($"b980265f69 key {(Commands__8dbd24d2adc27cbbb004[key].Input__8dbd24d2adc27cbbb004 ? '>' : '<')} {Commands__8dbd24d2adc27cbbb004[key].Str__8dbd24d2adc27cbbb004}");
            if (Commands__8dbd24d2adc27cbbb004[key].Input__8dbd24d2adc27cbbb004) Results__8dbd24d2adc27cbbb004[key] = Console.ReadLine();
        }
        Commands__8dbd24d2adc27cbbb004.Clear();
    });

    static bool stdin__8dbd24d2adc27cbbb004(int i, string c, string m)
    {
        Commands__8dbd24d2adc27cbbb004[i] = new Command__8dbd24d2adc27cbbb004(c, true);
        Bar__8dbd24d2adc27cbbb004.SignalAndWait();
        return Results__8dbd24d2adc27cbbb004[i] == m;
    }

    static int stdin__8dbd24d2adc27cbbb004(int i, string c)
    {
        Commands__8dbd24d2adc27cbbb004[i] = new Command__8dbd24d2adc27cbbb004(c, true);
        Bar__8dbd24d2adc27cbbb004.SignalAndWait();
        return int.Parse(Results__8dbd24d2adc27cbbb004[i]);
    }

    static void stdout__8dbd24d2adc27cbbb004(int i, string c)
    {
        Commands__8dbd24d2adc27cbbb004[i] = new Command__8dbd24d2adc27cbbb004(c, false);
        Bar__8dbd24d2adc27cbbb004.SignalAndWait();
    }

    static void Main()
    {
        Parallel.Invoke(_4ff8866e92b0c9804661,_07b9a8dc75eccea77a07);
        Bar__8dbd24d2adc27cbbb004.Dispose();
    }

    /* USER CODE */

    
static void _4ff8866e92b0c9804661()
{
    stdout__8dbd24d2adc27cbbb004(0, "r");
    while(!stdin__8dbd24d2adc27cbbb004(0, "o","1")) {
        stdout__8dbd24d2adc27cbbb004(0, "f");
    }
    while(!stdin__8dbd24d2adc27cbbb004(0, "o","1")) {
        stdout__8dbd24d2adc27cbbb004(0, "f");
    }
}


static void _07b9a8dc75eccea77a07()
{
    stdout__8dbd24d2adc27cbbb004(1, "r");
    while(!stdin__8dbd24d2adc27cbbb004(1, "o","1")) {
        stdout__8dbd24d2adc27cbbb004(1, "f");
    }
    while(!stdin__8dbd24d2adc27cbbb004(1, "o","1")) {
        stdout__8dbd24d2adc27cbbb004(1, "f");
    }
}
}
