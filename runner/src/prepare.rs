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

const _RULES: [Rule; 21] = [ 
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
    Rule { std: Std::Out, replace: r"Északra_néz\s*\(\s*\)", with: "6\",\"0" },
    Rule { std: Std::In, replace: r"Délre_néz\s*\(\s*\)", with: "6\",\"2" },
    Rule { std: Std::In, replace: r"Keletre_néz\s*\(\s*\)", with: "6\",\"1" },
    Rule { std: Std::In, replace: r"Nyugatra_néz\s*\(\s*\)", with: "6\",\"3" },
    Rule { std: Std::In, replace: r"Merre_néz\s*\(\s*\)", with: "6" },
    Rule { std: Std::In, replace: r"Van_e_itt_kavics\s*\(\s*\)", with: "7\",\"1" },
    Rule { std: Std::In, replace: r"Mi_van_alattam\s*\(\s*\)", with: "8" },
    Rule { std: Std::In, replace: r"Van_e_előttem_fal\s*\(\s*\)", with: "9\",\"1" },
    Rule { std: Std::In, replace: r"Kilépek_e_a_pályáról\s*\(\s*\)", with: "a\",\"1" },
];

fn format_fn(multiplayer:bool, io:&str, random: &str, id: u8, with: &str) -> String {
    if multiplayer {
        format!("std{std}_{random}({id}, \"{with}\")", std=io, random=random, id=id, with=with)
    } else {
        format!("std{std}_{random}(\"{with}\")", std=io, random=random, with=with)
    }
}

pub fn replace_all(mut input: String, id: u8, random: &str, main_fn: String, multiplayer: bool) -> String {
    let mut re:regex::Regex = Regex::new(r"void\s+FELADAT\s*\((.*|\s*)\)").unwrap();
    // replace main function
    input = String::from(re.replace_all(&input, main_fn));
    for elem in _RULES {
        // println!("Replacing: {:?}", elem.replace);
        re = regex::Regex::new(elem.replace).unwrap();    
        match elem.std {
            Std::In => {
                input = String::from(re.replace_all(&input, format_fn(multiplayer, "in", random, id, elem.with)));
            }
            Std::Out => {
                input = String::from(re.replace_all(&input, format_fn(multiplayer, "out", random, id, elem.with)));
            }
            Std::None => {
                input = String::from(re.replace_all(&input, elem.with));
            }
        }
    }
    input
}

// create template
pub fn create_single_player_template(mut code:String, rand:String, key: &str) -> String {
    code = replace_all(code, 0, &rand, String::from("static void Main(string[] args)"), false);
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
}}", rand=rand, key=key, code=code)
}

pub struct MPCode {
    pub code: String,
    pub caller: String,
}

// create template
pub fn create_multi_player_template(codes: &mut Vec<MPCode>, rand:&str, key:&str, round_key:&str) -> String {
    let mut i:u8 = 0;
    for elem in codes.into_iter() {
        elem.code = replace_all(elem.code.to_string(), i, rand, String::from(format!("static void {}()", elem.caller)), true);
        i += 1;
    }
    
    format!(
"using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Concurrent;

class Program
{{
    static ConcurrentDictionary<int, (bool, string)> Commands_{rand} = new ConcurrentDictionary<int, (bool, string)>();
    static ConcurrentDictionary<int, string> Results_{rand} = new ConcurrentDictionary<int, string>();

    static Barrier Bar_{rand} = new Barrier({length}, (b) =>
    {{
        Results_{rand}.Clear();
        foreach (var item in Commands_{rand})
        {{
            Console.WriteLine($\"{key} {{item.Key}} {{item.Value.Item2}}\");
            if (item.Value.Item1) Results_.TryAdd(item.Key, Console.ReadLine());
        }}
        Console.WriteLine(\"{round_key}\");
        Commands_{rand}.Clear();
    }});

    static bool stdin_{rand}(int i, string c, string m)
    {{
        Commands_{rand}.TryAdd(i, (true, c));
        Bar_{rand}.SignalAndWait();
        if (Results_{rand}.TryGetValue(i, out string res)) return res == m;
        else return false;
    }}

    static int stdin_{rand}(int i, string c)
    {{
        Commands_{rand}.TryAdd(i, (true, c));
        Bar_{rand}.SignalAndWait();
        return int.Parse(Results_{rand}[i]);
    }}

    static void stdout_{rand}(int i, string c)
    {{
        Commands_{rand}.TryAdd(i, (false, c));
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
        // Bar_{rand}.Dispose();
    }}

    /* USER CODE */

    {codes}
}}", rand=rand, 
    length=codes.len(), 
    thread_names=codes.iter().map(|p| p.caller.clone()).collect::<Vec<String>>().join(", "), 
    round_key=round_key, 
    key=key,
    codes=codes.iter().map(|p| p.code.clone()).collect::<Vec<String>>().join("\n\n\n"))
}