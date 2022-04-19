use std::fs;
use std::io::{BufRead, BufReader, Write};
use std::path::Path;
use std::process::{Command, Stdio};

const MAX_ROUNDS: usize = 5000;

// these import will be loaded
const ALLOWED_IMPORTS: [&str; 11] = [
    "System.Private.CoreLib.dll",
    "System.Runtime.dll",
    "System.Threading.Thread.dll",
    "System.Threading.Tasks.Parallel.dll",
    "System.Runtime.Extensions.dll",
    "System.Threading.dll",
    "System.Collections.Concurrent.dll",
    "System.Diagnostics.Tracing.dll",
    "System.Collections.dll",
    "System.Console.dll",
    "System.Text.Encoding.Extensions.dll",
];

// <...>/dotnet/shared/Microsoft.NETCore.App/VERSION
const ASSEMBLY_LOCATION: &str = if cfg!(windows) {
    "C:/Program Files/dotnet/shared/Microsoft.NETCore.App/6.0.3/"
} else {
    "/usr/share/dotnet/shared/Microsoft.NETCore.App/6.0.3/"
};

// the location of the csc compiler
const COMPILER_LOCATION: &str = if cfg!(windows) {
    "C:/Program Files/dotnet/sdk/5.0.402/Roslyn/bincore/csc.dll"
} else {
    "/usr/share/dotnet/sdk/6.0.201/Roslyn/bincore/csc.dll"
};

pub fn compile(code: &String, outdir: &str, filename: &String) -> Result<String, String> {
    // write to file
    match fs::write(format!("{}/{}.cs", outdir, filename), code) {
        Ok(_) => println!("Write OK"),
        Err(_) => {
            return Err(String::from("Failed to write to file"));
        }
    }

    match Command::new("dotnet")
        .arg(COMPILER_LOCATION)
        .args(ALLOWED_IMPORTS.map(|s| format!("-r:{}/{}", ASSEMBLY_LOCATION, s)))
        .arg(format!("./{}.cs", filename))
        .arg(format!("-out:./{}.dll", filename))
        .current_dir(Path::new(outdir))
        .output()
    {
        Ok(output) => {
            // exit code is 0
            let code = output.status.code().unwrap_or(-1);
            if code == 0 {
                return Ok(format!(
                    "Compiler output:\n{}",
                    String::from_utf8_lossy(&output.stdout)
                ));
            // compilation returned an error
            } else {
                return Err(format!(
                    "Compiler exited with error code {}:\n{}",
                    code,
                    String::from_utf8_lossy(&output.stdout)
                ));
            }
        }
        Err(e) => {
            return Err(e.to_string());
        }
    }
    // */
}

// runner function
pub fn run<'r, T: 'r + Send + FnMut(&str) -> Option<u8>>(
    outdir: &str,
    filename: &String,
    mut callback: T,
) -> (i32, bool) {
    let mut child = Command::new("dotnet")
        .arg("exec")
        .arg("--runtimeconfig")
        .arg("./test.runtimeconfig.json") // use same config
        .arg(format!("./{}.dll", filename))
        .stdout(Stdio::piped())
        .stdin(Stdio::piped())
        .stderr(Stdio::piped())
        .current_dir(Path::new(outdir))
        .spawn()
        .expect("Failed to start runner process");

    let mut stdout = BufReader::new(child.stdout.take().unwrap());
    let mut stdin = child.stdin.take().unwrap();
    let mut current_line = String::new();
    let mut i: usize = 0;
    let mut exit_code = 0;
    let mut killed = false;

    loop {
        match child.try_wait() {
            // process end
            Ok(Some(status)) => {
                println!("Process exited with code {}", status.code().unwrap());
                exit_code = status.code().unwrap();
                break;
            }
            Ok(_) => {
                match stdout.read_line(&mut current_line) {
                    Ok(_) => {
                        // get response from callback
                        match callback(current_line.as_str()) {
                            Some(value) => {
                                // if player dies in single player, kill process
                                if value == 8 {
                                    match child.kill() {
                                        Ok(_) => {
                                            //  println!("killed");
                                        }
                                        Err(_) => {
                                            println!("kill failed");
                                        }
                                    }
                                    break;
                                }
                                match stdin.write_all(format!("{}\n", value).as_bytes()) {
                                    Ok(_) => {
                                        // println!("      wrote: '{}'", value);
                                    }
                                    Err(e) => {
                                        println!("uh oh: {}", e);
                                        break;
                                    }
                                }
                            }
                            None => {}
                        }
                        // TODO: Make this configurable
                        i += 1;
                        if i > MAX_ROUNDS {
                            match child.kill() {
                                Ok(_) => {
                                    killed = true;
                                    println!("killed");
                                }
                                Err(_) => {
                                    println!("kill failed");
                                }
                            }
                        }
                        current_line.clear();
                    }
                    Err(e) => {
                        println!("Error reading stdout: {}", e);
                        break;
                    }
                }
                // read stderr into current line, in the next iteration, callback will read it
                // match stderr.read_line(&mut error_line) {
                //     Ok(_) => {
                //      }
                //     Err(_) => println!("Error reading stderr"),
                // };
            }
            Err(e) => {
                println!("An error occued when attempting to wait: {}", e);
                break;
            }
        }
    }

    // println!("END - {i}", i = i);
    return (exit_code, killed);
}
