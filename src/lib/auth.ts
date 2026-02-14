
import fs from 'fs';
import path from 'path';

const usersLayout = path.join(process.cwd(), 'src/data/users.json');

export interface User {
    id: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    createdAt: string;
}

export function getUsers(): User[] {
    if (!fs.existsSync(usersLayout)) return [];
    const file = fs.readFileSync(usersLayout, 'utf8');
    try {
        return JSON.parse(file);
    } catch {
        return [];
    }
}

export function saveUser(user: User) {
    const users = getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);

    if (existingIndex > -1) {
        users[existingIndex] = user;
    } else {
        users.push(user);
    }

    fs.writeFileSync(usersLayout, JSON.stringify(users, null, 2));
}
