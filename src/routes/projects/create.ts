import { createProject } from '$lib/db/functions/projects';
import { R } from '$lib/util';

// English characters & atleast 3 characters
const validatePassword = (s:string):boolean =>
    s.match(/[a-zA-z0-9\.]{3,50}/gm) ? true : false;

export async function post(req:any) {
    const { id } = req.params;
    if(!id) return R(undefined, 'Missing parameter ID from request.', 400);

    const { code, readme, passwd, creator, lang } = req.body;
    if(! (code && passwd && validatePassword(passwd) && lang)) return R(undefined, 'Missing parameter \'readme\' from request.', 400);

    return R(await createProject(code, [], {}, passwd, readme, creator, lang), 'Project was not created', 404);
}