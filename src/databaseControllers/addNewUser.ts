import { database } from '../index';
import { User } from '../types';
import { v4 as uuidv4 } from 'uuid';

export function addNewUser(data: string) {
    let userdata: User | null = null;
    try {
        userdata = JSON.parse(data)
    } catch (err) {
        throw Error("Parsing error")
    }
    if (userdata) {
        userdata.id = uuidv4()
        const { username, age, hobbies } = userdata;
        if (!username || !age || !hobbies) return null;

        const user = { ...userdata }
        console.log("created user")
        database.set(user)
        return user;
    }
    return null;
}