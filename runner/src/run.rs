use std::io::{BufRead, BufReader, Write};
use std::process::{Command, Stdio};
use std::path::Path;

pub fn compile() {
    let output = Command::new("dotnet")
        .arg("C:/Program Files/dotnet/sdk/5.0.402/Roslyn/bincore/csc.dll")
        .arg("-r:\"C:/Program Files/dotnet/shared/Microsoft.NETCore.App/3.1.20/System.Private.CoreLib.dll\"")
        .arg("-r:\"C:/Program Files/dotnet/shared/Microsoft.NETCore.App/3.1.20/System.Runtime.dll\"")
        .arg("-r:\"C:/Program Files/dotnet/shared/Microsoft.NETCore.App/3.1.20/System.Threading.Thread.dll\"")
        .arg("-r:\"C:/Program Files/dotnet/shared/Microsoft.NETCore.App/3.1.20/System.Threading.Tasks.Parallel.dll\"")
        .arg("-r:\"C:/Program Files/dotnet/shared/Microsoft.NETCore.App/3.1.20/System.Runtime.Extensions.dll\"")
        .arg("-r:\"C:/Program Files/dotnet/shared/Microsoft.NETCore.App/3.1.20/System.Threading.dll\"")
        .arg("-r:\"C:/Program Files/dotnet/shared/Microsoft.NETCore.App/3.1.20/System.Collections.Concurrent.dll\"")
        .arg("-r:\"C:/Program Files/dotnet/shared/Microsoft.NETCore.App/3.1.20/System.Diagnostics.Tracing.dll\"")
        .arg("-r:\"C:/Program Files/dotnet/shared/Microsoft.NETCore.App/3.1.20/System.Collections.dll\"")
        .arg("-r:\"C:/Program Files/dotnet/shared/Microsoft.NETCore.App/3.1.20/System.Console.dll\"")
        .arg("-r:\"C:/Program Files/dotnet/shared/Microsoft.NETCore.App/3.1.20/System.Text.Encoding.Extensions.dll\"")
        .arg("C:/Users/Dani/home/Projects/karesz-online/runner/Program.cs")
        .arg("-out:\"C:/Users/Dani/home/Projects/karesz-online/runner/test.dll\"")
        // .stdout(Stdio::piped())
        // .stdin(Stdio::piped()) 
        .current_dir(Path::new("C:/Users/Dani"))
        .output()
        .expect("Failed to start compile process");
    
    println!("Finished {}", output.status.code().unwrap())
}

// runner function 
pub fn run<T: 'static + Send + FnMut(&str) -> Option<u8>>(mut callback: T) {
    let mut child = Command::new("dotnet")
        .arg("exec")
        .arg("--runtimeconfig")
        .arg("./test.runtimeconfig.json")
        .arg("./test.dll")
        .stdout(Stdio::piped())
        .stdin(Stdio::piped()) 
        .current_dir(Path::new("C:/Users/Dani/home/Projects/karesz-online/runner"))
        .spawn()
        .expect("Failed to start ping process");
    
    println!("Started process: {}", child.id());
    
    let mut stdout = BufReader::new(child.stdout.take().unwrap());
    let mut stdin = child.stdin.take().unwrap();
    let mut current_line = String::new();
    let mut i:usize = 0;

    loop {
        match child.try_wait() {
            // process end
            Ok(Some(status)) => {
                println!("Process exited with code {}", status.code().unwrap());
                break
            },
            Ok(_) => {
                match stdout.read_line(&mut current_line) {
                    Ok(_) => {
                        // get response from callback
                        match callback(current_line.as_str()) {
                            Some(value) => {
                                match stdin.write_all(format!("{}\n", value).as_bytes()) {
                                    Ok(_) => {
                                        println!("wrote '{}' to child stdin", value);
                                    },
                                    Err(e) => {
                                        println!("uh oh: {}", e); 
                                        break
                                    },
                                }
                            }
                            None => {}
                        }
                        i += 1;
                        current_line.clear();
                    }
                    Err(e) => {
                        println!("Error reading stdout: {}", e);
                        break
                    }
                }
            },
            Err(e) => {
                println!("An error occued when attempting to wait: {}",e);
                break
            }
        }
    }

    println!("END - {i}", i=i);    
}