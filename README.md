# Engida-Test
# additional thing that i added
Authentication
To secure the Task Management Application, I have implemented user authentication using JWT (JSON Web Tokens) with RSA public/private key encryption. Only authenticated users can access the task management features such as viewing, adding, editing, and deleting tasks.

Key Features:
User Registration:

Users can register by providing their email, username, and password.
The password is hashed using bcrypt before being stored in the database for security.
User Login:

After registration, users can log in by providing their credentials (email and password).
If the credentials are correct, a JWT token is generated and returned to the user.
JWT Authentication:

The JWT is signed using RSA encryption (public and private keys).
The private key is used to sign the JWT on the backend, while the public key is used to verify the JWT on every protected route.
Protected Routes:

All routes for managing tasks (GET /tasks, POST /tasks, PATCH /tasks/:id, and DELETE /tasks/:id) are protected by JWT authentication.
Users must include the JWT token in the request headers (Authorization: Bearer <token>) to access these routes.
Authentication Flow:
Registration:

Users send a POST request to /user/register with their email, username, and password.
Login:

Users send a POST request to /user/login with their email and password.
JWT Token:

Upon successful login, a JWT token is issued and sent to the user.
Accessing Protected Routes:

To access protected routes, users must include the JWT token in the Authorization header as a Bearer token.
Backend Setup
JWT with RSA: The application uses RSA encryption for JWT signing and verification. The private key is securely stored in the backend, while the public key is made available for token verification on the frontend.
Endpoints for Authentication:
POST /auth/register: Registers a new user by accepting email, username, and password.
POST /auth/login: Logs in the user and returns a JWT token.
Security Considerations:
RSA Key Pair:

Ensure that the private key used for signing JWT tokens is kept secure. The public key is used for token verification and can be shared with the frontend.
JWT Expiration:

Tokens have an expiration time to ensure that users are logged out after a period of inactivity.
Password Hashing:

Passwords are hashed using bcrypt to ensure they are securely stored in the database.