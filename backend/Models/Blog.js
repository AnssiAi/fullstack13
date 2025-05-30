const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../util/db');

class Blog extends Model {}

Blog.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    author: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: 1991,
            msg: "Year value cannot be lower than 1991"
          },
          max: {
            args: new Date().getFullYear(),
            msg: `Year value cannot be higher than ${new Date().getFullYear()}`
          }
        },
    }
  }, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog'
  })

module.exports = Blog;