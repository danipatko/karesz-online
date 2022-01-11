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

    public dataHandler:(s:string|Serializable, write:(s:string)=>void, kill:(signal:NodeJS.Signals)=>void) => void = () => {};
    public errorHandler:(s:Error, kill:(signal:NodeJS.Signals)=>void)=>void = () => {};
    public exitHandler:(code:number|null, signal:NodeJS.Signals|null) => void = () => {};

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
        if(this.process === null || this.process.stdout == null) throw new Error(`An error occured when spawning '${this.args.join(' ')}'.`);
       
        // set error handlers
        this.process.stdout?.addListener('error', e => this.errorHandler(e, x => this.kill(x)));
        this.process.addListener('error', e => this.errorHandler(e, x => this.kill(x)));
        this.process.stderr?.addListener('error', e => this.errorHandler(e, x => this.kill(x)));
        // set data handlers
        this.process.stdout?.addListener('data',  s => this.dataHandler(s, x => this.write(x), x => this.kill(x)));
        this.process.addListener('message', s => this.dataHandler(s, x => this.write(x), x => this.kill(x)));
        // set exit handler
        this.process.addListener('exit', this.exitHandler);

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
        this.dataHandler = handler;
        return this;
    }

    /**
     * Called on error or stdout.error
     */
    public onError(handler: (err: Error, kill:(signal:NodeJS.Signals)=>void) => void):Command {
        this.errorHandler = handler;
        return this;
    }

    /**
     * One-time event - called on exit, returns exit code and signal
     */
    public onExit(handler: (code: number|null, signal: NodeJS.Signals | null) => void):Command {
        this.exitHandler = handler;
        return this;
    }

    /**
     * Write a chunk of string to the stdin of the process
     * @param data 
     */
    public write(data:string):void {
        if(!this || this.process === undefined) throw new Error(`Unable to write to stdin: process was never spawned`);
        this.process.stdin?.cork();
        this.process.stdin?.write(`${data}\n`);
        this.process.stdin?.uncork();
    }

    /**
     * Run command asyncronously. Returns a `CommandResults` object containing the output.
     */
    public async runAwait(commandOptions:CommandOptions={}):Promise<CommandResults> {
        return new Promise<CommandResults>(resolve => {
            var data:string = '';
            var errors:string = '';
            this.onData(dat => data += dat)
                .onError(err => errors += err)
                .onExit((code, signal) => 
                    resolve({ code, signal, data, errors, ok: !errors && code == 0 })
                ).run(commandOptions);
        });
    }

    /**
     * Run command asyncronously. Returns the exit code and signal, handlers should be assigned manually.
     */
    public async runAsync(commandOptions:CommandOptions={}):Promise<any> {
        return new Promise<any>(res => {
            this.onExit((code, signal) => 
                res({ code, signal })
            ).run(commandOptions);
        });
    }
}

export const spwn = (...args:Array<string>):Command => new Command(...args);