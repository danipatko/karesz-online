import fs from 'fs';
import {
    RUNNER_DIRECTORY,
    COMPILER_LOCATION,
    LIBRARY_LOCATIONS,
    MULITPLAYER_IMPORTS,
} from './config';
import path from 'path/posix';
import cp from 'child_process';
import { CommandResult, random } from './types';

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
                    stdout: Buffer.concat(stdout).toString('utf-8'),
                    stderr: Buffer.concat(stderr).toString('utf-8'),
                });
            });
        }
    );
};

export class Runner {
    //
    private template: string;
    private rand: string = random();

    // run a multiplayer instance
    public static async run(
        template: string,
        resultKey: string
    ): Promise<CommandResult> {
        // generate template and write to file
        const self = new Runner(template);
        self.write();
        // compile
        const compileResult = await self.compile();
        self.rmCode();
        if (compileResult.exitCode !== 0)
            return { ...compileResult, result: {} };

        // run
        const runtimeResult = await self.run();
        self.rmDll();
        if (compileResult.exitCode !== 0)
            return { ...compileResult, result: {} };

        const results = self.getJson(runtimeResult.stdout, resultKey);
        // cannot find or parse result
        if (!Object.keys(results).length)
            return {
                ...runtimeResult,
                exitCode: 1,
                stderr: runtimeResult.stderr + '\nUnable to find results',
                result: {},
            };

        // evalute
        return { ...compileResult, result: {} };
    }

    // extracts the result from the logs
    private getJson = (stdout: string, resultKey: string): object =>
        JSON.parse(
            stdout
                .split('\n')
                .find((x) => x.startsWith(resultKey))
                ?.replaceAll(resultKey, '') ?? '{}'
        );

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
    private compile = async () =>
        await run(
            `dotnet ${COMPILER_LOCATION} ${MULITPLAYER_IMPORTS.map(
                (lib) => `-r:"${path.join(LIBRARY_LOCATIONS, lib)}"`
            ).join(' ')} ${this.rand}.cs -out:${this.rand}.dll`,
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
        process.env.NODE_ENV === 'production' &&
        fs.unlinkSync(path.join(RUNNER_DIRECTORY, `${this.rand}.dll`));
}
