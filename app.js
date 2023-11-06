const express = require('express');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');

const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
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
app.use(fileUpload());
app.use(methodOverride('_method',{
  methods:['POST','GET']
}
));

//ROUTES
app.get('/', async (req, res) => {
  const photos = await Photo.findAll({
    order: [['dateCreated', 'DESC']],
  });

  res.render('index', {
    photos,
  });
});
app.get('/about', (req, res) => {
  res.render('about');
});
app.get('/photos/:id', async (req, res) => {
  //console.log(req.params.id)
  //res.render('about');
  const photo = await Photo.findByPk(req.params.id);
  res.render('photo', {
    photo,
  });
});
app.get('/add', (req, res) => {
  res.render('add');
});

// Photo modelini içe aktarın
const Photo = require('./models/Photo');

app.post('/photos', async (req, res) => {
  console.log(req.files.image);
  // try {
  //   const photo = await Photo.create(req.body);
  //   console.log('Yeni fotoğraf eklendi:', photo.toJSON());
  //   res.redirect('/');
  // } catch (error) {
  //   console.error('Fotoğraf eklenirken hata oluştu:', error);
  //   res.status(500).send('Fotoğraf eklenirken bir hata oluştu');
  // }
  // encType="multipart/form-data"   forma gorsel eklemeye yariyor. form tag ina konuyor
  //__dirname:var olan klasorun kendisi

  const uploadDir = 'public/uploads';
  //Sync  olmasi once bunu yap sonra digerlerine gec anlaminda
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadedImage = req.files.image;
  let uploadPath = __dirname + '/public/uploads/' + uploadedImage.name;

  uploadedImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadedImage.name,
    });
    res.redirect('/');
  });
});
//method-override  neden kullanilir.  Tarayici ile put kullanamadigimiz icin post u put gibi kullancagiz
app.get('/photos/edit/:id', async (req, res) => {
  const photo = await Photo.findOne({ id: req.params.id });
  res.render('edit', {
    photo,
  });
});
app.put('/photos/:id', async (req, res) => {
  const photo = await Photo.findOne({ id: req.params.id });
  photo.title = req.body.title;
  photo.description = req.body.description;
  await photo.save();
  res.redirect(`/photos/${req.params.id}`);
});

app.delete('/photos/:id', async (req,res)=>{
  const photoId = req.params.id;

  const photo = await Photo.findOne({ id: req.params.id });
let deletedImagePath = __dirname+'/public'+photo.image
fs.unlinkSync(deletedImagePath)


  try {
    const deletedPhoto = await Photo.destroy({
      where: {
        id: photoId
      }
    });
  
    if (deletedPhoto === 1) {
      console.log(`ID'si ${photoId} olan fotoğraf başarıyla silindi.`);
    } else {
      console.log(`ID'si ${photoId} olan fotoğraf bulunamadı veya silinemedi.`);
    }
  } catch (error) {
    console.error('Fotoğraf silinirken bir hata oluştu:', error);
  }

  res.redirect('/')

  })

const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portta çalışıyor`);
});
