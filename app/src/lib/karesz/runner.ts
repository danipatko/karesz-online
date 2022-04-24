import {
    COMPILER_LOCATION,
    LIBRARY_LOCATIONS,
    MULITPLAYER_IMPORTS,
    RUNNER_DIRECTORY,
} from './config';
import { random } from './types';
import fs from 'fs';
import path from 'path/posix';
import cp from 'child_process';
import util from 'util';

const run = async (
    cmd: string,
    cwd: string
): Promise<{ code: number; stderr: string; stdout: string }> => {
    return new Promise<{ code: number; stderr: string; stdout: string }>(
        (res, rej) => {
            console.log(`Running: '${cmd}'`);
            const child = cp.exec(cmd, { cwd });
            // failed to spawn
            if (!(child.stdout && child.stderr)) {
                res({ code: 1, stderr: 'Failed to spawn', stdout: '' });
                return;
            }

            const stdout: Buffer[] = [];
            const stderr: Buffer[] = [];

            child.stdout.on('data', (chunk) => stdout.push(Buffer.from(chunk)));
            child.stderr.on('data', (chunk) => stderr.push(Buffer.from(chunk)));

            child.on('close', (code) => {
                res({
                    code: code === null ? 1 : code,
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

    public static async run(
        template: string,
        resultKey: string
    ): Promise<{
        success: boolean;
        output: string;
    }> {
        return new Promise<{
            success: boolean;
            output: string;
            result: object;
        }>((res) => {
            const runner = new Runner(template);
            runner.write();
            runner.compile().then((result) => {
                // compilation failed
                if (result.code != 0) {
                    res({
                        success: false,
                        output: `Exit code ${result.code}\nSTDERR:\n${result.stderr}\n\nSTDOUT:\n${result.stdout}`,
                        result: {},
                    });
                    return;
                }
                runner.run().then(({ code, stderr, stdout }) => {
                    res({
                        success: code == 0 && stdout.includes(resultKey),
                        output: `${
                            stdout.includes(resultKey)
                                ? ''
                                : 'Could not find result line.\n'
                        }Exit code ${code}\nSTDERR:\n${stderr}\n\nSTDOUT:\n${stdout}`,
                        result: JSON.parse(
                            stdout
                                .split('\n')
                                .filter((line) => line.includes(resultKey))
                                .join('')
                        ),
                    });
                });
            });
        });
    }

    private constructor(template: string) {
        this.template = template;
    }

    private write() {
        fs.writeFileSync(
            path.join(RUNNER_DIRECTORY, `${this.rand}.cs`),
            this.template
        );
    }

    private compile = async () =>
        await run(
            `dotnet ${COMPILER_LOCATION} ${MULITPLAYER_IMPORTS.map(
                (lib) => `-r:"${path.join(LIBRARY_LOCATIONS, lib)}"`
            ).join(' ')} ${this.rand}.cs -out:${this.rand}.dll`,
            RUNNER_DIRECTORY
        );

    private run = async () =>
        await run(
            `dotnet exec --runtimeconfig ./test.runtimeconfig.json ${this.rand}.dll`,
            RUNNER_DIRECTORY
        );
}
