import bcrypt from 'bcrypt';
import User from '../models/userModel.js';
import { dbConnection } from './healthController.js';
import sequelize from '../config/dbConfig.js';

// Validators
import emailValidator from 'email-validator';
import passwordValidator from 'password-validator';
import nameValidator from 'validator'; 
const estOptions = { timeZone: 'America/New_York' };

const passwdValidator = new passwordValidator();
export { emailValidator, passwdValidator, nameValidator }; 
passwdValidator
  .is()
  .min(5) // Minimum length 5
  .is()
  .max(20); // Maximum length 20
  
  const dbConnectionCheck = async () => {
    try {
        await sequelize.authenticate();
        return true; // Database connection successful
    } catch (error) {
        console.error('Database Connectivity Error:', error);
        return false; // Database connection failed
    }
};

// Function to validate if a string contains only letters (no digits)
const isAlphaString = (str) => {
    return nameValidator.isAlpha(str);
  };

//   function parseJSONWithCatch(jsonString) {
//     try {
//         // Attempt to parse the JSON string if it's a string
//         if (typeof jsonString === 'string') {
//             const parsedJSON = JSON.parse(jsonString);
//             return parsedJSON;
//         } else if (typeof jsonString === 'object') {
//             // Return the object as is if it's already an object
//             return jsonString;
//         } else {
//             // Return null for other types
//             return null;
//         }
//     } catch (error) {
//         // Handle JSON parsing errors
//         console.error("Error parsing JSON:", error.message);
//         return null;
//     }
// }


// Adding User to database
const addUser = async (req, res) => {
    // Check if the request method is POST
    if (req.method === 'POST') {
        // Check if the authorization header is present
        if (req.headers.authorization) {
            // Send an error response indicating authorization is not supported for this method
            res.status(405).send("Authorization is not supported for this method.");
            return;
        }

        // if (Object.keys(req.body).length === 0) {
        //     return res.status(400).json({ message: "Empty / Invalid payload not allowed" });
        //   }
        
        // Check if the request body is empty
        if (Object.keys(req.body).length === 0) {
            res.status(204).send("Request body is empty.");
            return;
        }
      
        const allowedFields = ['first_name', 'last_name', 'username', 'password', 'account_created', 'account_updated'];
      
        // Check for any additional fields in the request body
        const extraFields = Object.keys(req.body).filter(
            (field) => !allowedFields.includes(field)
        );
      
        if (extraFields.length > 0) {
            res.status(400).send("Additional fields are not allowed.");
            return;
        }
      
        // Validating first_name and last_name format
        if (
            !isAlphaString(req.body.first_name) ||
            !isAlphaString(req.body.last_name)
        ) {
            res.status(400).send("Invalid format for first_name or last_name.");
            return;
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(req.body.password, salt);
        
            const details = {
                username: req.body.username,
                last_name: req.body.last_name,
                first_name: req.body.first_name,
                password: hashPassword,
            };
        
            if (
                !emailValidator.validate(`${req.body.username}`) ||
                !passwdValidator.validate(`${req.body.password}`)
            ) {
                res.status(400).send("Invalid email or password format.");
                return;
            }
            
            // Check database connection before proceeding
            const isDBConnected = await dbConnectionCheck();
            if (!isDBConnected) {
                res.status(503).send("Database Connectivity Error");
                return;
            }
                
            const findUser = await User.findOne({
                where: { username: `${req.body.username}` },
            });

            if (findUser === null) {
                const user = await User.create(details);
                const userInput = {
                    id: user.id,
                    username: user.username,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    account_created: user.account_created,
                    account_updated: user.account_updated,
                };
                res.status(201).json(userInput);
            } else {
                res.status(400).send("User already exists.");
            }
        }
    } else {       
        res.status(405).send("Method Not Allowed");
    }
};


// Fetching user details following basic authentication.
const getUser = async (req, res) => {
    // Check if the request method is GET
    if (req.method === 'GET') {
      // Check if the request body is not empty
      if (Object.keys(req.body).length > 0) {
        res.status(400).send("Request body should be empty for GET requests.");
        return;
      }
    }

    const isDBConnected = await dbConnectionCheck();
            if (!isDBConnected) {
                res.status(503).send("Database Connectivity Error");
                return;
            }
  
    // Check if the authorization header is undefined
    if (req.headers.authorization === undefined) {
      res.status(403).send("Authorization header is missing.");
    } else {
      // Retrieve the encoded value in the format of 'basic <Token>' and extract only the <token>.
      var encoded = req.headers.authorization.split(' ')[1];
      // Decode it utilizing base64
      var decoded = Buffer.from(encoded, 'base64').toString();
      var username = decoded.split(':')[0];
      var password = decoded.split(':')[1];

  
      // Verify if the provided username corresponds to the records in our database.
      const findUser = await User.findOne({
        where: { username: username },
      });

  
      if (findUser !== null) {
        if (await bcrypt.compare(password, findUser.password)) {
          let userInput = {
            id: findUser.id,
            username: findUser.username,
            first_name: findUser.first_name,
            last_name: findUser.last_name,
            account_created: findUser.account_created,
            account_updated: findUser.account_updated,
          };
  
          res.status(200).json(userInput);
        } else {
          res.status(401).send("Invalid password.");
        }
      } else {
        // User not found in the database
        res.status(404).send("User not found.");
      }
    }
};

const updateUser = async (req, res) => {
    // Check if the request body is empty
    if (Object.keys(req.body).length === 0) {
        res.status(204).send("Request body is empty.");
        return;
    }
    
    // Ensure only valid keys are present in the request body
    const allowedFields = ['first_name', 'last_name', 'password'];
    const invalidFields = Object.keys(req.body).filter(field => !allowedFields.includes(field));
    if (invalidFields.length > 0) {
        res.status(400).send("Invalid fields in request body.");
        return;
    }

    const isDBConnected = await dbConnectionCheck();
    if (!isDBConnected) {
        res.status(503).send("Database Connectivity Error");
        return;
    }

    // Grab the encoded value, format: bearer <Token>, need to extract only <token>
    var encoded = req.headers.authorization.split(' ')[1];
    // Decode it using base64
    var decoded = Buffer.from(encoded, 'base64').toString();
    var username = decoded.split(':')[0];
    var password = decoded.split(':')[1];

    // Check if the passed username and password match with the values in our database.
    const findUser = await User.findOne({
        where: { username: username },
    });

    if (!findUser) {
        // User not found
        res.status(404).send("User not found.");
        return;
    }
    
    if (await bcrypt.compare(password, findUser.password)) {
        // Validating first_name and last_name format
        if (req.body.first_name && !isAlphaString(req.body.first_name)) {
            res.status(400).send("Invalid format for first_name.");
            return;
        }
        if (req.body.last_name && !isAlphaString(req.body.last_name)) {
            res.status(400).send("Invalid format for last_name.");
            return;
        }

        const updates = {};

        if (req.body.first_name) {
            updates.first_name = req.body.first_name;
        }

        if (req.body.last_name) {
            updates.last_name = req.body.last_name;
        }

        if (req.body.password) {
            if (!passwdValidator.validate(req.body.password)) {
                res.status(400).send("Invalid password format.");
                return;
            }
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(req.body.password, salt);
        }



        if (Object.keys(updates).length === 0) {
            res.status(400).send("No valid fields provided for update.");
            return;
        }

        updates.account_updated = new Date();

        await findUser.update(updates);

        res.status(204).send();
    } else {
        res.status(401).send("Invalid password.");
    }
};


export { addUser, getUser, updateUser };

