use std::io::{BufRead, BufReader, Write};
use std::path::Path;
use std::process::{Command, Stdio};

pub fn compile() -> Result<usize, String> {
    /*
    let output = Command::new("dotnet")
        .arg("/usr/share/dotnet/sdk/6.0.201/Roslyn/bincore/csc.dll")
        .arg("-r:/usr/share/dotnet/shared/Microsoft.NETCore.App/6.0.2/System.Private.CoreLib.dll")
        .arg("-r:/usr/share/dotnet/shared/Microsoft.NETCore.App/6.0.2/System.Runtime.dll")
        .arg("-r:/usr/share/dotnet/shared/Microsoft.NETCore.App/6.0.2/System.Threading.Thread.dll")
        .arg("-r:/usr/share/dotnet/shared/Microsoft.NETCore.App/6.0.2/System.Threading.Tasks.Parallel.dll")
        .arg("-r:/usr/share/dotnet/shared/Microsoft.NETCore.App/6.0.2/System.Runtime.Extensions.dll")
        .arg("-r:/usr/share/dotnet/shared/Microsoft.NETCore.App/6.0.2/System.Threading.dll")
        .arg("-r:/usr/share/dotnet/shared/Microsoft.NETCore.App/6.0.2/System.Collections.Concurrent.dll")
        .arg("-r:/usr/share/dotnet/shared/Microsoft.NETCore.App/6.0.2/System.Diagnostics.Tracing.dll")
        .arg("-r:/usr/share/dotnet/shared/Microsoft.NETCore.App/6.0.2/System.Collections.dll")
        .arg("-r:/usr/share/dotnet/shared/Microsoft.NETCore.App/6.0.2/System.Console.dll")
        .arg("-r:/usr/share/dotnet/shared/Microsoft.NETCore.App/6.0.2/System.Text.Encoding.Extensions.dll")
        .arg("/usr/src/app/Program.cs")
        .arg("-out:/home/dapa/Projects/karesz-online/runner/test.dll\"")
        // .stdout(Stdio::piped())
        // .stdin(Stdio::piped())
        // .current_dir(Path::new("C:/Users/Dani"))
        .output()
        .expect("Failed to start compile process");
    // */

    let output = Command::new("dotnet")
        .arg("C:/Program Files/dotnet/sdk/5.0.402/Roslyn/bincore/csc.dll")
        .arg("-r:\"C:/Program Files/dotnet/shared/Microsoft.NETCore.App/6.0.3/System.Private.CoreLib.dll\"")
        .arg("-r:\"C:/Program Files/dotnet/shared/Microsoft.NETCore.App/6.0.3/System.Runtime.dll\"")
        .arg("-r:\"C:/Program Files/dotnet/shared/Microsoft.NETCore.App/6.0.3/System.Threading.Thread.dll\"")
        .arg("-r:\"C:/Program Files/dotnet/shared/Microsoft.NETCore.App/6.0.3/System.Threading.Tasks.Parallel.dll\"")
        .arg("-r:\"C:/Program Files/dotnet/shared/Microsoft.NETCore.App/6.0.3/System.Runtime.Extensions.dll\"")
        .arg("-r:\"C:/Program Files/dotnet/shared/Microsoft.NETCore.App/6.0.3/System.Threading.dll\"")
        .arg("-r:\"C:/Program Files/dotnet/shared/Microsoft.NETCore.App/6.0.3/System.Collections.Concurrent.dll\"")
        .arg("-r:\"C:/Program Files/dotnet/shared/Microsoft.NETCore.App/6.0.3/System.Diagnostics.Tracing.dll\"")
        .arg("-r:\"C:/Program Files/dotnet/shared/Microsoft.NETCore.App/6.0.3/System.Collections.dll\"")
        .arg("-r:\"C:/Program Files/dotnet/shared/Microsoft.NETCore.App/6.0.3/System.Console.dll\"")
        .arg("-r:\"C:/Program Files/dotnet/shared/Microsoft.NETCore.App/6.0.3/System.Text.Encoding.Extensions.dll\"")
        .arg("./Program.cs")
        .arg("-out:./test.dll")
        // .current_dir(Path::new("C:/Users/Dani/home/Projects/karesz-online/runner"))
        .output()
        .expect("Failed to start compile process");
    // */
    if output.status.code().unwrap() == 0 {
        return Ok(0);
    } else {
        return Err(format!(
            "Error: {}",
            std::str::from_utf8(&output.stdout).unwrap()
        ));
    }
}

// runner function
// TODO: make result return
pub fn run<T: 'static + Send + FnMut(&str) -> Option<u8>>(mut callback: T) {
    /* let mut child = Command::new("dotnet")
        .arg("exec")
        .arg("--runtimeconfig")
        .arg("/home/dapa/Projects/karesz-online/runner/test.runtimeconfig.json")
        .arg("/home/dapa/Projects/karesz-online/runner/test.dll")
        .stdout(Stdio::piped())
        .stdin(Stdio::piped())
        .spawn()
        .expect("Failed to start ping process");
    // */

    let mut child = Command::new("dotnet")
        .arg("exec")
        .arg("--runtimeconfig")
        .arg("./test.runtimeconfig.json")
        .arg("./test.dll")
        .stdout(Stdio::piped())
        .stdin(Stdio::piped())
        .current_dir(Path::new(
            "C:/Users/Dani/home/Projects/karesz-online/runner",
        ))
        .spawn()
        .expect("Failed to start ping process");
    // */
    println!("Started process: {}", child.id());

    let mut stdout = BufReader::new(child.stdout.take().unwrap());
    let mut stdin = child.stdin.take().unwrap();
    let mut current_line = String::new();
    let mut i: usize = 0;

    loop {
        match child.try_wait() {
            // process end
            Ok(Some(status)) => {
                println!("Process exited with code {}", status.code().unwrap());
                break;
            }
            Ok(_) => {
                // TODO: callback kill process
                match stdout.read_line(&mut current_line) {
                    Ok(_) => {
                        // get response from callback
                        match callback(current_line.as_str()) {
                            Some(value) => {
                                // if player dies in single player, kill process
                                if value == 8 {
                                    match child.kill() {
                                        Ok(_) => {
                                            println!("killed");
                                        }
                                        Err(_) => {
                                            println!("kill failed");
                                        }
                                    }
                                    return;
                                }
                                match stdin.write_all(format!("{}\n", value).as_bytes()) {
                                    Ok(_) => {
                                        println!("      wrote: '{}'", value);
                                    }
                                    Err(e) => {
                                        println!("uh oh: {}", e);
                                        break;
                                    }
                                }
                            }
                            None => {}
                        }
                        i += 1;
                        if i > 100 {
                            match child.kill() {
                                Ok(_) => {
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
            }
            Err(e) => {
                println!("An error occued when attempting to wait: {}", e);
                break;
            }
        }
    }

    println!("END - {i}", i = i);
}
