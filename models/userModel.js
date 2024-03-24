import { DataTypes } from 'sequelize';
import sequelize from '../config/dbConfig.js';

const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      readOnly: true,
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
      writeOnly: true,
    },
    username: {
      type: DataTypes.STRING,   
      allowNull: false,
      //unique: true,
    },
    account_created: {

      type: DataTypes.DATE,   
      defaultValue:DataTypes.NOW, 
      allowNull: true,
      readOnly: true,
    },
    account_updated: {
      type: DataTypes.DATE,
      defaultValue:DataTypes.NOW,
      allowNull: true,  
      readOnly: true,
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true
  }  
  },{
    timestamps: false,
  });
  
  export default User; 