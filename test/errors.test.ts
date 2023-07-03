import { server } from '../src/index'
import request from 'supertest'


describe('Errors test', () => {
    let api: any;

    beforeAll(() => {
        api = server;

    })
    afterAll((done) => {
        api.close(done);

    })
    test("Should return error message when single user uuid non valid", async () => {
        const response1 = await request(api).get("/api/users/uuid7")
        expect(response1.status).toEqual(400);
    })
    test("Should return error message when single user does not exist", async () => {
        const response1 = await request(api).get("/api/users/30230b0e-7519-4919-9f68-b4eff00431d7")
        expect(response1.status).toEqual(404);
    })
    test("Should return error message when try to get a user and single user already exists", async () => {
        await request(api).post('/api/users').send({ username: "Jack", age: 12, hobbies: ["football"] });
        const response = await request(api).get("/api/users");
        const users = JSON.parse(response.text)
        const id = users[0].id
        const doubleRequest = await request(api).post('/api/users').send({ id, username: "Jack", age: 12, hobbies: ["football"] });
        expect(doubleRequest.status).toBe(400)
    })
    test("Should return error message when try to update unexistent user", async () => {

        const updateRequest = await request(api).put('/api/users/30230b0e-7519-4919-9f68-b4eff00431d7').send({ age: 44 });
        expect(updateRequest.status).toBe(404)
    })
    test("Should return error message when try to delete unexistent user", async () => {

        const deleteRequest = await request(api).delete('/api/users/30230b0e-7519-4919-9f68-b4eff00431d7');
        expect(deleteRequest.status).toBe(404)
    })
})