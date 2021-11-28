using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.IO;
using System.Threading;

namespace Karesz
{
    public partial class Form1 : Form
    {
public static bool stdin(string command,string match){Console.WriteLine($"in:{command}");string value=Console.ReadLine();return value==match;}
public static int stdin(string command){Console.WriteLine($"in:{command}");string value=Console.ReadLine();return int.Parse(value);}
public static void stdout(string command){Console.WriteLine($"out:{command}");}

        bool Tudok_e_menni()
        {
            return !stdin("wallahead","true") && !stdin("outofbounds","true");
        }
        void MenyjAmígTudsz_ésKavics()
        {
            while(Tudok_e_menni())
            {
                stdout("step");
                if(stdin("isrock","true"))
                {
                    stdout("pickup");
                    kavicsok++;
                }
            }
        }
        void goRightUp()
        {
            MenyjAmígTudsz_ésKavics();
            stdout("turn -1");
            MenyjAmígTudsz_ésKavics();
            Fordulj(2);
        }
        int kavicsok = 0;
        void FELADAT()
        {

            bool fut = true;
            int irány = 1;
            goRightUp();
            while (fut)
            {
                MenyjAmígTudsz_ésKavics();
                Fordulj(irány);
                if(!Tudok_e_menni())
                {
                    fut = false;
                }
                else
                {
                    stdout("step");
                    if (stdin("isrock","true"))
                    {
                        stdout("pickup");
                        kavicsok++;
                    }
                    Fordulj(irány);
                }

                if(irány == 1)
                {
                    irány = -1;
                }
                else
                {
                    irány = 1;
                }
            }
            MessageBox.Show(Convert.ToString(kavicsok) + " kavicsot tudtam felszedni");
        }
    }
}