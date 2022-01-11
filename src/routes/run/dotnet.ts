import { KareszDotnet } from '$lib/karesz/dotnet/karesz-dotnet';
import { R } from '$lib/util';

export const post = async(req:any) => {
    const { code, karesz } = JSON.parse(req.body);
    if(! (code && karesz)) {
        return R(undefined, 'Code or karesz field missing from request body.', 400);
    }

    const { results, error } = await new KareszDotnet('testing', { code, karesz, use_stdbuf:true, limit:{ max_ticks:5000, cpu_time:5, max_stack:128_000_000 } }).runRemove();

    console.log(JSON.stringify(results) || error);
    if(error || !results) 
        return R(undefined, error, 200);

    return R({ results }, 'Bruh');
}
