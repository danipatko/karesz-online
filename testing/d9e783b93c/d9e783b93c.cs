using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

class Program
{
    struct Command__32789799af8efd43fb2c
    {
        public string Str__32789799af8efd43fb2c { get; set; }
        public bool Input__32789799af8efd43fb2c { get; set; }
        public Command__32789799af8efd43fb2c(string s, bool io)
        {
            Str__32789799af8efd43fb2c = s;
            Input__32789799af8efd43fb2c = io;
        }
    }
    static Dictionary<int, Command__32789799af8efd43fb2c> Commands__32789799af8efd43fb2c = new Dictionary<int, Command__32789799af8efd43fb2c>();
    static Dictionary<int, string> Results__32789799af8efd43fb2c = new Dictionary<int, string>();
    static Barrier Bar__32789799af8efd43fb2c = new Barrier(2, (b) =>
    {
        Results__32789799af8efd43fb2c.Clear();
        foreach(int key in Commands__32789799af8efd43fb2c.Keys)
        {
            Console.WriteLine($"72050490e3 key {(Commands__32789799af8efd43fb2c[key].Input__32789799af8efd43fb2c ? '>' : '<')} {Commands__32789799af8efd43fb2c[key].Str__32789799af8efd43fb2c}");
            if (Commands__32789799af8efd43fb2c[key].Input__32789799af8efd43fb2c) Results__32789799af8efd43fb2c[key] = Console.ReadLine();
        }
        Commands__32789799af8efd43fb2c.Clear();
    });

    static bool stdin__32789799af8efd43fb2c(int i, string c, string m)
    {
        Commands__32789799af8efd43fb2c[i] = new Command__32789799af8efd43fb2c(c, true);
        Bar__32789799af8efd43fb2c.SignalAndWait();
        return Results__32789799af8efd43fb2c[i] == m;
    }

    static int stdin__32789799af8efd43fb2c(int i, string c)
    {
        Commands__32789799af8efd43fb2c[i] = new Command__32789799af8efd43fb2c(c, true);
        Bar__32789799af8efd43fb2c.SignalAndWait();
        return int.Parse(Results__32789799af8efd43fb2c[i]);
    }

    static void stdout__32789799af8efd43fb2c(int i, string c)
    {
        Commands__32789799af8efd43fb2c[i] = new Command__32789799af8efd43fb2c(c, false);
        Bar__32789799af8efd43fb2c.SignalAndWait();
    }

    static void Main()
    {
        Parallel.Invoke(_4d2a40e559a2e5cac70b,_5e652c6c7b4a7bb3442c);
        Bar__32789799af8efd43fb2c.Dispose();
    }

    /* USER CODE */

    
static void _4d2a40e559a2e5cac70b()
{
    stdout__32789799af8efd43fb2c(0, "r");
    while(!stdin__32789799af8efd43fb2c(0, "o","1")) {
        stdout__32789799af8efd43fb2c(0, "f");
    }
    while(!stdin__32789799af8efd43fb2c(0, "o","1")) {
        stdout__32789799af8efd43fb2c(0, "f");
    }
}


static void _5e652c6c7b4a7bb3442c()
{
    stdout__32789799af8efd43fb2c(1, "r");
    while(!stdin__32789799af8efd43fb2c(1, "o","1")) {
        stdout__32789799af8efd43fb2c(1, "f");
    }
    while(!stdin__32789799af8efd43fb2c(1, "o","1")) {
        stdout__32789799af8efd43fb2c(1, "f");
    }
}
}
