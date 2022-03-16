namespace Karesz
{
    class Program
    {
        static bool stdin_asdf(string c,string m){Console.WriteLine($"> 1 {c}");string l=Console.ReadLine();return l==m;}
        static int stdin_asdf(string c){Console.WriteLine($"> 1 {c}");string l=Console.ReadLine();return int.Parse(l);}
        static void stdout_asdf(string c){Console.WriteLine($"< 1 {c}");}

        static void Main(string[] args)
        {
            stdout_asdf(1, "3 1");
            while(!stdin_asdf(1, "e")) {
                stdout_asdf(1, "0");
            }
            while(!stdin_asdf(1, "e")) {
                stdout_asdf(1, "0");
            }
        }
    }
}