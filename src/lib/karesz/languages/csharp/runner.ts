import { spwn } from '../../../util/command';
import { Template } from './template';
import fs from 'fs';
import path from 'path/posix';
import { randstr } from '../../../karesz/util';

const run = async ({
    players,
    basePath,
    parser,
    onTick,
    onTemplateDone,
}: {
    players: { [key: string]: string };
    basePath: string;
    parser: (
        line: string,
        write: (s: string) => void,
        kill: (signal: NodeJS.Signals) => void
    ) => void;
    // onTick should be able to handle game end (last one standing)
    onTick: (
        write: (s: string) => void,
        kill: (signal: NodeJS.Signals) => void
    ) => void;
    onTemplateDone: (errors: { id: string; description: string }[]) => void;
}): Promise<{ error?: string; output: string; exitCode: number }> => {
    /* 
        TODO: SWITCH TO DOTNET 6 (docker) INSTEAD OF MONO
    */
    return new Promise<{ error?: string; output: string; exitCode: number }>(
        async (res) => {
            const template = new Template(players);

            // write template to file
            const filename = randstr(10);
            const cwd = path.join(basePath, filename);
            fs.mkdirSync(cwd);
            fs.writeFileSync(path.join(cwd, `${filename}.cs`), template.code);

            // handle user errors (after template.code call)
            onTemplateDone(template.errors);

            const compileResults = await compile({ filename, cwd });
            if (compileResults.exitCode != 0) {
                res({ ...compileResults });
                return;
            }

            const preCompileResults = await preCompile({ filename, cwd });
            if (preCompileResults.exitCode != 0) {
                res({ ...preCompileResults });
                return;
            }

            let lines: string[] = [],
                output: string = '',
                error: string = '';
            spwn('mono', `${filename}.exe`)
                .onData((out, write, kill) => {
                    lines = out.trim().split('\n');
                    for (let i = 0; i < lines.length; i++) {
                        // parse command
                        if (lines[i].startsWith(template.key))
                            parser(
                                lines[i],
                                (x) => write(x),
                                (x) => kill(x)
                            );
                        else if (lines[i].startsWith(template.roundKey))
                            onTick(write, kill);
                        else output += `${lines[i]}\n`;
                    }
                })
                .onError((x) => {
                    error += x;
                })
                .onExit((exitCode) => {
                    res({ output, error, exitCode: exitCode ?? 0 });
                })
                .run({ cwd });
        }
    );
};

const compile = async ({
    cwd,
    filename,
}: {
    cwd: string;
    filename: string;
}): Promise<{ output: string; error: string; exitCode: number }> => {
    return new Promise<{ output: string; error: string; exitCode: number }>(
        (res) => {
            var output = '',
                error = '';
            spwn('mcs', `${filename}.cs`)
                .onData((x) => (output += x))
                .onError((x) => (error += x))
                .onExit((exitCode) =>
                    res({ output, error, exitCode: exitCode ?? 0 })
                )
                .run({ cwd });
        }
    );
};

const preCompile = async ({
    cwd,
    filename,
}: {
    cwd: string;
    filename: string;
}): Promise<{ output: string; error: string; exitCode: number }> => {
    return new Promise<{ output: string; error: string; exitCode: number }>(
        (res) => {
            var output = '',
                error = '';
            spwn('mono', '--aot=full', `${filename}.exe`)
                .onData((x) => (output += x))
                .onError((x) => (error += x))
                .onExit((exitCode) =>
                    res({ output, error, exitCode: exitCode ?? 0 })
                )
                .run({ cwd });
        }
    );
};

export default run;
