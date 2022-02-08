import KareszRunner from '$lib/karesz/core/run';
import { Karesz, Rotation } from '$lib/karesz/core/types';
import { rotations } from '$lib/util/karesz';
import { R } from '$lib/util/util';

export const post = async(req:any) => {
    return new Promise<any>(async res => {
        const { code, karesz } = JSON.parse(req.body);

        if(! (code && karesz)) {
            res(R(undefined, 'Code or karesz field missing from request body.', 400));
            return;
        }

        const asd = new Map<number, Karesz>();

        asd.set(0, { id:'1', position:{ x:5, y:5 }, rotation:Rotation.up, steps:'' });
        asd.set(1, { id:'2', position:{ x:6, y:6 }, rotation:Rotation.down, steps:'' });

        const inst = new KareszRunner('CSHARP', asd);
        await inst.run({ code:[code, code] });

        console.log('--- Finished ---');
        inst.players.forEach(x => {
            console.log(x.steps);
        });
        
        R({ error:'asdsadalksdafnbéjbhagweiusédfjbneékjsbgykabefísiébgieépf' });
    });
}
