import { ChildProcess, spawn, ProcessEnvOptions, Serializable } from 'child_process';

const STDBUF:Array<string> = ['stdbuf', '-i0', '-o0', '-e0'];

const prlimit = (command:Array<string>, { cputime=0.3, nproc=1, stack=128 }={}) => 
    [ 'prlimit', `-t=${cputime}`, `-u=${nproc}`, `-s=${stack}`, '--noheadings', ...command ];

export interface CommandOptions extends ProcessEnvOptions {
    std?:{
        write ?: boolean | undefined;
        read ?: boolean | undefined;
        encoding ?:BufferEncoding | undefined;
        use_stdbuf ?: boolean | undefined;
        pipe?: boolean | undefined;
    } | undefined;
    limit?: {
        cputime ?: number | undefined;
        stack ?: number | undefined;
        nproc ?: number | undefined;
    } | undefined;
}

export interface CommandResults {
    code: number | null;
    signal: NodeJS.Signals | null;
    data: string | undefined; 
    errors: string | undefined;
    ok: boolean | undefined;
}

export class Command {

    private args:Array<string> = [];
    public process:ChildProcess|undefined;
    public running:boolean = false;
    private isLinux:boolean = false;

    constructor(...args:Array<string>) {
        if(!args.length) throw new Error(`Missing command arguments.`);
        this.args = args;
        this.isLinux = process.platform === 'linux' || process.platform === 'darwin';
        return this;
    }

    /**
     * Kill the current process (and its children if any)
     */
    public kill(signal:NodeJS.Signals='SIGKILL'):void {
        this.process?.kill(signal);
    }

    /**
     * Spawn a new child process
     * @param {CommandOptions} commandOptions 
     * @returns {Command} self
     */
    public run(commandOptions: CommandOptions={}):Command {
        // add stdbuf in front of command
        if(this.isLinux && commandOptions.std?.use_stdbuf)
            this.args.unshift(...STDBUF);
        // limit resource usage
        if(this.isLinux && commandOptions.limit)
            this.args = prlimit(this.args, { nproc:commandOptions.limit.nproc, stack:commandOptions.limit.stack, cputime:commandOptions.limit.cputime });
            
        console.log(`Running: '${this.args.join(' ')}'`); // DEBUG
        // spawn command
        this.process = spawn(this.args.shift() || '', this.args, commandOptions);
        if(this.process === null) throw new Error(`An error occured when spawning '${this.args.join(' ')}'.`);
        this.running = true;

        this.process.stdout?.setEncoding(commandOptions.std?.encoding || 'utf-8');
        if(commandOptions.std?.write) this.process.stdin?.setDefaultEncoding('utf-8');
        if(commandOptions.std?.pipe) this.process.stdout?.pipe(process.stdout);

        return this;
    }

    /**
     * Called on message, or stdout.data
     */
    public onData(handler:(s:string|number|Serializable, write:(s:string)=>void, kill:(signal:NodeJS.Signals)=>void) => void):Command {
        if(!this.process || !this.process.stdout) throw new Error(`Cannot set data handler: process is not initialized.`);
        this.process.stdout.on('data', _ => handler(_, this.write, this.kill));
        this.process.on('message', _ => handler(_, this.write, this.kill));
        this.process.stderr?.on('data', _ => handler(_, this.write, this.kill));
        return this;
    }

    /**
     * Called on error or stdout.error
     */
    public onError(handler: (err: Error) => void):Command {
        if(!this.process || !this.process.stdout) throw new Error(`Cannot set error handler: process is not initialized.`);
        this.process.stdout.on('error', handler);
        this.process.on('error', handler);
        this.process.stderr?.on('error', handler);
        return this;
    }

    /**
     * One-time event - called on exit, returns exit code and signal
     */
    public onExit(handler: (code: number | null, signal: NodeJS.Signals | null) => void):Command {
        if(!this.process) throw new Error(`Cannot set exit handler: process is not initialized.`);
        this.process.on('exit', (code, signal) => { 
            this.running = false;
            handler(code, signal);
        });
        return this;
    }

    /**
     * Write a chunk of string to the stdin of the process
     * @param data 
     */
    public write(data:string):void {
        if(!this || this.process === undefined) throw new Error(`Unable to write to stdin: process was never spawned`);
        this.process.stdin?.cork();
        this.process.stdin?.write(data);
        this.process.stdin?.uncork();
    }

    /**
     * Run command asyncronously
     */
    public async runAsync(commandOptions:CommandOptions={}):Promise<CommandResults> {
        return new Promise<CommandResults>(resolve => {
            var data:string = ''
            var errors:string = '';
            this.run(commandOptions)
                .onData(dat => data += dat)
                .onError(err => errors += err)
                .onExit((code, signal) => 
                    resolve({ code, signal, data, errors, ok: !errors && code == 0 })
                );
        });
    }
}

export const spwn = (...args:Array<string>):Command => new Command(...args);
