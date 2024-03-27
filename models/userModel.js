import { DataTypes } from 'sequelize';
import sequelize from '../config/dbConfig.js';

const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,     
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    username: {
      type: DataTypes.STRING,   
      allowNull: false,
    },
    account_created: {
      type: DataTypes.UUID,   
      defaultValue: DataTypes.NOW, 
    },
    account_updated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true,  
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    validity: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  },{
    timestamps: false,
  });
  
  User.sync({ alter: true })
  .then(() => {
    console.log('Model synchronized successfully');
  })
  .catch(err => {
    console.error('Error synchronizing model:', err);
  });
  
  export default User;
