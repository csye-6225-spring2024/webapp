import bcrypt from 'bcrypt';
import User from '../models/userModel.js';

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
  

// Function to validate if a string contains only letters (no digits)
const isAlphaString = (str) => {
  return nameValidator.isAlpha(str);
};

// Adding User to database
const addUser = async (req, res) => {
    // Check if the request body is empty
    if (Object.keys(req.body).length === 0) {
      res.status(204).send();
      return;
    }
  
    const allowedFields = ['first_name', 'last_name', 'username', 'password'];
  
    // Check for any additional fields in the request body
    const extraFields = Object.keys(req.body).filter(
      (field) => !allowedFields.includes(field)
    );
  
    if (extraFields.length > 0) {
      console.log(3);
      res.status(400).send();
      return;
    }
  
    // Validating first_name and last_name format
    if (
      !isAlphaString(req.body.first_name) ||
      !isAlphaString(req.body.last_name)
    ) {
      console.log(1);
      res.status(400).send();
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
        !passwdValidator.validate(`${req.body.password}`) ||
        !isAlphaString(req.body.first_name) ||
        !isAlphaString(req.body.last_name)
      ) {
        console.log(2);
        res.status(400).send();
      } else {
        const findUser = await User.findOne({
          where: { username: `${req.body.username}` },
        });
  
        if (findUser === null) {
          const user = await User.create(details).then((data) => {
            const userInput = {
              id: data.id,
              username: data.username,
              first_name: data.first_name,
              last_name: data.last_name,
              account_created: data.account_created,
              account_updated: data.account_updated,
            };
  
            res.status(201).json(userInput);
          });
  
          res.status(201).send();
        } else {
          console.log(4);
          res.status(400).send();
        }
      }
    }
  };
  

// Fetching user details following basic authentication.
const getUser = async (req, res) => {
    // Check if the request method is GET
    if (req.method === 'GET') {
      // Check if the request body is not empty
      if (Object.keys(req.body).length > 0) {
        res.status(400).send(); // Return 400 Bad Request
        return;
      }
    }
  
    // Check if the authorization header is undefined
    if (req.headers.authorization === undefined) {
      res.status(403).send();
    } else {
      // Retrieve the encoded value in the format of 'basic <Token>' and extract only the <token>.
      var encoded = req.headers.authorization.split(' ')[1];
      console.log(encoded);
      // Decode it utilizing base64
      var decoded = Buffer.from(encoded, 'base64').toString();
      console.log(decoded);
      var username = decoded.split(':')[0];
      var password = decoded.split(':')[1];
  
      console.log(username);
      console.log(password);
  
      // Verify if the provided username corresponds to the records in our database.
      const findUser = await User.findOne({
        where: { username: username },
      });
      console.log('hi');
      console.log(findUser);
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
          res.status(401).send();
        }
      } else {
        // User not found in the database
        res.status(404).send();
      }
    }
  };
  

  const updateUser = async (req, res) => {
    // Check if the request body is empty
    if (Object.keys(req.body).length === 0) {
        res.status(204).send();
        return;
    }

    // Grab the encoded value, format: bearer <Token>, need to extract only <token>
    var encoded = req.headers.authorization.split(' ')[1];
    // Decode it using base64
    console.log(encoded);
    var decoded = Buffer.from(encoded, 'base64').toString();
    var username = decoded.split(':')[0];
    var password = decoded.split(':')[1];

    // Check if the passed username and password match with the values in our database.
    const findUser = await User.findOne({
        where: { username: username },
    });

    if (!findUser) {
        // User not found
        console.log(404);
        res.status(404).send();
        return;
    }

    if (await bcrypt.compare(password, findUser.password)) {
        // Validating first_name and last_name format
        if (req.body.first_name && !isAlphaString(req.body.first_name)) {
            console.log(2);
            res.status(400).send();
            return;
        }
        if (req.body.last_name && !isAlphaString(req.body.last_name)) {
            console.log(2);
            res.status(400).send();
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
                console.log(3);
                res.status(400).send();
                return;
            }
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(req.body.password, salt);
        }

        if (Object.keys(updates).length === 0) {
            console.log(2);
            res.status(400).send();
            return;
        }

        updates.account_updated = new Date();

        await findUser.update(updates);

        console.log('hola');
        console.log(findUser.account_updated);
        res.status(200).send();
    } else {
        console.log(401);
        res.status(401).send();
    }
};


  
export { addUser, getUser, updateUser };
