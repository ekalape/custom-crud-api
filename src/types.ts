export interface User {
    id: string;
    username: string;
    age: number;
    hobbies: string[];
}

export interface DataBaseUser {
    id: string;
    user: Omit<User, "id">
}