import { spwn } from '$lib/util/command';
import { RULES } from './config';
import { Template } from './template';
import fs from 'fs';
import path from 'path/posix';
import { randstr } from '$lib/karesz/util';
import { SyncTemplate } from './template-sync';

const run = async({ 
    code,
    dataParser,
    key,
    basePath
}:{ 
    code:string|string[]; 
    dataParser: (line:string, write: (s: string) => void, kill: (signal: NodeJS.Signals) => void) => void;
    key:string;
    basePath:string;
}):Promise<{ error?:string; output:string; compilerOutput:string; exitCode:number; }> => {
    return new Promise<{ error?:string; output:string; compilerOutput:string; exitCode:number; }>(res => {

        const template = typeof code == 'string' ? new Template(code, RULES) : new SyncTemplate(code, RULES);
        // write template to file
        const filename = randstr(10);
        const cwd = path.join(basePath, filename);
        fs.mkdirSync(cwd);
        fs.writeFileSync(path.join(cwd, `${filename}.cs`), template._code);
    
        const compileFinishCode = randstr(10);
        let compilerOutput = '', error = '', output = '', compiled = false, lines:string[] = [];

        spwn('mcs', `${filename}.cs`, '&&', 'mono', '--aot=full', `${filename}.exe`, '&&', `echo ${compileFinishCode}`, '&&', 'mono', `${filename}.exe`)
            .onData((out, write, kill) => {
                lines = out.trim().split('\n');
                for (let i = 0; i < lines.length; i++) {
                    // handle compiler logs
                    if(!compiled) {
                        if(lines[i].trim() == compileFinishCode) 
                            compiled = true;
                        else 
                            compilerOutput += `${lines[i]}\n`;
                    } else if(lines[i].startsWith(key)) 
                        dataParser(lines[i], write, kill)
                    else 
                        output += `${lines[i]}\n`;
                }
            }).onError(x => 
                error += x
            ).onExit((exitCode, signal) => {
                res(exitCode == 0 ? { output, compilerOutput, exitCode } : { output, error, compilerOutput, exitCode }); 
            }).run({ cwd });
    });
}

