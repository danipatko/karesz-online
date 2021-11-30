import mysql from 'mysql';
import util from 'util';

// WIPE: DROP DATABASE karesz

// init
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'
const connection = mysql.createConnection( {
    multipleStatements: true,
    port: import.meta.env.VITE_DATABASE_PORT,
    host: import.meta.env.VITE_DATABASE_HOSTNAME,
    user: import.meta.env.VITE_DATABASE_USER,
    password: import.meta.env.VITE_DATABASE_PASSWORD
}); 

connection.connect();
console.log('[db] Connected!');

// make connection.query function a promise 
const Q = util.promisify(connection.query).bind(connection);

/**
 * Execute MySQL query directly with no return packet formatting
 * @param {Number} query 
 */
const EXECUTE = async (query):Promise<Array<object>> => {
    return new Promise<Array<object>>(async res => {
        res( await Q(query) );
    });
}
/**
 * Create MySQL timestap from js Date.toLocaleString()
 */
const now = ():string => {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
}
/**
 * Convert JS date object to MySQL timestamp string
 */
const time = (datetime:Date):string => {
    return datetime.toISOString().slice(0, 19).replace('T', ' ');
}
/**
 * Escape a string to prevent SQL injection attacks
 * @param {*} s input
 */
const esc = (s: any):string => {
    return connection.escape(s);
}
/**
 * Format MySQL return packet to an array of rows
 * @param {*} SQLReturnPacket 
 * @returns array of rows - undefined if query didn't return any
 */
const getRows = (SQLReturnPacket:Array<any>):Array<any> => {
    // console.log('===============');
    // console.log(SQLReturnPacket);
    // console.log('===============');
    // remove OKpacket part
    return SQLReturnPacket.length == 2 ?    // Packet consists of an OkPacket (at 0) and an array of results 
        SQLReturnPacket[1].length ? 
            SQLReturnPacket[1] : 
            undefined : 
        SQLReturnPacket.filter(x => x.constructor.name != 'OkPacket');
}

/**
 * @param {*} database The database to execute the query on
 * @param {*} query The MySQL query
 * @returns an array of rows
 */
const execute = async(database:string, query:string):Promise<Array<object>> => { 
    return new Promise<Array<object>>(async res => {
        // log
        console.log(`[db] Executing query on ${database} : "${query}";`);
        // format & return
        res( getRows( await Q(`USE ${database}; ${query};`) ) );
    });
}

const count = async(database:string, table:string, selector:object):Promise<number> => {
    const result = (await execute(database, `SELECT COUNT(*) AS result FROM ${table} WHERE ${selectorString(table, selector)}`))[0];
    return result['result'];
}

/**
 * Parse values such as dates and json objects from SQL format to JS comaptible
 * @param SQLReturnPacket The packet to parse 
 * @param toParse object: keys name must match SQL column name, and it's value is the type to parse to
 */
 const parse = (SQLReturnPacket:object, toParse:object):any => {
    for(const key in toParse) {
        // if the return packet does not contain the key, simply pass
        if(SQLReturnPacket[key] === undefined || SQLReturnPacket[key] === null) continue;

        switch(toParse[key]) {
            case 'date': 
                SQLReturnPacket[key] = new Date(SQLReturnPacket[key]);
                break;
            case 'object':
                SQLReturnPacket[key] = JSON.parse(SQLReturnPacket[key]);
                break;
            case 'bool':
                SQLReturnPacket[key] = SQLReturnPacket[key] ? true : false;
                break;
        }
    }
    return SQLReturnPacket;
}

/**
 * Parse multiselect statement return queries
 */
const multiSelectParse = (SQLReturnPacket:any, toParse:object):any => {
    for (let i = 0; i < SQLReturnPacket.length; i++) 
        SQLReturnPacket = parse(SQLReturnPacket, toParse);
    return SQLReturnPacket;
}

/**
 * Generate a selector string from arguements object
 */
const selectorString = (table:string, args:object, logic='AND'):string => {
    const query:Array<string> = [];
    for(const k in args)
        query.push(`${table}.${k}=${esc(args[k])}`);
    return query.join(` ${logic} `);
}
/**
 * Get one or multiple records from database
 * @param limit specify the number of records to be returned
 * @param fields what fields to return (if not specified, selects *)
 * @returns array of rows
 */
const get = async(database:string, table:string, selector:object, ...fields:Array<string>):Promise<any> => {
    return (await execute(database,`
        SELECT ${fields.length?fields.join(','):'*'}
        FROM ${table} 
        WHERE ${selectorString(table, selector)} 
        LIMIT 1
    `))[0];
}
/**
 * Check if item exists in database
 * @param args object - keys are field names and values
 * @returns {boolean} true if item is present in DB
 */
const recordExists = async(database:string, table:string, args:object, logic?:string):Promise<boolean> =>
    ((await execute(database,`SELECT EXISTS(SELECT * FROM ${table} WHERE ${selectorString(table, args, logic)}) AS result`))[0])['result'];

/**
 * Stringify object to MySQL compatible value
 */
const skip = (value:any):any => {
    if(value === undefined || value === null)
        return;
    if (value.constructor == Date)
        return time(value);
    if(value.constructor == Object || value.constructor == Array || typeof value == 'object')
        return JSON.stringify(value);
    
    return value;
}
/**
 * Create a record in the databaes
 * @param data The interface object to create in database
 * @param preventDuplicate array of keys to look up before creating
 * @returns {boolean} true if the object has been successfully created
 */
const createRecord = async(database:string, table:string, data:object):Promise<void> => {
    const keys = [];
    const values = [];
    
    for(const k in data){
        // push into array, then join
        keys.push(k);
        values.push(esc(skip(data[k])));
    }
    // execute
    await execute(database, `INSERT INTO ${table} (${keys.join(',')}) VALUES (${values.join(',')})`);
}
/**
 * Check if database exists on MySQL server
 * @returns {boolean}
 */
const databaseExists = async(dbName:string):Promise<boolean> => {
    return (await EXECUTE(`SHOW DATABASES LIKE ${esc(dbName)};`)).length != 0;
}
/**
 * Check if table is present in database
 * @returns {boolean}
 */
const tableExists = async(database:string, tableName:string):Promise<boolean> => {
    return undefined !== await execute(database, `SHOW TABLES LIKE ${esc(tableName)}`);
}
/**
 * Create a table in database
 * @param tableName 
 */
const createTable = async(database:string, table:string):Promise<void> => {
    await execute(database,` CREATE TABLE ${table}`);
}
/**
 * Create a table in database
 * @param dbName 
 */
const createDatabase = async(dbName:string):Promise<void> => {
    await EXECUTE(`CREATE DATABASE ${dbName};`);
}
/**
 * Generate a safe string from array of values separated by a comma
 */
const alterString = (args:object):string => {
    const query:Array<string> = [];
    for(const k in args)
        query.push(`${k}=${esc(args[k])}`);
    return query.join(',');
}
/**
 * Update a record in the database. 
 * @param selectors -> can only be ID & more
 * @param updateArgs Stuff to change
 */
const updateRecord = async(database:string, table:string, selectors:object, updateArgs:object):Promise<any> => {
    return await execute(database, `UPDATE ${table} SET ${alterString(updateArgs)} WHERE ${selectorString(table, selectors)}`);
}

/**
 * Select and delete records
 */
const deleteRecords = async(database:string, table:string, selector:object):Promise<void> => {
    await execute(database, `
        DELETE FROM ${table} WHERE ${selectorString(table, selector)} 
    `);
}

export default { execute, EXECUTE, get, esc, now, time, parse, multiSelectParse, count, recordExists, databaseExists, tableExists, createRecord, createDatabase, createTable, selectorString, alterString, updateRecord, deleteRecords };