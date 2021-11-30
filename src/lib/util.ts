import { createHmac, randomBytes } from 'crypto';

export const encrypt = (secret:string):string => createHmac('sha256', secret).update(secret).digest('hex');

export const randstr = (length:number):string => randomBytes(length/2).toString('hex');

export const R = (data:object, error?:string, status=200) => {
    return data === undefined ? {
        status: status,
        error: {
            description: error
        }
    } : {
        status: status,
        body: data
    }
}