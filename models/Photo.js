const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('pcat-test-db', 'db_user', 'db_password', {
  host: 'localhost',
  dialect: 'postgres',
  logging: console.log,
});

sequelize.sync()
  .then(() => {
    console.log('Veritabanı tabloları oluşturuldu');
  })
  .catch((error) => {
    console.error('Veritabanı tabloları oluşturulurken hata oluştu:', error);
  });


const Photo = sequelize.define('Photo', {
  title: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
  },
  dateCreated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Photo;
