use regex::Regex;

enum Std {
    Out,
    None,
    In
}

struct Rule {
    replace: &'static str,
    with: &'static str,
    std: Std 
}

/* 
FIELD VALUES
0: empty
1: wall
2: black rock
3: red
4: green
5: yellow
*/

const RULES: [Rule; 21] = [ 
    // replace with field values    
    Rule { std: Std::None, replace: r"fekete", with: "2", },
    Rule { std: Std::None, replace: r"piros", with: "3", },
    Rule { std: Std::None, replace: r"zöld", with: "4", },
    Rule { std: Std::None, replace: r"sárga", with: "5", },
    // replace with turn values
    Rule { std: Std::None, replace: r"jobbra", with: "1", },
    Rule { std: Std::None, replace: r"balra", with: "-1", },
    // other
    Rule { std: Std::Out, replace: r"Lépj\s*\(\s*\)", with:"0" },
    Rule { std: Std::Out, replace: r"Fordulj_balra\s*\(\s*\)", with: "1" },
    Rule { std: Std::Out, replace: r"Fordulj_jobbra\s*\(\s*\)", with: "2" },
    Rule { std: Std::Out, replace: r"Fordulj\s*\((?P<first>.*)\)", with: "3 ${first}" },
    Rule { std: Std::Out, replace: r"Vegyél_fel_egy_kavicsot\s*\(\s*\)", with: "4" },
    Rule { std: Std::Out, replace: r"Tegyél_le_egy_kavicsot\s*\((?P<first>.*)\)", with: "5 ${first}" },
    Rule { std: Std::Out, replace: r"Északra_néz\s*\(\s*\)", with: "6" },
    Rule { std: Std::In, replace: r"Délre_néz\s*\(\s*\)", with: "7" },
    Rule { std: Std::In, replace: r"Keletre_néz\s*\(\s*\)", with: "8" },
    Rule { std: Std::In, replace: r"Nyugatra_néz\s*\(\s*\)", with: "9" },
    Rule { std: Std::In, replace: r"Merre_néz\s*\(\s*\)", with: "a" },
    Rule { std: Std::In, replace: r"Van_e_itt_kavics\s*\(\s*\)", with: "b" },
    Rule { std: Std::In, replace: r"Mi_van_alattam\s*\(\s*\)", with: "c" },
    Rule { std: Std::In, replace: r"Van_e_előttem_fal\s*\(\s*\)", with: "d" },
    Rule { std: Std::In, replace: r"Kilépek_e_a_pályáról\s*\(\s*\)", with: "e" },
];

pub fn replace_all(mut input: String, id: u8, random: &String) -> String {
    let mut re:regex::Regex;
    for elem in RULES {
        println!("Replacing: {:?}", elem.replace);
        re = regex::Regex::new(elem.replace).unwrap();    
        match elem.std {
            Std::In => {
                input = String::from(re.replace_all(&input, format!("stdin_{}({}, \"{}\")", random, id, elem.with)));
            }
            Std::Out => {
                input = String::from(re.replace_all(&input, format!("stdout_{}({}, \"{}\")", random, id, elem.with)));
            }
            Std::None => {
                input = String::from(re.replace_all(&input, elem.with));
            }
        }
    }
    input
}

// create template
pub fn create_single_player_template(mut code:String, rand:String, id:u8) -> String {
    code = replace_all(code, id, &rand);
    format!(
        "namespace Karesz
        {{
            class Program
            {{
                static bool stdin_{rand}(string c,string m){{Console.WriteLine($\"> {key} {{c}}\");string l=Console.ReadLine();return l==m;}}
                static int stdin_{rand}(string c){{Console.WriteLine($\"> {key} {{c}}\");string l=Console.ReadLine();return int.Parse(l);}}
                static void stdout_{rand}(string c){{Console.WriteLine($\"< {key} {{c}}\");}}
                
                {code}
            }}
        }}", rand=rand, key=id, code=code)
}

pub struct MPCode {
    pub code: String,
    pub caller: String,
}

// create template
pub fn create_multi_player_template(codes: &mut Vec<MPCode>, rand:String, id:u8) -> String {
    for elem in codes.into_iter() {
        elem.code = replace_all(elem.code.to_string(), id, &rand);
    }
    
    format!(
"using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

class Program
{{
    struct Command_{rand}
    {{
        public string Str_{rand} {{ get; set; }}
        public bool Input_{rand} {{ get; set; }}
        public Command_{rand}(string s, bool io)
        {{
            Str_{rand} = s;
            Input_{rand} = io;
        }}
    }}
    static Dictionary<int, Command_{rand}> Commands_{rand} = new Dictionary<int, Command_{rand}>();
    static Dictionary<int, string> Results_{rand} = new Dictionary<int, string>();
    static Barrier Bar_{rand} = new Barrier({length}, (b) =>
    {{
        Results_{rand}.Clear();
        foreach(int key in Commands_{rand}.Keys)
        {{
            Console.WriteLine($\"{key} {{(Commands_{rand}[key].Input_{rand} ? '>' : '<')}} {{Commands_{rand}[key].Str_{rand}}}\");
            if (Commands_{rand}[key].Input_{rand}) Results_{rand}[key] = Console.ReadLine();
        }}
        Console.WriteLine(\"{round_key}\");
        Commands_{rand}.Clear();
    }});

    static bool stdin_{rand}(int i, string c, string m)
    {{
        Commands_{rand}[i] = new Command_{rand}(c, true);
        Bar_{rand}.SignalAndWait();
        return Results_{rand}[i] == m;
    }}

    static int stdin_{rand}(int i, string c)
    {{
        Commands_{rand}[i] = new Command_{rand}(c, true);
        Bar_{rand}.SignalAndWait();
        return int.Parse(Results_{rand}[i]);
    }}

    static void stdout_{rand}(int i, string c)
    {{
        Commands_{rand}[i] = new Command_{rand}(c, false);
        Bar_{rand}.SignalAndWait();
    }}
    static void Kill_{rand}() 
    {{
        Thread.Sleep(2000);
        Environment.Exit(0);
    }}
    static void Main()
    {{
        new Thread(Kill_{rand}).Start();
        Parallel.Invoke({thread_names});
        Bar_{rand}.Dispose();
    }}

    /* USER CODE */

    {codes}
}}", rand=rand, 
    length=codes.len(), 
    thread_names=codes.iter().map(|p| p.caller.clone()).collect::<Vec<String>>().join("\n"), 
    round_key="", 
    key="", 
    codes=codes.iter().map(|p| p.code.clone()).collect::<Vec<String>>().join("\n")
    )
}