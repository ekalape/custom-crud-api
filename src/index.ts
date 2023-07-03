import * as process from 'process';
import * as http from 'http';
import * as url from 'url';
import { User } from './types'
import * as constants from './utils/constants'
import { getSingleUser } from './databaseControllers/getSingleUser';
import Database from './databaseControllers/database'
import { addNewUser } from './databaseControllers/addNewUser';
import { updateUser } from './databaseControllers/updateUser';
import { deleteUser } from './databaseControllers/deleteUser';
import { validate as uuidValidate } from 'uuid';

const PORT = process.env.MAIN_PORT;


export const database = new Database()

export const server = http.createServer((req, res) => {
    try {

        if (req.url) {
            const { pathname } = url.parse(req.url, true);
            const actPath = pathname?.split("/").filter(Boolean) || [];

            if (actPath.length === 0 || actPath[0] !== constants.API_BASE_NAME || actPath[1] !== constants.API_USERS_ENDPOINT) res.write(constants.WRONG_PATH_ERROR)

            else {

                switch (req.method) {
                    case "GET": {
                        if (!actPath[2]) {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json')
                            res.end(JSON.stringify(database.get(), null, " "))

                        }
                        else {
                            if (!uuidValidate(actPath[2])) {
                                res.statusCode = 400;
                                res.end(constants.WRONG_UUID)
                            }
                            else {

                                const user = getSingleUser(actPath[2])
                                if (user) {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json')
                                    res.end(JSON.stringify(user, null, " "))
                                }
                                else {
                                    res.statusCode = 404;
                                    res.end(constants.NO_USER_ERROR)
                                }
                            }
                        }
                        break;
                    }
                    case "POST": {
                        let body = "";
                        let result: User | null;
                        req.on("data", (data) => {
                            body += data
                        })
                        req.on("end", () => {
                            try {
                                result = addNewUser(body);
                                if (result) {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json')
                                    res.end(JSON.stringify(result, null, " "));
                                }
                                else {
                                    res.statusCode = 400;
                                    res.end(constants.USER_FIELDS_ERROR)
                                }
                            } catch (err) {
                                res.statusCode = 400;
                                res.end(constants.WRONG_REQUEST_ERROR)
                            }

                        })
                        break;
                    }
                    case "PUT": {
                        if (!actPath[2]) {
                            res.statusCode = 400;
                            res.end(constants.NO_USER_ID_ERROR)
                        }
                        else {
                            if (!uuidValidate(actPath[2])) {
                                res.statusCode = 400;
                                res.end(constants.WRONG_UUID)
                            } else {
                                const userid = actPath[2];
                                let body = ""
                                req.on("data", (data) => {
                                    body += data
                                })
                                req.on("end", () => {
                                    const result = updateUser(userid, body);
                                    if (result) {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json')
                                        res.end(JSON.stringify(result, null, " "))
                                    }
                                    else {
                                        res.statusCode = 404;
                                        res.end(constants.NO_USER_ERROR)
                                    }
                                })
                            }
                        }
                        break;
                    }
                    case "DELETE": {
                        if (!actPath[2]) res.end(constants.NO_USER_ID_ERROR);
                        else {
                            if (!uuidValidate(actPath[2])) {
                                res.statusCode = 400;
                                res.end(constants.WRONG_UUID)
                            } else {

                                try {
                                    const user = deleteUser(actPath[2])
                                    if (user) {
                                        res.statusCode = 204;
                                        res.setHeader('Content-Type', 'application/json')
                                        res.end(JSON.stringify(user, null, " "))
                                    }
                                } catch (err) {
                                    res.statusCode = 404;
                                    res.end(constants.NO_USER_ERROR)
                                }
                            }
                        }
                        break;
                    }
                    default: {
                        res.end(constants.WRONG_PATH_ERROR)
                    }
                }
            }
        }
    } catch (err) {
        res.statusCode = 500;
        res.end("Server error")
    }
})


server.listen(PORT)


