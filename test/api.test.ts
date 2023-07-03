import { server } from '../src/index'
import { User } from '../src/types'
import { v4 as uuidv4 } from 'uuid';
import request from 'supertest'


describe('Api test', () => {
    let api: any;
    const user1: User = { id: uuidv4(), username: "John", age: 22, hobbies: ["footbal", "icecream"] }
    const user2: User = { id: uuidv4(), username: "Mark", age: 94, hobbies: ["sleeping"] }
    beforeAll(() => {
        api = server;
    })

    afterAll(() => {
        api.close();
    })

    test("Should get empty database", async () => {
        const response1 = await request(api).get("/api/users")
        expect(response1.status).toEqual(200);
        expect(response1.text).toEqual("[]");

    })
    test("Should get all users from database", async () => {
        await request(api).post('/api/users').send(user1);
        await request(api).post('/api/users').send(user2);
        const response2 = await request(api).get("/api/users")
        expect(response2.status).toEqual(200);
        const users = JSON.parse(response2.text)
        expect(users).toHaveLength(2);
    })

    test('Should post a user', async () => {
        const res = await request(api).post('/api/users').send({ username: "Jack", age: 12, hobbies: ["football"] });
        expect(res.statusCode).toEqual(200);
        const result = JSON.parse(res.text)
        expect(result).toHaveProperty('id');
        expect(result.username).toEqual('Jack');
    })
    test('Should get a single user', async () => {
        const response = await request(api).get("/api/users")
        const users = JSON.parse(response.text)
        const id = users[0].id
        const userResponse = await request(api).get(`/api/users/${id}`)
        expect(JSON.parse(userResponse.text)).toEqual(users[0])
    })
    test('Should update a user', async () => {

        const response = await request(api).get("/api/users")
        const users = JSON.parse(response.text)
        const id = users[0].id
        const userResponse = await request(api).put(`/api/users/${id}`).send({ "username": "David" })
        const updatedUser = JSON.parse(userResponse.text)
        expect(updatedUser.id).toEqual(id)
        expect(updatedUser.username).toEqual("David")
        expect(updatedUser.age).toEqual(users[0].age)
    })
    test('Should delete a user', async () => {

        const response = await request(api).get("/api/users")
        const users = JSON.parse(response.text)

        const id = users[0].id
        await request(api).delete(`/api/users/${id}`)
        const userResponse = await request(api).get(`/api/users/${id}`)
        expect(userResponse.status).toBe(404)

    })
})