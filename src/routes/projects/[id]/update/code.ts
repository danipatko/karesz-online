import { updateProject } from '$lib/db/functions/projects';
import { R } from '$lib/util';

export async function post(req:any) {
    const { id } = req.params;
    if(!id) return R(undefined, 'Missing parameter ID from request.', 400);

    const { code, passwd } = req.body;
    if(! (code && passwd)) return R(undefined, 'Missing parameter \'code\' from request.', 400);

    return R(await updateProject(id, passwd, { code, timestamp:new Date()  }), 'Project does not exist, or password is invalid', 401);
}