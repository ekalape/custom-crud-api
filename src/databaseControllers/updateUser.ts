import { database } from '../index';
import { User } from '../types';

export function updateUser(userid: string, data: string) {

    let userdata: Partial<User> | null = null;
    try {
        userdata = JSON.parse(data);
    } catch (err) {
        throw Error("Parsing error")
    }
    if (userdata) {
        return database.update(userid, userdata);
    }

    return null
}