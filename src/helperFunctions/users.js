const users = []

// add a new user to the chat room
const addNewUser = ({
    id,
    username,
    chatRoom
}) => {
    // trim username and chat room to make checking easier
    username = username.trim().toLowerCase()
    chatRoom = chatRoom.trim().toLowerCase()

    // define existing username
    const existingUser = users.find((newUser) => {
        if (newUser.chatRoom === chatRoom && newUser.username === username) {
            return true
        } else {
            return false
        }
    })

    // Check that the user is not in the array
    if (existingUser) {
        return {
            error: "This username already exists. Please choose another one."
        }
    } else {

        // Store new user in the array
        const newUser = {
            id,
            username,
            chatRoom
        }
        users.push(newUser)
        return newUser

    }

}


// remove a user when the user leaves the chat room
const removeUser = (id) => {
    const index = users.findIndex(user => {
        return user.id = id
    })

    if (index > -1) {
        return users.splice(index, 1)[0]
    }
}

// get the info of a single user
const getUser = (id) => {
    return users.find(user => user.id === id)
}

// get the list of all users in a chat room
const getAllUsersInTheChatRoom = (chatRoom) => {
    chatRoom = chatRoom.trim().toLowerCase();
    return users.filter(user => user.chatRoom === chatRoom)
}

module.exports = {
    addNewUser,
    removeUser,
    getUser,
    getAllUsersInTheChatRoom
}

// addNewUser({
//     id: 80,
//     username: "ben Ben",
//     chatRoom: "New York"
// })

// addNewUser({
//     id: 90,
//     username: "Mike ",
//     chatRoom: "New York"
// })

// addNewUser({
//     id: 70,
//     username: "ben ben",
//     chatRoom: "Philly"
// })

// // const singleUser = getUser(90)
// // console.log(singleUser)

// console.log(users)
// const userList = getAllUsersInTheChatRoom("Philly")
// console.log(userList)