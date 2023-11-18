const express = require('express');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');
const { Sequelize } = require('sequelize');
const ejs = require('ejs');
const photoController = require('./controllers/photoControllers')
const pageController = require('./controllers/pageController')

const sequelize = new Sequelize('pcat-test-db', 'db_user', 'db_password', {
  host: 'localhost',
  dialect: 'postgres',
  logging: console.log,
});

const app = express();

//TEMPLATE ENGINE   
app.set('view engine', 'ejs');

//MIDDLEWARE
//MIDDLEWARE
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // middleware seçeneklerini obje içine alın
app.use(express.json());
app.use(fileUpload());
app.use(methodOverride('_method',{
  methods:['POST','GET']
}
));

//ROUTES
app.get('/',photoController.getAllPhotos);
app.get('/photos/:id', photoController.getPhoto);
app.post('/photos',photoController.createPhoto);
app.put('/photos/:id',photoController.updatePhoto );
app.delete('/photos/:id', photoController.deletePhoto);

app.get('/about',pageController.getAboutPage);
app.get('/add', pageController.getAddPage);
app.get('/photos/edit/:id', pageController.getEditPage);


const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portta çalışıyor`);
});
