console.log("running")
import * as process from 'process';
import * as http from 'http';
import * as url from 'url';
import * as fs from 'fs';


import { User } from './types'
import { EOL } from 'node:os';
import * as constants from './utils/constants'
import { getSingleUser } from './databaseControllers/getSingleUser';
import Database from './databaseControllers/database'
import { addNewUser } from './databaseControllers/addNewUser';


const PORT = process.env.MAIN_PORT;


export const database = new Database()

const server = http.createServer((req, res) => {
    console.log("req.url", req.url)
    if (req.url) {
        const { pathname } = url.parse(req.url, true);
        const actPath = pathname?.split("/").filter(Boolean) || [];

        if (actPath.length === 0 || actPath[0] !== constants.API_BASE_NAME || actPath[1] !== constants.API_USERS_ENDPOINT) res.write(constants.WRONG_PATH_ERROR)

        else {
            console.log(req.method)

            switch (req.method) {
                case "GET": {
                    if (!actPath[2]) res.end(JSON.stringify(database.get(), null, " "))
                    else {
                        const user = getSingleUser(actPath[2])
                        if (user) res.end(JSON.stringify(user, null, " "))
                        else res.end(constants.NO_USER_ERROR)
                    }
                    break;
                }
                case "POST": {
                    let user = "";
                    let result;
                    req.on("data", (data) => {
                        console.log("data>>", data)
                        user += data
                    })
                    req.on("end", () => {
                        console.log(user)
                        const u: User = JSON.parse(user)
                        u.id = database.getLength() > 0 ? database.getLength() + 1 : 1;
                        console.log("u >>> ", u)
                        result = addNewUser(u);
                        console.log(result)
                        if (result) res.end(JSON.stringify(result, null, " "));
                        else res.end(constants.USER_FIELDS_ERROR)
                    })



                    break;
                }
                case "PUT": {

                    break;
                }
                case "DELETE": {

                    break;
                }
                default: {
                    res.write(constants.WRONG_PATH_ERROR)
                }
            }
        }

    }
})


server.listen(PORT)
console.log(`server is running on port ${PORT}`)

