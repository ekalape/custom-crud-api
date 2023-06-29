import { User } from '../types'


export default class {
    database: User[]
    constructor() {
        this.database = []
    }

    get() { return this.database }
    set(user: User) {
        this.database.push(user)
    }
    getLength() { return this.database.length }

}