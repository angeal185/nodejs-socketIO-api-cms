const express = require('express'),
fs = require('fs'),
router = express.Router(),
config = require('../config/config'),
_ = require('lodash'),
chalk = require('chalk'),
posts = require('../data/posts').posts,
modJSON = require('../modules/modJSON'),
listFiles = require('../modules/listFiles'),
schema = require('../data/jsonLd'),
aceConf = require('../config/aceConf'),
mobData = require('../data/mobData'),
siteTplData = require('../data/siteTemplates');


function datato(req){
  console.log(
  chalk.magentaBright(req.method) + ' ' +
  chalk.greenBright(req.url) + ' ' +
  chalk.blueBright(req.message)+
  chalk.blueBright(JSON.stringify(req.params))+
  JSON.stringify(req.body)
)}

router.get('/', function(req, res) {
  res.render('index', {
    title: 'dash',
    config: config
  });
});

router.get('/mobile', function(req, res) {
  res.render('mobile', {
    title: 'mobile',
    config: config,
    mobData:mobData
  });
});

router.get('/backup', function(req, res) {
  res.render('backup', {
    title: 'backup',
    config: config
  });
});

router.get(config.app.preview, function(req, res) {
  datato(req);
  res.render('front', {
    data: siteTplData,
    title: 'front',
    config: config
  });
});

router.get('/site/templates', function(req, res) {
  res.render('editPost', {
    title: 'SiteTemplates',
    siteTemplates: true,
    config: config
  });
});

router.get('/site/schema', function(req, res) {
  datato(req);
  res.render('schema', {
    title: 'schema',
    schema: schema,
    config: config
  });
});

router.get('/site/meta', function(req, res) {
  res.render('siteBody', {
    title: 'meta',
    config: config
  });
});

router.get('/site/scripts', function(req, res) {
  res.render('siteBody', {
    title: 'scripts',
    config: config
  });
});

router.get('/site/links', function(req, res) {
  res.render('siteBody', {
    title: 'links',
    config: config
  });
});

router.get('/posts/createPost', function(req, res) {
  res.render('editPost', {
    title: 'createPost',
    create: true,
    config: config
  });
});

router.get('/posts/templates', function(req, res) {
  res.render('editPost', {
    title: 'Templates',
    templates: true,
    config: config
  });
});


router.get('/posts/posts', function(req, res) {
  res.render('posts', {
    title: 'posts',
    config: config
  });
});



_.forEach(posts, function(i,e) {

  router.get('/posts/editPost/'+i.id, function(req, res) {
    res.render('editPost', {
      title: 'editPost',
      edit: true,
      config: config,
      data: i
    });
  });

});


router.post('/posts/editPost', function(req, res) {
  let i = req.body.postData; //get task command from body
  var gotFilter = _.find(posts, { 'id': parseInt(i)});
  console.log(gotFilter)
  res.render('editPost', {
    title: 'editPost',
    edit: true,
    config: config,
    data: gotFilter
  });
});



router.get('/social/api', function(req, res) {
  res.render('api', {
    title: 'api',
    api:true,
    config: config
  });
});

router.get('/social/links', function(req, res) {
  res.render('api', {
    title: 'links',
    links:true,
    config: config
  });
});

router.get('/gallery/gallery', function(req, res) {
  res.render('api', {
    title: 'gallery',
    gallery: true,
    config: config
  });
});

router.get('/gallery/preload', function(req, res) {
  res.render('api', {
    title: 'preload',
    preload: true,
    config: config
  });
});

router.get('/admin/status', function(req, res) {
  res.render('status', {
    title: 'status',
    config: config
  });
});

router.get('/admin/editor', function(req, res) {
  res.render('editor', {
    title: 'editor',
    editor: true,
    config: config
  });
});

router.get('/admin/upload', function(req, res) {
  res.render('upload', {
    title: 'upload',
    config: config
  });
});

router.get('/admin/tasks', function(req, res) {
  res.render('tasks', {
    title: 'tasks',
    config: config
  });
});

module.exports = router;
