// export const getSender = (loggedInUser, users) => {
//     // console.log('Logged in', loggedInUser)
//     // console.log("I am checking users array and will give the value of the one who is not loggedIn")
//     // console.log(users);
//     const sender = users.filter((user)=> {
//        return user._id !== loggedInUser._id
//     })[0];
//     // console.log('Sender', sender);
//     return sender.name;
// }



// export const getSenderObjects = (loggedInUser, users) => {
//     // console.log('Logged in', loggedInUser)
//     // console.log("I am checking users array and will give the value of the one who is not loggedIn")
//     // console.log(users);
//     const sender = users.filter((user)=> {
//        return user._id !== loggedInUser._id
//     })[0];
//     // console.log('Sender', sender);
//     return sender;
// }

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};


export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};
export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};
export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export const getSender = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};

export const getSenderObjects = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};