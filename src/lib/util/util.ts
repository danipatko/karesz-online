import { randomBytes } from 'crypto';
import zlib from 'zlib';

export const compress = (s:string):Buffer => zlib.deflateSync(s);

// export const encrypt = (secret:string):string => createHmac('sha256', secret).update(secret).digest('hex');

// export const randstr = (length:number):string => randomBytes(length/2).toString('hex');

export const R = (data:object, error?:string, status=200) => {
    return data === undefined || data === null || !data ? {
        status: status,
        statusText: error
    } : {
        status: status,
        body: data
    }
}
