const Photo = require('../models/Photo')
const fs = require('fs');


exports.getAllPhotos=async (req, res) => {
  // console.log(req.query)
  //   const photos = await Photo.findAll({
  //     order: [['dateCreated', 'DESC']],
  //   });
  
  //   res.render('index', {
  //     photos,
  //   });
  const page= req.query.page||1;
  const perPage = 3;
  const photos1 = await Photo.findAll();
const totalPhotos = photos1.length;

  const photos = await Photo.findAll({
        order: [['dateCreated', 'DESC']],
        limit: perPage, // Her sayfada gösterilecek öğe sayısı
        offset: (page - 1) * perPage, // Verilerin başlangıç indeksi (sayfa numarası ile hesaplanır)
  });
  res.render('index', {
        photos:photos,
        current:page,
        pages:Math.ceil(totalPhotos/perPage)
      });

  };
  exports.getPhoto=async (req, res) => {
    const photo = await Photo.findByPk(req.params.id);
    res.render('photo', {
      photo,
    });
  };

  exports.createPhoto= async (req, res) => {

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
    //Sync  olmasi once bunu yap sonra digerlerine gec anlaminda
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
  
    let uploadedImage = req.files.image;
    let uploadPath = __dirname + '/../public/uploads/' + uploadedImage.name;
  
    uploadedImage.mv(uploadPath, async () => {
      await Photo.create({
        ...req.body,
        image: '/uploads/' + uploadedImage.name,
      });
      res.redirect('/');
    });
  }
  exports.updatePhoto = async (req, res) => {
    const photo = await Photo.findOne({ id: req.params.id });
    photo.title = req.body.title;
    photo.description = req.body.description;
    await photo.save();
    res.redirect(`/photos/${req.params.id}`);
  };
  exports.deletePhoto =async (req,res)=>{
    const photoId = req.params.id;
  
    const photo = await Photo.findOne({ id: req.params.id });
  let deletedImagePath = __dirname+'/../public'+photo.image
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
  
    };

  