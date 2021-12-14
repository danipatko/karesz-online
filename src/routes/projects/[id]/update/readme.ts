/*import { updateProject } from '$lib/db/functions/projects';
import { R } from '$lib/util';

export async function post(req:any) {
    const { id } = req.params;
    if(!id) return R(undefined, 'Missing parameter ID from request.', 400);

    const { readme, passwd } = req.body;
    if(! (readme && passwd)) return R(undefined, 'Missing parameter \'readme\' from request.', 400);

    return R(await updateProject(id, passwd, { readme, timestamp:new Date() }), 'Project does not exist, or password is invalid', 401);
}*/
export default 0;