using System;
using System.Text;

namespace Karesz
{
    public class Program
    {
        public static bool stdin(string command, string match){Console.WriteLine($"in:{command}");string value = Console.ReadLine();return value == match;}
        public static void stdout(string command) {Console.WriteLine($"out:{command}");}

        public static void Main(string[] args)
        {
            Console.WriteLine("in:");
            string r = Console.ReadLine();
            Console.WriteLine("Got: " + r);

            Console.WriteLine("in:");
            r = Console.ReadLine();
            Console.WriteLine("Got: " + r);

            Console.WriteLine("in:");
            r = Console.ReadLine();
            Console.WriteLine("Got: " + r);

            Console.WriteLine("in:");
            r = Console.ReadLine();
            Console.WriteLine("Got: " + r);
        }
    }
}