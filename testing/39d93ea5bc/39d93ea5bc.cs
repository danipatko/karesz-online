using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

class Program
{
    struct Command__fc8c65943588956d27db
    {
        public string Str__fc8c65943588956d27db { get; set; }
        public bool Input__fc8c65943588956d27db { get; set; }
        public Command__fc8c65943588956d27db(string s, bool io)
        {
            Str__fc8c65943588956d27db = s;
            Input__fc8c65943588956d27db = io;
        }
    }
    static Dictionary<int, Command__fc8c65943588956d27db> Commands__fc8c65943588956d27db = new Dictionary<int, Command__fc8c65943588956d27db>();
    static Dictionary<int, string> Results__fc8c65943588956d27db = new Dictionary<int, string>();
    static Barrier Bar__fc8c65943588956d27db = new Barrier(2, (b) =>
    {
        Results__fc8c65943588956d27db.Clear();
        foreach(int key in Commands__fc8c65943588956d27db.Keys)
        {
            Console.WriteLine($"7a0a7b7995 {key} {(Commands__fc8c65943588956d27db[key].Input__fc8c65943588956d27db ? '>' : '<')} {Commands__fc8c65943588956d27db[key].Str__fc8c65943588956d27db}");
            if (Commands__fc8c65943588956d27db[key].Input__fc8c65943588956d27db) Results__fc8c65943588956d27db[key] = Console.ReadLine();
        }
        Commands__fc8c65943588956d27db.Clear();
    });

    static bool stdin__fc8c65943588956d27db(int i, string c, string m)
    {
        Commands__fc8c65943588956d27db[i] = new Command__fc8c65943588956d27db(c, true);
        Bar__fc8c65943588956d27db.SignalAndWait();
        return Results__fc8c65943588956d27db[i] == m;
    }

    static int stdin__fc8c65943588956d27db(int i, string c)
    {
        Commands__fc8c65943588956d27db[i] = new Command__fc8c65943588956d27db(c, true);
        Bar__fc8c65943588956d27db.SignalAndWait();
        return int.Parse(Results__fc8c65943588956d27db[i]);
    }

    static void stdout__fc8c65943588956d27db(int i, string c)
    {
        Commands__fc8c65943588956d27db[i] = new Command__fc8c65943588956d27db(c, false);
        Bar__fc8c65943588956d27db.SignalAndWait();
    }
    static void Kill__fc8c65943588956d27db() {
        Thread.Sleep(2000);
        Environment.Exit(0);
    }
    static void Main()
    {
        new Thread(Kill__fc8c65943588956d27db).Start();
        Parallel.Invoke(_23756335532625cd4d93,_7a33aaa1a0a797e3287e);
        Bar__fc8c65943588956d27db.Dispose();
    }

    /* USER CODE */

    
static void _23756335532625cd4d93()
{
    stdout__fc8c65943588956d27db(0, "r");
    while(!stdin__fc8c65943588956d27db(0, "o","1")) {
        stdout__fc8c65943588956d27db(0, "f");
    }
    while(!stdin__fc8c65943588956d27db(0, "o","1")) {
        stdout__fc8c65943588956d27db(0, "f");
    }
}


static void _7a33aaa1a0a797e3287e()
{
    stdout__fc8c65943588956d27db(1, "r");
    while(!stdin__fc8c65943588956d27db(1, "o","1")) {
        stdout__fc8c65943588956d27db(1, "f");
    }
    while(!stdin__fc8c65943588956d27db(1, "o","1")) {
        stdout__fc8c65943588956d27db(1, "f");
    }
}
}
