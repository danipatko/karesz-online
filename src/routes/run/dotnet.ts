import { KareszDotnet } from '$lib/karesz/dotnet/karesz-dotnet';
import { R } from '$lib/util/util';

export const post = async(req:any) => {
    return new Promise<any>(async res => {
        const { code, karesz } = JSON.parse(req.body);

        if(! (code && karesz)) {
            res(R(undefined, 'Code or karesz field missing from request body.', 400));
            return;
        }
        
        new KareszDotnet('testing', { code, karesz, use_stdbuf:true, limit:{ max_ticks:5000, cpu_time:5, max_stack:128_000_000 } })
        .runRemove()
        .then(x => { 
            const { results, error } = x;
            console.log(x);
            if(error || !results)
                res(R( error ));
            else 
                res(R(results))
        })
        .catch(error => { console.log(error); res(R({ error })); });
    });
}
