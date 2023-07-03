import { database, server } from '../src/index'
import { DataBaseUser, User } from '../src/types'
import Database from '../src/databaseControllers/database'


describe('Api test', () => {
    let api: any;
    let db: Database;
    const user: User = { id: "3", username: "John", age: 22, hobbies: ["footbal", "icecream"] }
    const user3UpdateData: Partial<User> = { username: "Jack" }
    beforeAll(() => {
        db = new Database()
        api = server;

    })
    afterAll((done) => {
        server.close(done);
    });

    test("Should return empty database", () => {
        const data = db.get()
        expect(data).toEqual([])
    })
    test("Should create a user", () => {
        db.set(user)
        const data = db.get()
        expect(data).toEqual([user])
    })
    test("Should update a user", () => {
        db.update("3", user3UpdateData)
        const data = db.get()
        const newUser: User = { ...user, ...user3UpdateData }
        expect(data).toEqual([newUser])
        const updated = db.update("5", user3UpdateData);
        expect(updated).toBeNull;
    })
    test("Should delete the user", () => {
        db.delete("3")
        const data = db.get()
        expect(data).toEqual([]);

        expect(() => db.delete("fff")).toThrow("No user found")

    })

})