import { database } from '../index';
import { User } from '../types';

export function addNewUser(data: User) {
    const { id, username, age, hobbies } = data;
    if (!id || !username || !age || !hobbies) return null;
    //if (typeof age !== "number") return null;
    const user = { ...data }
    console.log("created user")
    database.set(user)
    return user;
}