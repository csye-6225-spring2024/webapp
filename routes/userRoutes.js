import { Router } from 'express';
import { addUser } from '../controllers/userController.js';
import { getUser } from '../controllers/userController.js';
import { updateUser } from '../controllers/userController.js';

const router = Router();

router.route('/')
   .post(addUser)
  .all((req, res) => {
    res.status(405).send(); 
  });

router.route('/self')
  .get(getUser)
  .put(updateUser)
  .all((req, res) => {
    res.status(405).send(); 
  });



export default router; 

