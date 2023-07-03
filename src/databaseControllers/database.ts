import { User } from '../types'
import { DataBaseUser } from '../types'


export default class {
    private database: DataBaseUser[]
    constructor() {
        this.database = []
    }
    get() { return this.database.map(d => ({ id: d.id, ...d.user })) }
    set(user: User) {
        if (this.database.find(d => d.id === user.id)) throw Error("User already exists");
        const { id, username, age, hobbies } = user;
        this.database.push({ id, user: { username, age, hobbies } })
    }
    update(id: string, data: Partial<User>) {
        let oldUser = this.database.find(u => u.id === id)
        if (!oldUser) return null;
        else {
            oldUser.user = { ...oldUser.user, ...data };
            return ({ id, ...oldUser.user })
        }
    }
    delete(id: string) {
        let user = this.database.find(u => u.id === id)
        if (!user) throw Error("No user found");
        else {
            this.database = this.database.filter(u => u.id !== id);
            return { id, ...user.user }
        }
    }



}