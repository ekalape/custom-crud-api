console.log("running")
import * as process from 'process';
import * as http from 'http';
import * as url from 'url';
import * as fs from 'fs';


import { User } from './types'
import { EOL } from 'node:os';
import { getSingleUser } from './databaseControllers/getSingleUser';


const PORT = process.env.MAIN_PORT;
const database: User[] = [];
const WRONG_PATH_ERROR = "Wrong api address"


const server = http.createServer((req, res) => {

    if (req.url) {
        const { pathname, query } = url.parse(req.url, true);
        const actPath = pathname?.split("/").filter(Boolean) || [];

        if (actPath[0] && actPath[0] !== "api" || actPath[1] && actPath[1] !== "users") res.write(WRONG_PATH_ERROR)

        else {
            console.log(req.method)

            switch (req.method) {
                case "GET": {
                    if (!actPath[2]) res.write(JSON.stringify(database, null, " "))
                    else getSingleUser(actPath[2])
                    break;
                }
                case "POST": {

                    break;
                }
                case "PUT": {

                    break;
                }
                case "DELETE": {

                    break;
                }
                default: {
                    res.write(WRONG_PATH_ERROR)
                }
            }
        }
        res.end()
    }
})


server.listen(PORT)
console.log(`server is running on port ${PORT}`)

