use std::fs;
use std::io::{BufRead, BufReader, Write};
use std::path::Path;
use std::process::{Command, Stdio};

pub fn compile(code: &String, outdir: &str, filename: &String) -> Result<String, String> {
    // write to file
    match fs::write(format!("{}/{}.cs", outdir, filename), code) {
        Ok(_) => println!("Write OK"),
        Err(_) => {
            return Err(String::from("Failed to write to file"));
        }
    }

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
        .output()
        .expect("Failed to start compile process");
    // */

    match Command::new("dotnet")
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
        .arg(format!("./{}.cs", filename))
        .arg(format!("-out:./{}.dll", filename))
        .current_dir(Path::new(outdir))
        .output() {
        Ok(output) => {
            // exit code is 0
            let code = output.status.code().unwrap_or(-1);
            if code == 0 {
                return Ok(format!("Compiler output:\n{}", String::from_utf8_lossy(&output.stdout)));
            // compilation returned an error
            } else {
                return Err(format!("Compiler exited with error code {}:\n{}", code, String::from_utf8_lossy(&output.stdout)));
            }
        },
        Err(e) => { return  Err(e.to_string()); }
    }
    // */
}

// runner function
// TODO: make result return
pub fn run<'r, T: 'r + Send + FnMut(&str) -> Option<u8>>(
    outdir: &str,
    filename: &String,
    mut callback: T,
) {
    let mut child = Command::new("dotnet")
        .arg("exec")
        .arg("--runtimeconfig")
        .arg("./test.runtimeconfig.json") // use same config
        .arg(format!("./{}.dll", filename))
        .stdout(Stdio::piped())
        .stdin(Stdio::piped())
        .current_dir(Path::new(outdir))
        .spawn()
        .expect("Failed to start runner process");

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
