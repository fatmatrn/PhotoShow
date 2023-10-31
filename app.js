const express = require('express');
const ejs = require('ejs');
const path = require('path');
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('pcat-test-db', 'db_user', 'db_password', {
  host: 'localhost',
  dialect: 'postgres',
  logging: console.log,
});

const app = express();

//TEMPLATE ENGINE
app.set('view engine', 'ejs');

//MIDDLEWARE
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // middleware seçeneklerini obje içine alın
app.use(express.json());

//ROUTES
app.get('/', (req, res) => {
  res.render('index');
});
app.get('/about', (req, res) => {
  res.render('about');
});
app.get('/add', (req, res) => {
  res.render('add');
});

// Photo modelini içe aktarın
const Photo = require('./models/Photo');

app.post('/photos', async (req, res) => {
  try {
    const photo = await Photo.create(req.body);
    console.log('Yeni fotoğraf eklendi:', photo.toJSON());
    res.redirect('/');
  } catch (error) {
    console.error('Fotoğraf eklenirken hata oluştu:', error);
    res.status(500).send('Fotoğraf eklenirken bir hata oluştu');
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portta çalışıyor`);
});
