
using System;
using System.Collections.Generic;



using System.Linq;
using System.Text;


using System.Threading;

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

		static void Main(string[] args)
        {
             stdout("turn 1");
            while(Tudok_e_lépni()) {
                stdout("step");
            }
            Fordulj_meg();
            while(Tudok_e_lépni()) {
                stdout("step");
            }
        }
    }
}
