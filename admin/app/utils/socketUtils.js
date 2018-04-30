const config = require('../config/config'),
fs = require('fs-extra'),
_ = require('lodash'),
urls = require('../urls'),
zlib = require('zlib'),
os = require('os'),
crypto = require('crypto'),
formatBytes = require('../modules/formatBytes'),
modJSON = require('../modules/modJSON'),
beautify = require('beautify'),
UglifyJS = require("uglify-js"),
files = require('../data/files'),
CleanCSS = require('clean-css'),
minify = require('html-minifier').minify,
htmlMin = require('../config/htmlMin'),
JSONEdit = require("../modules/JSONEdit"),
html2pug = require('html2pug'),
listFiles = require('../modules/listFiles'),
posts = require('../data/posts'),
apiData = require('../data/appAPI'),
chalk = require('chalk'),
versions = require('../urls/versions'),
postTemplates = require('../data/templates'),
siteTplData = require('../data/siteTemplates'),
pug = require('pug'),
logs = require('../logs/logs'),
recursive = require('../modules/readdir'),
nModTasks = require('../config/node_modulesTasks')
nodemailer = require('nodemailer'),
mailerOps = require('../config/nodemailer'),
tar = require('tar'),
SocketIOFileUpload = require('socketio-file-upload');
const { exec } = require('child_process');

var arr = [];
var obj = {};
var dtypes = ['css','js','data'];

function encryptData(t){
  var password = 'password';
  var cipher = crypto.createCipher('aes256', password);
  var title = t;
  var input = fs.createReadStream(title);
  var output = fs.createWriteStream(title + '.enc');
  input.pipe(cipher).pipe(output);
  console.log("[success] "+t+".enc created")
}

//encryptData()

function decryptData(){
  var password = 'password';
  var decipher = crypto.createDecipher('aes256', password);
  var title = 'app.tgz.enc';
  var input = fs.createReadStream(title);
  var output = fs.createWriteStream(title.slice(0,-4));
  input.pipe(decipher).pipe(output);
}

decryptData()


exports.backup = function(i,e,x){
  var enc = x;
  var src = e;
  var dest = 'backup/'+i+'.tgz';
  tar.c({
      gzip: true,
      file: dest
    },
      [src]
    )
    .then(function(){
      if (enc) {
        encryptData(dest)
      } else {
        console.log("[success] "+dest+" created")
      }
    })
}


exports.sendEmail = function (){
  var portNo;
  var sendTo;
  if (mailerOps.secure){
    portNo = mailerOps.port.secure
  } else {
    portNo = mailerOps.port.insecure
  }

  if (mailerOps.useSubscribers){
    sendTo = _.toString(mailerOps.subscribersList);
  } else {
    sendTo = '';
  }


  let transporter = nodemailer.createTransport({
      host: mailerOps.host, //['mail.yahoo.com', 'smtp.gmail.com']
      port: portNo,
      secure: mailerOps.secure,
      auth: {
          user: mailerOps.auth.user,
          pass: mailerOps.auth.pass
      }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: mailerOps.from,
      to: sendTo,
      subject: 'multiTest',
      text: 'secure working?',
      html: '<b>Hello world?</b>',
      attachments: [
        {
            filename: 'test.txt',
            path: './test.txt',
            cid: 'beneaves01@hotmail.com' // should be as unique as possible
        }
    ]
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  });
}

//sendEmail()

lf = function(v,i,e) {
  var items = _.clone(arr);
  fs.readdir(v + i, function(err, file) {
    if (err) {
      console.log(err);
      return;
  }
  _.forEach(file, function(f) {
      items.push(f)
  });

  modJSON.path(urls.files)
    .modify(e+'['+i+']', items)
  });
}



lfCompiler = function(e,i) {
  var items = _.clone(arr);

  fs.readdir(e, function(err, appFile) {
    if (err) {
      console.log(err);
    } else {
      _.forEach(appFile, function(f) {
          items.push(f.slice(0,-4))
      });
      modJSON.path(urls.files)
        .modify('compiler['+i+']', items)
      }

  });
}


function ignoreFunc(file, stats) {
    return stats.isDirectory() && path.basename(file) == ["bin"];
}
function ignoreFunc2(file, stats) {
    return stats.isDirectory() && !path.basename(file) == ["test"];
}
function ignoreFunc3(file, stats) {
    return stats.isDirectory() && path.basename(file) == [".bin"];
}

function cleanDirs(toDel){
  fs.readdir('./node_modules', function(e,i){
    //console.log(JSON.stringify(i,0,2))
    var dirList = _.clone(arr),
    dirList2 = _.clone(arr);
    _.forEach(i,function(item){
      dirList.push('./node_modules/'+item+'/'+toDel+'/')
    })

    _.forEach(dirList,function(item){
      fs.pathExists(item,function(i,e){
        if (e){
          fs.remove(item,function(err){
            if (err) throw err;
            console.log(chalk.greenBright('[delete:success] ',chalk.cyanBright(item)));
          })
        }
      })
    })
  })
}


exports.getfileCompiler = function(){
  _.forIn({'admin':urls.devAdminCss,'app':urls.devAppCss},function(i,e){
    lfCompiler(i,e)
  });
}

exports.getfileAdmin = function(){
  _.forEach(dtypes, function(f) {
      lf('./dev/admin/',f,'admin')
  });
}

exports.getfileApp = function(){
  _.forEach(dtypes, function(f) {
      lf('./dev/app/',f,'app')
  });
}

function mapFiles(){
  var items = _.clone(arr),
  working = process.cwd()
  toSearch = '/admin/public/';
  fs.walk(process.cwd()+toSearch)
    .on('readable', function () {
      var item
      while ((item = this.read())) {
        items.push({"dir":item.path.slice(working.length + toSearch.length),"size":item.stats.size})
      }
    })
    .on('end', function () {
      console.dir(items) // => [ ... array of files]
    })
}
//mapFiles()

exports.stats = {
    dir:{
      homedir: os.homedir(),
      cwd: process.cwd()
    },
    info:{
      ostype: os.type(),
      platform: os.platform(),
      nodeVersion: process.version
    }
  }

exports.setAPI = function(i){
  console.log(i);
  modJSON.path(urls.appAPI)
    .modify('API', i);
}

exports.testSocket = function(i){
  i.emit('testSocket','working')
}

exports.checkV = function(i,e){
  exec(i+' -v', (err, stdout, stderr) => {
      if (err) {
          console.log(chalk.red(`[CustomCMD]: ${stderr}`));
      } else {
        var res = stdout.slice(0,-1);
        config.app.node[i] = res;
        fs.writeFile(urls.config + '.json', JSON.stringify(config,0,2), (err) => {
          if (err) throw err;
        });
      }
  });
}

exports.setGallery = function(i){
  modJSON.path(urls.gallery)
    .modify('images', i);
}

exports.setPreload = function(i){
  modJSON.path(urls.preload)
    .modify('images', i);
}

exports.setLinks = function(i){
  modJSON.path(urls.links)
    .modify('links', i);
}

exports.minifyHtml = function(i){
    return {"data":minify(i.data, htmlMin)}
}

exports.beautify = function(i){
  return {"data":beautify(i.data, {format: i.format})}
}

exports.toPUG = function(i){
    return {"data":html2pug(i.data, { fragment: true })}
}

exports.PUGCommit = function(i){
    return {"data":beautify(pug.render(i.data),{format: 'html'})}
}

exports.postCommit = function(i){
  modJSON.path(urls.posts)
    .add('posts', i.data);
}

exports.templateCommit = function(i){
  if (!_.find(postTemplates.postTemplates, { 'title': i.data.title})) {
    modJSON.path(urls.templates)
      .add('postTemplates', i.data);
  }
}

exports.setMeta = function(i){
    modJSON.path(urls.siteTemplates)
      .modify('siteTitle', i.title)
      .modify('meta', i.meta);
}

exports.siteTemplateCommit = function(i){
  if (!_.find(siteTplData.templates, { 'title': i.data.title})) {
    modJSON.path(urls.siteTemplates)
      .add('templates', i.data);
  }
}

exports.deleteTplData = function(i){
    modJSON.path(urls.templates)
      .modify('postTemplates', i.data);
}

exports.deleteSiteTplData = function(i){
    modJSON.path(urls.siteTemplates)
      .modify('templates', i.data);
}

exports.postEdit = function(i){
    console.log('postData: ' + JSON.stringify(i));
    var editedPost = posts.posts
    editedPost = _.reject(editedPost, {'id': i.data.id});
    editedPost = _.concat(editedPost, i.data);
    editedPost = _.sortBy(editedPost, ['id']);
    modJSON.path(urls.posts)
      .modify('posts', editedPost);

}

exports.deletePost = function(i){
    modJSON.path(urls.posts)
      .modify('posts', i.data);
}

exports.updateVersions = function(){
  var moduleV = _.clone(arr);
  _.forEach(versions.modules, function(i) {

    xtc = require('../../../node_modules/'+i+'/package.json').version;
    moduleV.push({"title":i,"version":xtc});
    //console.log(moduleV);
    });
    modJSON.path(urls.versions)
      .modify('versions', moduleV);
}




exports.logLimit = function(){
  var ojt = _.clone(obj),
  limit = config.app.logging.file.fileLimit,
  x = logs.logs;
  if ((x.length) > (limit)){
    var logFilter =  x.slice(x.length-(x.length - limit));
    ojt.logs = logFilter;
      fs.writeFile(urls.logs, JSON.stringify(ojt), (err) => {
        if (err) throw err;
      });
  }
}


exports.loadIt = function(i,socket){
  fs.readFile(i, 'utf8', function read(err, data) {
    if (err) {
        throw err;
    } else {
      socket.emit('loadit', data);
    }
  });
}

exports.deleteDirs = function(){
  _.forEach(nModTasks.deleteDirs,function(i){
    cleanDirs(i)
  })
}



exports.cleanUp = function(){
  recursive('./node_modules/', _.flatten([nModTasks.ignoreExt,ignoreFunc]),function(err, files) {
    _.forEach(nModTasks.notExpectedFiles,function(i){
      _.pull(files, i)
    });
    fs.writeFile('./toDelete.json',JSON.stringify(files,0,2),'utf8',function(err){
      if (err) throw err;
    })

    _.forEach(files,function(i){
      fs.unlink('./'+i, (err) => {
        if (err) throw err;
        console.log(chalk.greenBright('[delete:success] ',chalk.cyanBright('./'+i)));
      });
    })
  })
}

exports.minJson = function(){
  var x = _.pull(nModTasks.ignoreExt, "*.json")
  recursive('./node_modules/', _.flatten([x,ignoreFunc]),function(err, files) {
    _.forEach(files,function(i){
      if (path.basename(i) ==="package.json"){
        //console.log(i)
        modJSON.path(i)
          .del('_npmOperationalInternal')
          .del('_args')
          .del('_inCache')
          .del('_nodeVersion')
          .del('_npmUser')
          .del('_npmVersion')
          .del('_shrinkwrap')
          .del('_from')
          .del('_id')
          .del('_inBundle')
          .del('_integrity')
          .del('_location')
          .del('_phantomChildren')
          .del('_requested')
          .del('_requiredBy')
          .del('_resolved')
          .del('_shasum')
          .del('_spec')
          .del('_where')
          .del('author')
          .del('devDependencies')
          .del('readme')
          .del('bugs')
          .del('description')
          .del('license')
          .del('licenses')
          .del('homepage')
          .del('repository')
          .del('url')
          .del('email')
          .del('dist')
          .del('gitHead')
          .del('maintainers')
          .del('contributors')
          .del('keywords');

      }
      fs.readFile('./'+i,'utf8',function(err,data){
        if (err) throw err;
        fs.writeFile('./'+i,jsonMin.minify(data),'utf8',function(err){
          if (err) throw err;
          console.log(chalk.greenBright('[minJson:success] ',chalk.cyanBright('./'+i)));
        })
      })
    })
  })
}

exports.minJS = function(){
  var x = _.pull(nModTasks.ignoreExt, "*.js")
  recursive('./node_modules/', _.flatten([x,ignoreFunc3]),function(err, files) {
    _.forEach(files,function(i){
      if (path.extname(i) ===".js"){
        var url = "./"+i;
        fs.readFile(url, 'utf8', function(err, toUg) {
        var data = UglifyJS.minify(toUg,{mangle: false});
        if (data.error) {
          console.log(chalk.redBright('[uglify:fail] ',chalk.cyanBright(url)));
        } else {
          fs.writeFile(url, data.code, (err) => {
            if (err) throw err;
            console.log(chalk.greenBright('[uglify:success] ',chalk.cyanBright(url)));
          });
        }
      });
      }
    });
  })
}
