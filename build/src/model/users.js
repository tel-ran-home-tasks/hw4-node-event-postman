let users = [{ id: 1, userName: "Bond" }];
export const getAllUsers = () => [...users];
export const addUser = (user) => {
    if (users.findIndex(elem => elem.id === user.id) !== -1)
        return false;
    users.push(user);
    return true;
};
export const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id);
    if (index === -1)
        return null;
    const deletedUser = users[index];
    users = users.filter(user => user.id !== id);
    return deletedUser;
};
export const updateUser = (newUserData) => {
    const index = users.findIndex(user => user.id === newUserData.id);
    if (index === -1)
        return false;
    users[index] = newUserData;
    return true;
};
export const getUser = (userId) => {
    const user = users.find(user => user.id === userId);
    return user || null;
};
