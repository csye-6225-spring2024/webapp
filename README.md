## Cloud-Native Application:
•   Programming Language: Node.js
•   Relational Database: MySQL
•   Backend Framework: Express.js
•   ORM Framework: Sequelize
 
Installation:
npm init 
npm install 
npm start 
 
 Health Check (/healthz)
•  The health check endpoint (/healthz) validates the application's connectivity to the database.
•  It returns an HTTP status code of "200 OK" upon successful connection.
•  If the connection to the database fails, it responds with "503 Service Unavailable" status code.
 
Method: GET
•  This endpoint functions as a health indicator for the application. A "200 OK" response confirms its successful operation. For other endpoints accessed using the GET method, a "404 Not Found" response will be returned if they are not implemented.
 
 Other request
•  The API requests for POST, DELETE, PUT, and PATCH methods are not configured as per the specifications. Thus, attempting to use these requests will lead to a "405 Method Not Allowed" response, regardless of the database connection status.

 
## Assignment 02:
 
POST request --> /v1/user
 
• Users can register by providing their email address, password, first name, and last name, resulting in a "201 Created" status code.
• During account creation, the fields for account creation and update are automatically set to the current time, overriding any user-provided values for these fields.
• An empty or invalid email address will trigger a "400 Bad Request" response, as will attempting to register with an email address that already exists.
• Passwords must be securely hashed using the BCrypt hashing scheme with salt; an empty password field will result in a "400 Bad Request" response.
• Users must provide both their first and last names; failing to do so will prompt a "400 Bad Request" response.
• The response payload for successful account creation includes the user's email address, first name, last name, and the timestamp of account creation. However, the password is never included in the response payload.
GET request --> /v1/user/self
 
• Users can access their account information by providing authentication credentials like user ID and password, resulting in a status code of "200 OK".
• If there's a discrepancy in the provided username or password, or if the user details don't exist, or if the username or password fields are empty, the response status code will be "400 Bad Request".
• In case of a database connection issue, the endpoint responds with a status code of "503 Service Unavailable".
The response payload for a successful request includes all user fields except for the password.
 
PUT request --> /v1/user/self
• Users are permitted to modify their personal account details exclusively, and authentication via basic authentication is obligatory, resulting in a status code of "204 No Content".
•  If a user lacks authentication credentials or provides invalid username and password combinations, the response status code will be "401 Unauthorized".
•  Only specific fields, namely First Name, Last Name, and Password, can be updated by users; any other fields present in the payload will lead to a status code of "400 Bad Request".
•  Similarly, if the provided First Name, Last Name, or Password are either invalid or empty, the response status code will be "400 Bad Request".
• In the event of a database connection issue, the endpoint returns a status code of "503 Service Unavailable".
 The "Account_updated" field is updated upon successful user updates.

## Assignment 03:
 
GitHub Actions Integration Tests Workflow:
 
The repository contains a GitHub Actions workflow titled "test-checker," crafted specifically for conducting integration tests on the /v1/user endpoint.
 
Workflow Description:
 
The workflow consists of the following steps:
 
• MySQL Installation: Initiates the MySQL service.
• MySQL Configuration: Establishes the MySQL database, including database creation, user setup, and granting of essential privileges.
• Node.js Setup: Configures the Node.js environment.
• Environment Variable Configuration: Prepares the necessary environment variables for the application to connect to the MySQL database.
• Dependency Installation: Installs project dependencies via npm.
• Application Startup: Commences the application by executing the "npm start" command.
• Testing: Runs integration tests specified in the "test" directory using the "npm test" command.
 
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

## Assignment 04:

• A custom image is created from the CentOS 8 stream, configured to run within our default VPC.
• The custom image includes essential dependencies such as MySQL and Node.js, along with the creation of user and group as per specified requirements (user: csye6225, group: csye6225).
• Web application services are automatically initiated using the systemd file webapp.service.
• For deploying the custom image in the GCP service account, necessary roles have been enabled, including Compute Engine • • • Instance Admin (v1) and Service Account User. The JSON key generated from the service account is downloaded and stored   securely as a secret in the organization's webapp repository.
• Two workflows are established, named test-build and test-checker.
• The test-checker workflow encompasses integration tests, building project artifacts, initializing Packer, formatting with Packer fmt, and validating with Packer validate.
• The test-validator workflow includes integration tests, building project artifacts, authentication, initializing Packer, building the custom image, and automatically deploying it upon merge.