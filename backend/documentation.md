# Backend Documentation

## 1. Introduction

The key purpose of this node app is to create an Node API's for Ecommerce Website.

## 2. Dependencies 

```json
{
  "node": "v20.5.1",
  "npm": "10.2.0",
  "bcrypt": "^5.1.1",
  "bcryptjs": "^2.4.3",
  "cookie-session": "^2.0.0",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "express": "^4.18.2",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.0.0"
}
```

## 3. Installation

```bash
# Clone the repository
git clone git@github.com:AyeshaAshfaq12/E-Commerce_Web_App.git

# Navigate to the project directory
cd backend

# Install dependencies
npm install
```

## 4.Project Structure

```forth
- backend/
  - controllers/
    - users.js
  - database/
    - conn.js
  - middleware/
    - authorization.js
    - error-handler.js
    - not-found.js
    - verifySignUp.js
  - models/
  - routes/
    - users.js
  - utils/
    - helper.js
  - index.js
- node_modules/
- public/
- package-lock.json
- package.json
```

## 5. Configuration

### `index.js`: Main Server Configuration

The `index.js` file is the main entry point for your Node.js application, responsible for configuring the server, setting up middleware, defining routes, and initiating the server.

#### Configuration Variables

Before exploring the `index.js` file, it's essential to familiarize yourself with the critical environment variables stored in the `.env` file at the project's root.

1. **PORT:**
   
   - *Description:* The port on which the server will listen.
   - *Usage:* Specifies the port where the Node.js server will accept incoming connections.
   
2. **URI:**
   - *Description:* The MongoDB connection URI.
   - *Usage:* Defines the connection string to the MongoDB database.

3. **COOKIESESSION:**
   - *Description:* A key used for cookie session encryption.
   - *Usage:* Employed to enhance security when managing user sessions using cookies.

   ```javascript
   app.use(
     cookieSession({
       name: "session",
       keys: [process.env.COOKIESESSION],
       httpOnly: true,
     })
   );
   ```
   
4. **SECRET:**
   - *Description:* A secret key used for JWT (JSON Web Token) functions.
   - *Usage:* Employed in `authorization.js` for authentication purposes.

   ```javascript
   // authorization.js
   const jwt = require("jsonwebtoken");
   const secret = process.env.SECRET;
   ```

#### `index.js` Configuration

1. **Load Environment Variables:**
   - Utilize `dotenv` to load configuration variables from the `.env` file.

2. **Import Modules:**
   - Import necessary modules like `express`, `body-parser`, `jwt`, `cors`, and `cookie-session`.

3. **Establish Database Connection:**
   - Connect to the MongoDB database using `require("./database/connect")`.

4. **Implement Authorization Middleware:**
   - Include authorization middleware through `require("./middleware/authorization")`.

5. **Import Routes:**
   - Import routes for handling user-related requests (`usersRouter`).

6. **Middleware Setup:**
   - Configure middleware for JSON parsing, CORS, and secure cookie sessions.

7. **Application Port Setup:**
   - Define the application port using `app.set("port", process.env.PORT)`.

8. **Route Handling:**
   - Direct requests prefixed with "/api" to the `usersRouter`.

9. **Not Found and Error Handling Middleware:**
   - Implement middleware to handle 404 Not Found and other application errors.

10. **Start the Server:**
    - Initiate the server on the specified port.

## 6. Database

The `conn.js` file manages the setup of the database connection for the Node.js application. This module uses the `mongoose` library, an Object-Document Mapper (ODM) for MongoDB and ensures that the application can interact seamlessly with the underlying database.

## 6. Database

The `conn.js` file manages the MongoDB database connection for the Node.js application.

#### 1. Import Modules:

- **dotenv:** Loads environment variables securely from a `.env` file.
- **mongoose:** MongoDB ODM library for Node.js.

#### 2. Read Database URI:

- **URI:** Retrieve MongoDB connection URI from environment variables.
- **Console Output:** Log URI for debugging.

#### 3. Connect to Database:

- **mongoose.connect:** Establish connection with MongoDB using specified URI.
- **Options:** 
  - `useNewUrlParser`: Ensure usage of the new URL parser.
  - `useUnifiedTopology`: Enable the new unified topology engine.

#### 4. Handle Connection Events:

- **db.on("error"):** Listen for connection errors and log if encountered.
- **db.once("open"):** Log success message upon successful connection.

## 7.Middleware

### `authorization.js`

The `authorization.js` middleware is responsible for user authentication and role-based authorization. It employs JSON Web Tokens (JWT) to validate and decode tokens provided in the request headers. The `validateToken` function checks for the existence of a token, verifies its authenticity using the provided secret, and attaches the decoded user information to the request object. The `requireRoles` function further ensures that the user possesses the necessary roles to access protected routes. If authentication or authorization fails, appropriate error messages are returned.

### `error-handler.js`

The `error-handler.js` middleware is a generic error-handling middleware. It catches any errors that occur during the request processing pipeline and responds with a 500 Internal Server Error along with a generic error message. This middleware helps centralize error handling and ensures consistent responses for unexpected issues.

### `not-found.js`

The `not-found.js` middleware is a simple middleware that handles requests for non-existent routes. When a route is not found, it responds with a 404 Not Found status and a message indicating that the requested route does not exist. This middleware is useful for providing a clear response when users attempt to access undefined endpoints.

### `verifySignUp.js`

The `verifySignUp.js` middleware focuses on user signup verification. The `checkDuplicateUsernameOrEmail` function checks whether the provided email address is already associated with an existing user. If a duplicate is found, it returns a 400 Bad Request status with a message indicating that the email is already in use. This middleware ensures the uniqueness of email addresses during the user registration process.

## 8. Utils Documentation

The `utils` module serves as a collection of utility functions  within the application. It encapsulates common functionalities that assist in different potion of applications.

| Function           | Purpose                                                      | Input                                                        | Output                                              | Usage Example                                                | API  |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | --------------------------------------------------- | ------------------------------------------------------------ | ---- |
| `hashPassword`     | Hashes a plain-text password for secure storage.             | `password`: Plain-text password                              | `hashedPassword`: Hashed password                   | `const hashedPassword = await hashPassword("user123");`      | User |
| `comparePasswords` | Compares a user-entered password with a hashed password to validate authenticity. | `enteredPassword`: User-entered password, `hashedPassword`: Hashed password | `isMatch`: Boolean indicating password match or not | `const isMatch = await comparePasswords("user123", hashedPassword);` | User |
| `roles`            | An array defining user roles in the application.             | None                                                         | Array of roles (`["user", "admin", "moderator"]`)   | `const availableRoles = roles;`                              | User |

## 9. API's

### User API

## API Documentation

### Overview

This API provides functionality for user management, including user creation, updating, retrieval, and deletion. It supports user authentication and authorization, allowing different roles like Admin, Store Operator, and Customer.

### User Controller

#### `loginUser`

- **Endpoint:** `/login`
- **Method:** POST
- **Description:** Authenticates a user and generates a JWT token for authorization.
- **Request Body:**
  ```json
  {
    "emailAddress": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Login successful",
    "email": "user@example.com",
    "fullname": "John Doe",
    "userid": "123",
    "token": "generated_token_here"
  }
  ```

#### `logoutUser`

- **Endpoint:** `/logout`
- **Method:** POST
- **Description:** Logs out the authenticated user.
- **Response:**
  ```json
  {
    "message": "You've been signed out!"
  }
  ```

#### `createUser`

- **Endpoint:** `/users`
- **Method:** POST
- **Description:** Creates a new user.
- **Request Body:**
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "DOB": "1990-01-01",
    "role": "Customer",
    "emailAddress": "john.doe@example.com",
    "password": "secure_password"
  }
  ```
- **Response:**
  ```json
  {
    "userId": "456",
    "firstName": "John",
    "lastName": "Doe",
    "role": "Customer",
    "emailAddress": "john.doe@example.com",
    "isVerified": false,
    "createdAt": "timestamp_here",
    "updatedAt": "timestamp_here"
  }
  ```

#### `updateUser`

- **Endpoint:** `/users/:id`
- **Method:** PUT
- **Description:** Updates user information.
- **Request Body:**
  ```json
  {
    "emailAddress": "john.doe.updated@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "userId": "456",
    "firstName": "John",
    "lastName": "Doe",
    "role": "Customer",
    "emailAddress": "john.doe.updated@example.com",
    "isVerified": false,
    "createdAt": "timestamp_here",
    "updatedAt": "timestamp_here"
  }
  ```

#### `getAllUsers`

- **Endpoint:** `/users`
- **Method:** GET
- **Description:** Retrieves all users.
- **Response:**
  ```json
  [
    {
      "userId": "123",
      "firstName": "John",
      "lastName": "Doe",
      "role": "Admin",
      "emailAddress": "john.doe@example.com",
      "isVerified": true,
      "createdAt": "timestamp_here",
      "updatedAt": "timestamp_here"
    },
    // Other users...
  ]
  ```

#### `getUserById`

- **Endpoint:** `/users/:id`
- **Method:** GET
- **Description:** Retrieves a specific user by ID.
- **Response:**
  ```json
  {
    "userId": "123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "Admin",
    "emailAddress": "john.doe@example.com",
    "isVerified": true,
    "createdAt": "timestamp_here",
    "updatedAt": "timestamp_here"
  }
  ```

#### `deleteUser`

- **Endpoint:** `/users/:id`
- **Method:** DELETE
- **Description:** Deletes a user by ID.
- **Response:**
  ```json
  {
    "message": "User deleted successfully",
    "deletedUser": {
      "userId": "123",
      "firstName": "John",
      "lastName": "Doe",
      "role": "Admin",
      "emailAddress": "john.doe@example.com",
      "isVerified": true,
      "createdAt": "timestamp_here",
      "updatedAt": "timestamp_here"
    }
  }
  ```

### User Routes

#### `POST /users`

- **Description:** Creates a new user.
- **Authorization:** Requires an Admin role.
- **Request Body:** See `createUser` documentation.

#### `GET /users`

- **Description:** Retrieves all users.
- **Authorization:** Requires either an Admin or Store Operator role.
- **Response:** See `getAllUsers` documentation.

#### `GET /users/:id`

- **Description:** Retrieves a specific user by ID.
- **Authorization:** Requires either an Admin or Store Operator role.
- **Response:** See `getUserById` documentation.

#### `PUT /users/:id`

- **Description:** Updates user information.
- **Authorization:** Requires an Admin role.
- **Request Body:** See `updateUser` documentation.
- **Response:** See `updateUser` documentation.

#### `DELETE /users/:id`

- **Description:** Deletes a user by ID.
- **Authorization:** Requires an Admin role.
- **Response:** See `deleteUser` documentation.

#### `POST /login`

- **Description:** Authenticates a user and generates a JWT token.
- **Request Body:** See `loginUser` documentation.
- **Response:** See `loginUser` documentation.

#### `POST /logout`

- **Description:** Logs out the authenticated user.

## 10. Testing

In the testing phase, Postman was employed as the primary tool to systematically validate the functionality of the API endpoints. Various test cases were designed to cover different scenarios, ensuring comprehensive coverage of the application's features. 

### Test Case Notes:

1. Setting Global Variables `{token}` and `{port}`	

### User API

#### 1. **Test Case: Retrieve All Users Information**
   - **Endpoint:** `/api/users`
   - **Method:** GET
   - **Description:** Retrieve information of all Users
   - **Expected Output:**
     ```json
     [
         {
             "_id": "6548be4ae4b0bbf1e1437eb1",
             "firstName": "John",
             "lastName": "Doe",
             "DOB": "1990-01-01T00:00:00.000Z",
             "role": "Admin",
             "emailAddress": "admin@example.com",
             "password": "$2b$10$cxVQhm5NfVQFgiy9.2yMcORO1AX1qFFyxcr8P3Ok0xeJlrR6Her3u",
             "isVerified": true,
             "createdAt": "2023-11-06T10:22:02.765Z",
             "updatedAt": "2023-11-06T10:22:02.765Z",
             "__v": 0
         },
         {
             "_id": "654cf3ac2b73baaa57882ec1",
             "firstName": "Subhan1",
             "lastName": "Suleman123",
             "DOB": "1990-01-01T00:00:00.000Z",
             "role": "Store Operator",
             "emailAddress": "Store_Operator@example.com",
             "password": "$2b$10$fMpN9H/wxaU.0YLhoRECs.AqYTb4N5jKcrT.igrdUsBOk40uWr6d.",
             "isVerified": true,
             "createdAt": "2023-11-09T14:58:52.753Z",
             "updatedAt": "2023-11-10T15:03:23.432Z",
             "__v": 0
         },
         {
             "_id": "654cf5152b73baaa57882ec4",
             "firstName": "John",
             "lastName": "Doe",
             "DOB": "1990-01-01T00:00:00.000Z",
             "role": "Store Operator",
             "emailAddress": "Store_Operator1@example.com",
             "password": "$2b$10$lYRqw9QEeIYesPPq2/QqduffIRh6A3SNrvwrnzd24ipepUzmBYC2i",
             "isVerified": true,
             "createdAt": "2023-11-09T15:04:53.959Z",
             "updatedAt": "2023-11-09T15:04:53.959Z",
             "__v": 0
         },
         {
             "_id": "654cffe54a00e3776c0755d2",
             "firstName": "John",
             "lastName": "Doe",
             "DOB": "1990-01-01T00:00:00.000Z",
             "role": "Store Operator",
             "emailAddress": "Admin123456@example.com",
             "password": "$2b$10$6UozawfYgF5j/bd1SWHzLuzm3jNv2qjbZ5xXQsk5hFNrp/SnN.S5u",
             "isVerified": true,
             "createdAt": "2023-11-09T15:51:01.954Z",
             "updatedAt": "2023-11-09T15:51:01.954Z",
             "__v": 0
         },
         {
             "_id": "654cfff64a00e3776c0755d6",
             "firstName": "John",
             "lastName": "Doe",
             "DOB": "1990-01-01T00:00:00.000Z",
             "role": "Store Operator",
             "emailAddress": "admin123456@example.com",
             "password": "$2b$10$cX7wH7OJYoTzn6mOh4uh5ukfbDUeg3rVCKnNEG/SzHzHuVowgwlD2",
             "isVerified": true,
             "createdAt": "2023-11-09T15:51:18.635Z",
             "updatedAt": "2023-11-09T15:51:18.635Z",
             "__v": 0
         },
         {
             "_id": "654d0322423f6ca2f1cbdfff",
             "firstName": "John",
             "lastName": "Doe",
             "DOB": "1990-01-01T00:00:00.000Z",
             "role": "Store Operator",
             "emailAddress": "ali@example.com",
             "password": "$2b$10$mgS0Rl1vyruz8qis3oIqyOutWNRFJJdSxRRNubVmdfmGAw3OuO4i.",
             "isVerified": true,
             "createdAt": "2023-11-09T16:04:50.253Z",
             "updatedAt": "2023-11-09T16:04:50.253Z",
             "__v": 0
         }
     ]
     ```
   - **Postman Output:**
     ![image-20231115123700146](C:\Users\Subhan\AppData\Roaming\Typora\typora-user-images\image-20231115123700146.png)

#### 2. **Test Case: Retrieve User Information**

   - **Endpoint:** `/api/users/:userId`

   - **Method:** GET

   - **Description:** Retrieve information of all Users

   - **Expected Output:**

     ```json
     {
             "_id": "6548be4ae4b0bbf1e1437eb1",
             "firstName": "John",
             "lastName": "Doe",
             "DOB": "1990-01-01T00:00:00.000Z",
             "role": "Admin",
             "emailAddress": "admin@example.com",
             "password": "$2b$10$cxVQhm5NfVQFgiy9.2yMcORO1AX1qFFyxcr8P3Ok0xeJlrR6Her3u",
             "isVerified": true,
             "createdAt": "2023-11-06T10:22:02.765Z",
             "updatedAt": "2023-11-06T10:22:02.765Z",
             "__v": 0
     },
     ```

   - **Postman Output:**
     ![image-20231115123700146](C:\Users\Subhan\AppData\Roaming\Typora\typora-user-images\image-20231115123700146.png)

#### 3. **Test Case: Create a New User**

   - **Endpoint:** `/api/users`
   - **Method:** POST
   - **Description:** Create a new user with provided details.
   - **Request Body:**
     ```json
     {
       "firstName": "Ali",
       "lastName": "Ahmed",
       "DOB": "1990-01-01",
       "role": "Store Operator",
       "emailAddress": "aLiAhmed@example.com",
       "password": "admin123",
       "isVerified": true
     }
     
     ```
   - **Expected Output:**
     ```json
     {
         "firstName": "Ali",
         "lastName": "Ahmed",
         "DOB": "1990-01-01T00:00:00.000Z",
         "role": "Store Operator",
         "emailAddress": "aliahmed@example.com",
         "password": "$2b$10$OYC26s2uhcII71ZOtQtZDezby7NBLpnFokySprQBM87YativwV3Um",
         "isVerified": true,
         "_id": "65547619e15d6e369a9346f1",
         "createdAt": "2023-11-15T07:41:13.366Z",
         "updatedAt": "2023-11-15T07:41:13.366Z",
         "__v": 0
     }
     ```
   - **Postman Output:**
     ![image-20231115124143960](C:\Users\Subhan\AppData\Roaming\Typora\typora-user-images\image-20231115124143960.png)

#### 4. **Test Case: Update User Information**
   - **Endpoint:** `/api/users/:userId`
   - **Method:** PUT
   - **Description:** Update information for a specific user.
   - **Request Body:**
     
     ```json
     {
         "firstName": "Subhan1",
         "lastName": "Suleman123"
     
     }
     ```
   - **Expected Output:**
     ```json
     {
         "_id": "654cf3ac2b73baaa57882ec1",
         "firstName": "Subhan1",
         "lastName": "Suleman123",
         "DOB": "1990-01-01T00:00:00.000Z",
         "role": "Store Operator",
         "emailAddress": "Store_Operator@example.com",
         "password": "$2b$10$fMpN9H/wxaU.0YLhoRECs.AqYTb4N5jKcrT.igrdUsBOk40uWr6d.",
         "isVerified": true,
         "createdAt": "2023-11-09T14:58:52.753Z",
         "updatedAt": "2023-11-15T07:42:33.518Z",
         "__v": 0
     }
     ```
   - **Postman Output:**
     ![image-20231115124306712](C:\Users\Subhan\AppData\Roaming\Typora\typora-user-images\image-20231115124306712.png)

#### 5. **Test Case: Delete a User**
   - **Endpoint:** `/api/users/:userId`
   - **Method:** DELETE
   - **Description:** Delete a specific user.
   - **Expected Output:**
     
     ```json
     {
         "message": "User deleted successfully",
         "deletedUser": {
             "_id": "654d0322423f6ca2f1cbdfff",
             "firstName": "John",
             "lastName": "Doe",
             "DOB": "1990-01-01T00:00:00.000Z",
             "role": "Store Operator",
             "emailAddress": "ali@example.com",
             "password": "$2b$10$mgS0Rl1vyruz8qis3oIqyOutWNRFJJdSxRRNubVmdfmGAw3OuO4i.",
             "isVerified": true,
             "createdAt": "2023-11-09T16:04:50.253Z",
             "updatedAt": "2023-11-09T16:04:50.253Z",
             "__v": 0
         }
     }
     ```
   - **Postman Output:**
     ![image-20231115124604498](C:\Users\Subhan\AppData\Roaming\Typora\typora-user-images\image-20231115124604498.png)

#### 6. **Test Case: Login a User**

   - **Endpoint:** `/api/login`

   - **Method:** POST

   - **Description:** Login a specific user.

   - **Expected Output:**

     ```json
     {
         "message": "Login successful",
         "email": "admin@example.com",
         "userid": "6548be4ae4b0bbf1e1437eb1",
         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NDhiZTRhZTRiMGJiZjFlMTQzN2ViMSIsInJvbGUiOiJBZG1pbiIsImlhdCI6MTcwMDAzNDY0MCwiZXhwIjoxNzAwMDM0NjUwfQ.F8EQsKpr1s4YQpULEoVJ2EGC_yjBPvk1clumjG6TXDs"
     }
     ```

   - **Postman Output:**

     ![image-20231115125056986](C:\Users\Subhan\AppData\Roaming\Typora\typora-user-images\image-20231115125056986.png)

#### 6. **Test Case: Login a User**

   - **Endpoint:** `/api/logout`

   - **Method:** POST

   - **Description:** Logout a specific user.

   - **Expected Output:**

     ```json
     {
         "message": "Login successful",
         "email": "admin@example.com",
         "userid": "6548be4ae4b0bbf1e1437eb1",
         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NDhiZTRhZTRiMGJiZjFlMTQzN2ViMSIsInJvbGUiOiJBZG1pbiIsImlhdCI6MTcwMDAzNDY0MCwiZXhwIjoxNzAwMDM0NjUwfQ.F8EQsKpr1s4YQpULEoVJ2EGC_yjBPvk1clumjG6TXDs"
     }
     ```

   - ![image-20231115125236024](C:\Users\Subhan\AppData\Roaming\Typora\typora-user-images\image-20231115125236024.png)