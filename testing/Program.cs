
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Karesz
{
    public class Program
    {
		public static bool stdin(string command,string match){Console.WriteLine($"in:{command}");string value=Console.ReadLine();return value==match;}
		public static int stdin(string command){Console.WriteLine($"in:{command}");string value=Console.ReadLine();return int.Parse(value);}
		public static void stdout(string command){Console.WriteLine($"out:{command}");}

		static void Fordulj_meg()
        {
             stdout("turn -1");
             stdout("turn -1");
        }

		static void menj_a_falig()
        {
            while (!stdin("wallahead","true"))
            {
                stdout("step");
            }
        }

		static bool Tudok_e_lépni()
        {
            return (!stdin("wallahead","true") && !stdin("outofbounds","true"));
        }

		static void valami()
        {
            while (!stdin("outofbounds","true"))
            {
                stdout("turn 1");
                while (!Tudok_e_lépni())
                {
                    stdout("turn -1");
                }
                stdout("step");
            }
        }
        
		static void Main(string[] args)
        {
            menj_a_falig();
             stdout("turn 1");
            menj_a_falig();
            Fordulj_meg();
            valami();
        }
    }
}
