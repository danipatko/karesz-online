
using System;
using System.Collections.Generic;
using System.Linq;

namespace Karesz
{
    public class Program
    {
public static bool stdin(string command,string match){Console.WriteLine($"in:{command}");string value=Console.ReadLine();return value==match;}
public static int stdin(string command){Console.WriteLine($"in:{command}");string value=Console.ReadLine();return int.Parse(value);}
public static void stdout(string command){Console.WriteLine($"out:{command}");}

        static void Main(string[] args)
        {
            stdout("turn "+1);
            stdout("step");
            stdout("turn 1");
            stdout("step");
            stdout("step");
            stdout("step");
            stdout("place");
        }     
    }
}
