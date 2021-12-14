/*import db from '../db';
import { encrypt, randstr } from '../../util';

export const getProject = async(id:string):Promise<any> => 
    db.parse(await db.get('karesz', 'project', { id:id }), {
        stats:'object',
        steps:'object',
        timestamp:'date'
    });

export const createProject = async(code:string, steps:object, stats:object, passwd:string, readme:'Author did not provide a readme', creator:string='anonym', lang:string='cs'):Promise<any> => {
    // generate ID
    var id = '';
    do id = randstr(10);
    while(await db.recordExists('karesz', 'project', { id:id }));

    await db.createRecord('karesz', 'project', {
        id:id,
        timestamp: new Date(),
        lang:lang,
        creator:creator,
        passwd:encrypt(passwd),
        code:code,
        readme:readme,
        steps:steps,
        stats:stats
    });
    // return newly created
    return await db.get('karesz', 'project', {id:id} );
}

export const updateProject = async(id:string, passwd:string, params:object):Promise<any> => {
    passwd = encrypt(passwd);
    if(! await db.recordExists('karesz', 'project', { id, passwd }))
        return;
    
    await db.updateRecord('karesz', 'project', {id:id, passwd:passwd}, params);
    // return updated one
    return await db.get('karesz', 'project', {id:id});
}*/
export default 0;