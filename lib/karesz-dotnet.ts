import { spawn } from 'child_process';

export const tryrun = () => {
    console.log('CALLED');
    // mcs Program.cs && mono --aot=full Program.exe && mono Program.exe
    const c = spawn('mcs C:\\Users\\Dani\\home\\Projects\\karesz-online\\testing\\Program.cs', {
        stdio: 'pipe'
    });

    c.stdout.on('data', (data) => {
        console.log(data);
    });
    //*/
}