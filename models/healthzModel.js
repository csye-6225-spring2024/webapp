import { Sequelize, DataTypes } from "sequelize";
import { dbConfig } from "../config/dbConfig.js";
import bcrypt from "bcrypt";
import { Buffer } from "buffer";
 
// Create Sequelize instance to connect to DB
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  logging: false,
  define: {
    timestamps: false,
  },
  sync: { alter: true },
});
 
// Define Healthz model
const Healthz = sequelize.define("healthz", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
 
// Define User model
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    // Attributes for the User model
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "First name cannot be empty",
        },
      },
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Last name cannot be empty",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password cannot be empty",
        },
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Invalid email format",
        },
      },
    },
    account_created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    account_updated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        // Hash the password before creating a new user
        const encodedPassword = Buffer.from(user.password).toString("base64");
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(encodedPassword, saltRounds);
        user.password = hashedPassword;
        user.account_created = new Date();
        user.account_updated = new Date();
      },
 
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          // Hash the new password before updating
          const encodedPassword = Buffer.from(user.password).toString("base64");
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(encodedPassword, saltRounds);
          user.password = hashedPassword;
        }
        user.setDataValue("account_updated", new Date());
      },
    },
    setterMethods: {
      account_created: function (value) {
      },
      account_updated: function (value) {
      },
    },
  }
);
 
export { Healthz, sequelize, User };