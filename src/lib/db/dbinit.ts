import * as tables from './tables';
import db from './db';

export const init = async():Promise<void> => {

    if(! await db.databaseExists('karesz'))
        await db.createDatabase('karesz');

    if(! await db.tableExists('karesz', 'project'))
        await db.createTable('karesz', tables.project);
    
}