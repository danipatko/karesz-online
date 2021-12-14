// import karesz from "$lib/karesz/karesz";
// import kontext from "$lib/karesz/kontext";
// import { tryrun } from "$lib/karesz/dotnet/karesz-dotnet";
import { xd } from "$lib/karesz/dotnet/asd";
import { R } from "$lib/util";

export const post = async(req:any) => {
    const { code, kareszconfig } = JSON.parse(req.body);
    if(! (code && kareszconfig)) {
        return R(undefined, 'Code field not found in request body.', 400);
    }

    console.log('ASD');
    const { sizeX, sizeY, startX, startY } = kareszconfig;

    console.log(xd());

   // const steps = await tryrun({sizeX, sizeY, startX, startY, code})

    return R({steps:'steps'}, 'Bruh');
}
