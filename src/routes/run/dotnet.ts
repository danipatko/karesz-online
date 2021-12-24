import { tryrun } from "$lib/karesz/dotnet/karesz-dotnet";
import { R } from "$lib/util";

export const post = async(req:any) => {
    const { code, karesz } = JSON.parse(req.body);
    if(! (code && karesz)) {
        return R(undefined, 'Code or karesz field missing from request body.', 400);
    }
    const { sizeX, sizeY, startX, startY, map } = karesz;
    const { results, error } = await tryrun({ sizeX, sizeY, startX, startY, code, map });
    console.log(JSON.stringify(results) || error);
    if(error || !results) 
        return R(undefined, error, 200);

    return R({ results }, 'Bruh');
}
