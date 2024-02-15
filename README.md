Cloud-Native Application README:
•   Programming Language: Node.js
•   Relational Database: MySQL
•   Backend Framework: Express.js
•   ORM Framework: Sequelize
 
Installation:
npm init
npm install —> to install all dependencies
npm start —> to start the server
 
Health Check (/healthz)
•   Checks if the application has connectivity to the database.
•   Returns HTTP "200 OK" —> if the connection is successful.
•   Returns HTTP "503 Service Unavailable" —> if the connection is unsuccessful.
 
Method: GET
•   Description: Endpoint to check the health of the application.
•   Success Response —> "200 OK"
•   Other Endpoints in Method: GET—> Other endpoints are not implemented and will return a "404 Not Found response".
 
Other API request
•   Method: POST,DELETE,PUT,PATCH
•   Description: Other API requests are not implemented as per the requirement and will return a "405 Method not allowed" irrespective of whether DB is connected or not.
 
Middlewares
•   checkDBConnection: Middleware to ensure the application has connectivity to the database.
•   checkPayloadAndQueryParams: Middleware to check if there is any request body with payload and also if there is any query params in the request, if yes it will return —>"400 Bad request" irrespective of whether DB is connected or not.
 
Assignment 02:
 
POST request --> /v1/user
 
• User can create an account by providing email address, password, first name, and last name --> 201
• While account creation, account_created and account_updated field should be set to the current time. Even if the user gives any value for account_created and account_updated field then it should be ignored.
• Email Address: Users should provide a valid email address and it cant be empty --> 400
                 If email address already exists - 400
• Password: Password should be securely hashed using the BCrypt password hashing scheme with salt.
            If the password field is empty --> 400
• First Name and Last Name: Users should provide their first name and last name.
                            If it is empty -->400
• Response Payload: The response payload should include the user's email address, first name, last name, and the timestamp of account creation. However, the password should never be returned in the response payload.
 
GET request --> /v1/user/self
 
• User can retrieve account information from the application based on their authentication credentials such as user ID and password -->200
• If there is mismatch in the username, password or if the user entered details doesnt exist or if the username or password is empty --> 400
• If there is no db connection -->503
• Response Payload: When a user requests their account information, the response payload should include all fields for the user except for the password.
 
 
PUT request --> /v1/user/self
• Users can only update their own account information and they must be authenticated using basic authentication -->204
• If the user is not authenticated or if user provides invalid username and password--->401
• Users should only be allowed to update the following fields: First Name, Last Name, Password, if anyother fields are present in the payload then -->400
• Similarly if the provided First Name, Last Name, Password is invalid or empty -->400
• No DB connection -->503
• Account_updated field should be updated when the user update is successful.
 
Assignment 03:
 
GitHub Actions Integration Tests Workflow:
 
The repository includes a GitHub Actions workflow named "test-checker" specifically designed for integration testing of the /v1/user endpoint.
 
Workflow Description:
 
The workflow consists of the following steps:
 
• Install MySQL: Starts the MySQL service.
• Configure MySQL: Sets up the MySQL database by creating a database, user, and granting necessary privileges.
• Use Node.js: Sets up Node.js environment
• Set up environment variables: Sets up environment variables required for the application to connect to the MySQL database.
• Install Dependencies: Installs the project dependencies using npm.
• Start the application: Starts the application by running "npm start".
• Run Tests: Executes the integration tests defined in the "test" directory using the "npm test" command.
 
Test Environment Configuration:
 
The workflow utilizes secrets to securely configure the MySQL database connection. The following secrets are required:
 
- MYSQL_ROOT_PASSWORD: Root password for MySQL.
- DB_USER: Username for the MySQL database.
- DB_PASSWORD: Password for the MySQL database user.
- DB: Name of the MySQL database.
- MYSQL_HOST: Hostname of the MySQL server.
 
These secrets are used to create and configure the MySQL database during workflow execution. Additionally, environment variables are set both in the workflow and in a ".env" file to ensure proper configuration of the application.
 
Execution Flow:
 
• The workflow starts by installing and configuring MySQL to create the necessary database and user.
• Sets Node.js environment.
• Environment variables are configured to establish the connection between the application and MySQL database.
• Dependencies are installed, and the application is started.
• Integration tests are executed against the running application to validate the functionality of the "/v1/user" endpoint.
 
The workflow ensures that the application interacts correctly with the MySQL database and that the "/v1/user" endpoint behaves as expected according to the specified test cases.