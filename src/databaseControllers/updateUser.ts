import { database } from '../index';
import { User } from '../types';

export function updateUser(userid: string, data: string) {

    let userdata: User | null = null;
    try {
        userdata = JSON.parse(data);
    } catch (err) {
        throw Error("Parsing error")
    }
    if (userdata) {
        console.log("userid", userid)
        database.get().forEach(x => console.log(x.id));
        return database.update(userid, userdata);
    }

    return null
}