import { database } from '../index';
import { User } from '../types';

export function deleteUser(id: string) {
    let user: User | null
    try {
        user = database.delete(id)
    } catch (err) {
        throw Error("No user found")
    }
    if (user) return user;
    else return null;
}