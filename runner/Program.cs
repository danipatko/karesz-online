using System;

namespace Karesz
{
    class Program
    {
        static bool stdin_random_key(string c,string m){Console.WriteLine($"random_key 0 {c}");string l=Console.ReadLine();return l==m;}
        static int stdin_random_key(string c){Console.WriteLine($"random_key 0 {c}");string l=Console.ReadLine();return int.Parse(l);}
        static void stdout_random_key(string c){Console.WriteLine($"random_key 0 {c}");}
        
        static void Main(string[] args)
        {
            /* stdout_random_key("3 1");
            xd
            while(!stdin_random_key("a","1")) {
                stdout_random_key("0");
            }*/ 
            while(!stdin_random_key("a","1")) {
                stdout_random_key("0");
            }
            stdout_random_key("0");
        }
    }
}