const users = [];

//adding new users in the array
function userJoin(id, username, room) {
    const user = { id, username, room }
    users.push(user);
    return user;
}

//finding the user with the socket id
function findUser(id) {
    return users.find(user => user.id === id);

}

//deleting and returning the user who leaved the room
function userLeave(id) {
    const index = users.findIndex(user => user.id === id)
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

//returning the user with a specific room
function getUsers(room) {
    return (users.filter(user => user.room === room))
}

module.exports = {
    userJoin,
    findUser,
    userLeave,
    getUsers
}