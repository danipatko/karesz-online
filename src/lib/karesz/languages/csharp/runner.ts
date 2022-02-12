import { spwn } from '../../../util/command';
import { RULES } from './config';
import { Template } from './template';
import fs from 'fs';
import path from 'path/posix';
import { randstr } from '../../../karesz/util';
import { SyncTemplate } from './template-sync';

const run = async ({
    code,
    dataParser,
    basePath,
}: {
    code: Map<number, string>;
    dataParser: (
        line: string,
        write: (s: string) => void,
        kill: (signal: NodeJS.Signals) => void
    ) => void;
    basePath: string;
}): Promise<{ error?: string; output: string; exitCode: number }> => {
    return new Promise<{ error?: string; output: string; exitCode: number }>(
        async (res) => {
            const template =
                code.size == 1
                    ? new Template(code.get(0), RULES)
                    : new SyncTemplate(code, RULES);
            if (template.error !== undefined)
                console.log(`Error: ${template.error}`);

            // write template to file
            const filename = randstr(10);
            const cwd = path.join(basePath, filename);
            fs.mkdirSync(cwd);
            fs.writeFileSync(path.join(cwd, `${filename}.cs`), template._code);

            const compileResults = await compile({ filename, cwd });
            console.log(
                `Compiled ${filename} (${compileResults.exitCode}). \nOutput:${compileResults.output}\n\n`
            );
            if (compileResults.exitCode != 0) {
                res({ ...compileResults });
                return;
            }

            const preCompileResults = await preCompile({ filename, cwd });
            console.log(
                `Compiled ${filename} (${preCompileResults.exitCode}). \nOutput:${preCompileResults.output}\n\n`
            );
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
                            dataParser(
                                lines[i],
                                (x) => write(x),
                                (x) => kill(x)
                            );
                        else output += `${lines[i]}\n`;
                    }
                })
                .onError((x) => {
                    error += x;
                })
                .onExit((exitCode) => {
                    res({ output, error, exitCode });
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
                .onExit((exitCode) => res({ output, error, exitCode }))
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
                .onExit((exitCode) => res({ output, error, exitCode }))
                .run({ cwd });
        }
    );
};

export default run;
