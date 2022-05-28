import fs from 'fs';
import {
    CRUCIAL_IMPORTS,
    RUNNER_DIRECTORY,
    COMPILER_LOCATION,
    LIBRARY_LOCATIONS,
    MULITPLAYER_DLL,
    SINGLEPLAYER_DLL,
} from '../config';
import path from 'path/posix';
import cp from 'child_process';
import { CommandResult, random } from '../types';
import { MultiResult, SingleResult } from '../../shared/types';

// run a command in a specific directory
// returns the exit code, stderr, and stdout
const run = async (
    cmd: string,
    cwd: string
): Promise<{ exitCode: number; stderr: string; stdout: string }> => {
    return new Promise<{ exitCode: number; stderr: string; stdout: string }>(
        (res) => {
            process.env.NODE_ENV !== 'production' &&
                console.log(`Running: '${cmd}'`);

            const child = cp.exec(cmd, { cwd });
            // check both pipes
            if (!(child.stdout && child.stderr))
                return void res({
                    exitCode: 1,
                    stderr: 'Failed to spawn (unable to read stdout or stderr)',
                    stdout: '',
                });

            const stdout: Buffer[] = [],
                stderr: Buffer[] = [];

            child.stdout.on('data', (chunk) => stdout.push(Buffer.from(chunk)));
            child.stderr.on('data', (chunk) => stderr.push(Buffer.from(chunk)));

            child.on('close', (exitCode) => {
                res({
                    exitCode: exitCode === null ? 1 : exitCode,
                    stdout: Buffer.concat(stdout)
                        .toString('utf-8')
                        .replaceAll('\r', ''),
                    stderr: Buffer.concat(stderr)
                        .toString('utf-8')
                        .replaceAll('\r', ''),
                });
            });
        }
    );
};

export class Runner {
    private template: string;
    private rand: string = random();

    // run a multiplayer instance
    public static async run(
        template: string,
        type: 'single' | 'multi'
    ): Promise<CommandResult<null | SingleResult | MultiResult>> {
        // generate template and write to file
        const self = new Runner(template);
        self.write();
        // compile
        const compileResult = await self.compile(type);
        self.rmCode();
        if (compileResult.exitCode !== 0)
            return { ...compileResult, result: null };

        // run
        const runtimeResult = await self.run();
        self.rmDll();

        fs.writeFileSync(
            'C:/Users/Dani/home/Projects/karesz-online/test.txt',
            runtimeResult.stdout
        );

        if (runtimeResult.exitCode !== 0)
            return { ...runtimeResult, result: null };
        // console.log('output:', '\n', runtimeResult.stdout); // DEBUG

        const lines = runtimeResult.stdout.trim().split('\n');
        const result = JSON.parse(lines.pop() ?? '{}');

        // cannot find or parse result
        if (!Object.keys(result).length)
            return {
                result: null,
                stdout: runtimeResult.stdout,
                stderr: runtimeResult.stderr + '\nUnable to find results',
                exitCode: 1,
            };

        // evalute
        return { ...runtimeResult, result, stdout: lines.join('\n') };
    }

    private constructor(template: string) {
        this.template = template;
    }

    // write the template to a file
    private write() {
        fs.writeFileSync(
            path.join(RUNNER_DIRECTORY, `${this.rand}.cs`),
            this.template
        );
    }

    // compile the template
    private compile = async (type: 'single' | 'multi') =>
        await run(
            `dotnet ${COMPILER_LOCATION} ${this.getImports(type)} ${
                this.rand
            }.cs -out:${this.rand}.dll`,
            RUNNER_DIRECTORY
        );

    // run the template
    private run = async () =>
        await run(
            `dotnet exec --runtimeconfig ./test.runtimeconfig.json ${this.rand}.dll`,
            RUNNER_DIRECTORY
        );

    // remove the .cs file
    private rmCode = () =>
        process.env.NODE_ENV === 'production' &&
        fs.unlinkSync(path.join(RUNNER_DIRECTORY, `${this.rand}.cs`));

    // remove the .dll file
    private rmDll = () =>
        process.env.NODE_ENV !== 'production' &&
        process.platform !== 'win32' && // windows won't let you remove any dll files
        fs.unlinkSync(path.join(RUNNER_DIRECTORY, `${this.rand}.dll`));

    // the imports as command line arguments
    private getImports(type: 'single' | 'multi'): string {
        return [
            ...CRUCIAL_IMPORTS,
            ...(type == 'multi' ? MULITPLAYER_DLL : SINGLEPLAYER_DLL),
        ]
            .map((lib) => `-r:"${path.join(LIBRARY_LOCATIONS, `${lib}.dll`)}"`)
            .join(' ');
    }
}
