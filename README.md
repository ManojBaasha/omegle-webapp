# Chat Application

This is a simple chat application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It allows users to engage in real-time conversations with strangers, similar to Omegle.

## Prerequisites

Before getting started, make sure you have the following software installed on your machine:

- Node.js: https://nodejs.org (v12 or above)
- MongoDB: https://www.mongodb.com (Make sure the MongoDB server is running)

## Features

- Randomly connect users for real-time chat sessions
- Send and receive messages instantly
- Chat history persistence
- User-friendly interface

## Technologies Used
- MongoDB: A NoSQL database used to store chat messages and user information.
- Express.js: A flexible and minimalistic web application framework for building robust APIs.
- React.js: A JavaScript library for building user interfaces.
- Node.js: A JavaScript runtime environment for server-side development.
- Socket.io: A library for real-time bidirectional event-based communication.

## Contributing
Contributions are welcome! If you have any suggestions or improvements, please create a pull request.


### NOTES
MongoDB database format:
There should exist 2 collections - One for chatmessages of all the users and the other should be specific to each user  \[temporary\]

Collection 1: User
User: <name>
Chats:{}
Some more user data

Collection 2: Chatroom
Chatroom_name:
Users:
Last message Time:
