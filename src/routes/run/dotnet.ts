import KareszRunner from '$lib/karesz/core/run';
import type { Karesz } from '$lib/karesz/core/types';
import { R } from '$lib/util/util';

export const post = async(req:any) => {
    return new Promise<any>(async res => {
        const { code, karesz } = JSON.parse(req.body);

        if(! (code && karesz)) {
            res(R(undefined, 'Code or karesz field missing from request body.', 400));
            return;
        }

        const inst = new KareszRunner('CSHARP', new Map<number, Karesz>());
        inst.run({ code:[code, code] });
        
        R({ error:'asdsadalksdafnbéjbhagweiusédfjbneékjsbgykabefísiébgieépf' });
    });
}
