using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

class Program
{
    struct Command__b31784a52a3568796728
    {
        public string Str__b31784a52a3568796728 { get; set; }
        public bool Input__b31784a52a3568796728 { get; set; }
        public Command__b31784a52a3568796728(string s, bool io)
        {
            Str__b31784a52a3568796728 = s;
            Input__b31784a52a3568796728 = io;
        }
    }
    static Dictionary<int, Command__b31784a52a3568796728> Commands__b31784a52a3568796728 = new Dictionary<int, Command__b31784a52a3568796728>();
    static Dictionary<int, string> Results__b31784a52a3568796728 = new Dictionary<int, string>();
    static Barrier Bar__b31784a52a3568796728 = new Barrier(2, (b) =>
    {
        Results__b31784a52a3568796728.Clear();
        foreach(int key in Commands__b31784a52a3568796728.Keys)
        {
            Console.WriteLine($"b3fb083079 {key} {(Commands__b31784a52a3568796728[key].Input__b31784a52a3568796728 ? '>' : '<')} {Commands__b31784a52a3568796728[key].Str__b31784a52a3568796728}");
            if (Commands__b31784a52a3568796728[key].Input__b31784a52a3568796728) Results__b31784a52a3568796728[key] = Console.ReadLine();
        }
        Commands__b31784a52a3568796728.Clear();
    });

    static bool stdin__b31784a52a3568796728(int i, string c, string m)
    {
        Commands__b31784a52a3568796728[i] = new Command__b31784a52a3568796728(c, true);
        Bar__b31784a52a3568796728.SignalAndWait();
        return Results__b31784a52a3568796728[i] == m;
    }

    static int stdin__b31784a52a3568796728(int i, string c)
    {
        Commands__b31784a52a3568796728[i] = new Command__b31784a52a3568796728(c, true);
        Bar__b31784a52a3568796728.SignalAndWait();
        return int.Parse(Results__b31784a52a3568796728[i]);
    }

    static void stdout__b31784a52a3568796728(int i, string c)
    {
        Commands__b31784a52a3568796728[i] = new Command__b31784a52a3568796728(c, false);
        Bar__b31784a52a3568796728.SignalAndWait();
    }
    static void Kill__b31784a52a3568796728() {
        Thread.Sleep(2000);
        Environment.Exit(0);
    }
    static void Main()
    {
        new Thread(Kill__b31784a52a3568796728).Start();
        Parallel.Invoke(_8b9d7fa32fa0e9c8a825,_4acd5c6cdbfda9fdd68b);
        Bar__b31784a52a3568796728.Dispose();
    }

    /* USER CODE */

    
static void _8b9d7fa32fa0e9c8a825()
{
    stdout__b31784a52a3568796728(0, "r");
    while(!stdin__b31784a52a3568796728(0, "o","1")) {
        stdout__b31784a52a3568796728(0, "f");
    }
    while(!stdin__b31784a52a3568796728(0, "o","1")) {
        stdout__b31784a52a3568796728(0, "f");
    }
}


static void _4acd5c6cdbfda9fdd68b()
{
    stdout__b31784a52a3568796728(1, "r");
    while(!stdin__b31784a52a3568796728(1, "o","1")) {
        stdout__b31784a52a3568796728(1, "f");
    }
    while(!stdin__b31784a52a3568796728(1, "o","1")) {
        stdout__b31784a52a3568796728(1, "f");
    }
}
}
