// import { getProject } from '$lib/db/functions/projects';
import { R } from '$lib/util';

export async function get(req:any) {
    const { id } = req.params;
    if(! id) return R(undefined, 'Missing ID request parameter', 404);

    return R({foo:'bar'}, 'Project not found.', 404);
}