import { database } from '../index';

export function getSingleUser(id: string) {

    const user = database.get().find(d => d.id === id);
    return user;
}