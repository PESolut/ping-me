# Ping-Me API

This is the backend API for the Ping-Me chat application. It provides endpoints for managing users, chats, and messages.

## API Routes

| Method | Path | Description | Request Body | Response |
|--------|------|-------------|--------------|----------|
| **Users** |
| GET | /api/users | Get all users | - | Array of user objects |
| GET | /api/users/:id | Get a specific user | - | User object |
| POST | /api/users | Create a new user | {username, email, password} | Created user object |
| PUT | /api/users/:id | Update a user | {username, email, password} | Updated user object |
| DELETE | /api/users/:id | Delete a user | - | Deleted user object |
| **Chats** |
| GET | /api/chats | Get all chats | - | Array of chat objects |
| GET | /api/chats/:id | Get a specific chat | - | Chat object with users |
| GET | /api/users/:id/chats | Get all chats for a user | - | Array of chat objects |
| POST | /api/chats | Create a new chat | {name, created_by} | Created chat object |
| PUT | /api/chats/:id | Update a chat | {name} | Updated chat object |
| DELETE | /api/chats/:id | Delete a chat | - | Deleted chat object |
| GET | /api/chats/:id/users | Get all users in a chat | - | Array of user objects |
| POST | /api/chats/:id/users | Add a user to a chat | {user_id} | Added user-chat object |
| DELETE | /api/chats/:id/users/:userId | Remove a user from a chat | - | Removed user-chat object |
| GET | /api/chats/:id/users/:userId | Check if a user is in a chat | - | Boolean |
| GET | /api/users/:id1/common-chats/:id2 | Get common chats for two users | - | Array of chat objects |
| **Messages** |
| GET | /api/messages | Get all messages | - | Array of message objects |
| GET | /api/messages/:id | Get a specific message | - | Message object |
| GET | /api/chats/:id/messages | Get messages for a specific chat | - | Array of message objects |
| POST | /api/messages | Create a new message | {user_id, chat_id, content} | Created message object |
| PUT | /api/messages/:id | Update a message | {content} | Updated message object |
| DELETE | /api/messages/:id | Delete a message | - | Deleted message object |
| **User-Chats** |
| GET | /api/users/:id/chats | Get all chats for a user | - | Array of chat objects |
| GET | /api/chats/:id/users | Get all users in a chat | - | Array of user objects |
| POST | /api/chats/:id/users | Add a user to a chat | {user_id} | Added user-chat object |
| DELETE | /api/chats/:id/users/:userId | Remove a user from a chat | - | Removed user-chat object |
| GET | /api/chats/:id/users/:userId | Check if a user is in a chat | - | Boolean |
| GET | /api/users/:id1/common-chats/:id2 | Get common chats for two users | - | Array of chat objects |


## Authentication

The API uses JSON Web Tokens (JWT) for authentication. To access protected routes, include the JWT in the request header:

```
Authorization: Bearer <your_jwt_token>
```

### Auth Endpoints

- POST /api/users/register: Register a new user
- POST /api/users/login: Login and receive a JWT

### Auth Error Handling

Authentication errors will return appropriate HTTP status codes:

- 401: Unauthorized (invalid or missing token)
- 403: Forbidden (valid token, but insufficient permissions)

## General Error Handling

All endpoints will return appropriate HTTP status codes:

- 200: Successful GET, PUT, or DELETE request
- 201: Successful POST request
- 400: Bad request (e.g., invalid input)
- 401: Unauthorized
- 404: Resource not found
- 500: Server error

Error responses will include a JSON object with an `error` key describing the error.

## Rate Limiting

TBD

## Data Models

### User
- id: Integer (Primary Key)
- username: String
- email: String
- password: String (hashed)
- created_at: Timestamp

### Chat
- id: Integer (Primary Key)
- name: String
- created_by: Integer (Foreign Key to User)
- created_at: Timestamp

### Message
- id: Integer (Primary Key)
- user_id: Integer (Foreign Key to User)
- chat_id: Integer (Foreign Key to Chat)
- content: Text
- created_at: Timestamp

### UserChat (Join Table)
- id: Integer (Primary Key)
- user_id: Integer (Foreign Key to User)
- chat_id: Integer (Foreign Key to Chat)
- joined_at: Timestamp


## Chat Operations

The API provides comprehensive functionality for managing chats:

- **Create/Read/Update/Delete (CRUD) operations**: Basic operations for chat management.
- **Get Chats for User**: Retrieves all chats that a specific user is a member of.
- **Get Users in Chat**: Fetches all users who are members of a specific chat.
- **Add User to Chat**: Allows adding a user to an existing chat.
- **Remove User from Chat**: Enables removing a user from a chat they're a member of.
- **Check User in Chat**: Verifies if a specific user is a member of a given chat.
- **Get Common Chats**: Retrieves all chats that two specified users have in common.

These operations provide granular control over chat management and user-chat relationships, enabling features like creating group chats, inviting users to chats, and finding mutual conversations.

## Additional User-Chat Operations

- **Add User to Chat**: Allows adding a user to an existing chat.
- **Check User in Chat**: Verifies if a specific user is a member of a given chat.
- **Get Common Chats**: Retrieves all chats that two specified users have in common.

These operations provide more granular control over user-chat relationships and enable features like inviting users to chats and finding mutual conversations.

## Setup and Installation

TBD

## Testing

TBD

## Contributing

TBD

## License

TBD
