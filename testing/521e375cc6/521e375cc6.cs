using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

class Program
{
    struct Command__ea8c544c3c3d0a2d2809
    {
        public string Str__ea8c544c3c3d0a2d2809 { get; set; }
        public bool Input__ea8c544c3c3d0a2d2809 { get; set; }
        public Command__ea8c544c3c3d0a2d2809(string s, bool io)
        {
            Str__ea8c544c3c3d0a2d2809 = s;
            Input__ea8c544c3c3d0a2d2809 = io;
        }
    }
    static Dictionary<int, Command__ea8c544c3c3d0a2d2809> Commands__ea8c544c3c3d0a2d2809 = new Dictionary<int, Command__ea8c544c3c3d0a2d2809>();
    static Dictionary<int, string> Results__ea8c544c3c3d0a2d2809 = new Dictionary<int, string>();
    static Barrier Bar__ea8c544c3c3d0a2d2809 = new Barrier(2, (b) =>
    {
        Results__ea8c544c3c3d0a2d2809.Clear();
        foreach(int key in Commands__ea8c544c3c3d0a2d2809.Keys)
        {
            Console.WriteLine($"3a53a86cf4 {(Commands__ea8c544c3c3d0a2d2809[key].Input__ea8c544c3c3d0a2d2809 ? '>' : '<')} {Commands__ea8c544c3c3d0a2d2809[key].Str__ea8c544c3c3d0a2d2809}");
            if (Commands__ea8c544c3c3d0a2d2809[key].Input__ea8c544c3c3d0a2d2809) Results__ea8c544c3c3d0a2d2809[key] = Console.ReadLine();
        }
        Commands__ea8c544c3c3d0a2d2809.Clear();
    });

    static bool stdin__ea8c544c3c3d0a2d2809(int i, string c, string m)
    {
        Commands__ea8c544c3c3d0a2d2809[i] = new Command__ea8c544c3c3d0a2d2809(c, true);
        Bar__ea8c544c3c3d0a2d2809.SignalAndWait();
        return Results__ea8c544c3c3d0a2d2809[i] == m;
    }

    static int stdin__ea8c544c3c3d0a2d2809(int i, string c)
    {
        Commands__ea8c544c3c3d0a2d2809[i] = new Command__ea8c544c3c3d0a2d2809(c, true);
        Bar__ea8c544c3c3d0a2d2809.SignalAndWait();
        return int.Parse(Results__ea8c544c3c3d0a2d2809[i]);
    }

    static void stdout__ea8c544c3c3d0a2d2809(int i, string c)
    {
        Commands__ea8c544c3c3d0a2d2809[i] = new Command__ea8c544c3c3d0a2d2809(c, false);
        Bar__ea8c544c3c3d0a2d2809.SignalAndWait();
    }

    static void Main()
    {
        Parallel.Invoke(_70dae29ab7819f07642c,_d065fa1e613c516c1f72);
        Bar__ea8c544c3c3d0a2d2809.Dispose();
    }

    /* USER CODE */

    
static void _70dae29ab7819f07642c()
{
    stdout__ea8c544c3c3d0a2d2809(0, "r");
    while(!stdin__ea8c544c3c3d0a2d2809(0, "o","1")) {
        stdout__ea8c544c3c3d0a2d2809(0, "f");
    }
    while(!stdin__ea8c544c3c3d0a2d2809(0, "o","1")) {
        stdout__ea8c544c3c3d0a2d2809(0, "f");
    }
}


static void _d065fa1e613c516c1f72()
{
    stdout__ea8c544c3c3d0a2d2809(1, "r");
    while(!stdin__ea8c544c3c3d0a2d2809(1, "o","1")) {
        stdout__ea8c544c3c3d0a2d2809(1, "f");
    }
    while(!stdin__ea8c544c3c3d0a2d2809(1, "o","1")) {
        stdout__ea8c544c3c3d0a2d2809(1, "f");
    }
}
}
