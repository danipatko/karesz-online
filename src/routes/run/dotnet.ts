import { tryrun } from "$lib/karesz/dotnet/karesz-dotnet";
import { R } from "$lib/util";

export const post = async(req:any) => {
    const { code, kareszconfig } = JSON.parse(req.body);
    if(! (code && kareszconfig)) {
        return R(undefined, 'Code field not found in request body.', 400);
    }
    const { sizeX, sizeY, startX, startY } = kareszconfig;
    const { results, error } = await tryrun({ sizeX, sizeY, startX, startY, code });
    if(error || !results) 
        return R(undefined, error, 200);

    return R({ results }, 'Bruh');
}
