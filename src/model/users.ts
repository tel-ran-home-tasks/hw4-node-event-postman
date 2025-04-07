export type User = {
    id: number;
    userName: string;
}

let users: User[] = [{id: 1, userName: "Bond"}];

export const getAllUsers = () => [...users];
export const addUser = (user: User): boolean => {
    if (users.findIndex(elem => elem.id === user.id) !== -1)
        return false;
    users.push(user);
    return true;
}

export const removeUser = (id: number): User | null => {
    const index = users.findIndex(user => user.id === id);
    if (index === -1) return null;
    const deletedUser = users[index];
    users = users.filter(user => user.id !== id);
    return deletedUser;
}

export const updateUser = (newUserData: User): boolean => {
    const index = users.findIndex(user => user.id === newUserData.id);
    if (index === -1) return false;
    users[index] = newUserData;
    return true;
}

export const getUser = (userId: number): User | null => {
    const user = users.find(user => user.id === userId);
    return user || null;
}