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
        void Fordulj_meg()
        {
            Fordulj(balra);
            Fordulj(balra);
        }

        void menj_a_falig()
        {
            while (!Van_e_előttem_fal())
            {
                Lépj();
            }        
        }
        bool Tudok_e_lépni()
        {
            return (!Van_e_előttem_fal() && !Kilépek_e_a_pályáról());
        }

        void valami()
        {
            while (!Kilépek_e_a_pályáról())
            {
                Fordulj_jobbra();
                while (!Tudok_e_lépni())
                {
                    Fordulj_balra();
                }
                Lépj();
            }
        }
        
        void FELADAT()
        {
            menj_a_falig();
            Fordulj(jobbra);
            menj_a_falig();
            Fordulj_meg();
            valami();
        }     
    }
}
