var socket = io.connect({
  reconnectionAttempts: config.socketIO.reconnectionAttempts
}),
a = {},
entries = [];

function disableBtn(i) {
  $(i).attr('disabled', 'true')
}

function enableBtn(i) {
  $(i).removeAttr('disabled')
}

function append(i,e){
  $(i).append(e)
}

function prepend(i,e){
  $(i).prepend(e)
}

function before(i,e){
  $(i).before(e)
}

function toggleClick(a,b,c){
  $(a).click(function() {
    b.toggle(c);
  });
}



if(typeof(Storage) !== "undefined") {
  var vResult = sessionStorage.getItem("updateStatus")
  if  (_.isNull(vResult)){
    getVersionNumber()
  } else if (_.eq(vResult, "upToDate")) {
    globeGreen('globeC','App v' + config.app.version + ' up to date');
  } else if (_.eq(vResult, "updateRequired")) {
    globeOrange('globeC','App update available');
  }
} else {
    globeRed('globeC','No Web Storage support..');
    console.log('No Web Storage support..');
}

function getVersionNumber(){
  $.getJSON(config.app.updateUrl, function( data ) {
    if (data.version === config.app.version) {
      globeGreen('globeC','App v' + data.version + ' up to date');
      sessionStorage.setItem("updateStatus", "upToDate");
      console.log('up to date!');
    } else if (data.version !== config.app.version){
      globeOrange('globeC','App update available');
      sessionStorage.setItem("updateStatus", "updateRequired");
      console.log('app update required!');
    }
  })
  .fail(function() {
    console.log( "offline mode" );
  });
}

function socketOnline(){
  socket.addEventListener("socketOnline", function () {
    globeGreen('globeA',config.socketIO.msgs.online)
  });
}

function socketOffline(){
  socket.addEventListener("reconnect_failed", function () {
    globeRed('globeA',config.socketIO.msgs.reconnectF)
  });
}

function socketReconnect(){
  socket.addEventListener("reconnect_attempt", function () {
    globeOrange('globeA',config.socketIO.msgs.reconnectA)
  });
}

function socketError(){
  socket.addEventListener("disconnect", function () {
    globeRed('globeA',config.socketIO.msgs.dissconnect)
  });
}

function goGlobes(){
  socketOnline()
  socketReconnect()
  socketError()
  socketOffline()
}

function createInputs(index){
  _.forEach(index, function (i) {
      $('.inputData').append('<div class="col-md-6 col-sm-12"><label>'+_.startCase(i)+'</label><input id="'+i+'" type="text" class="form-control"></div>')
  });
  createPostBtn(config.createPostBtn)
}

function buildPreview(){
  _.forEach(config.previewInput, function (i) {
      $('#previewMenu .row').append('<div class="col-md-6 col-sm-12"><label>'+_.startCase(i.id)+'</label><input id="preview'+i.id+'" type="text" class="form-control" value="'+i.value+'"></div>')
  });
}

function createPostBtn(index){
  _.forIn(index, function(i, e) {
    $('#ctrl').append('<div class="col-md-3"><button type="button" id="'+e+'" class="btn btn-primary btn-block mb10 shrink">'+i+'</button></div>');
  });
}

function initEditor(){
  _.forEach(postEditorsObj, function(i) {
    i.id.setTheme("ace/theme/twilight");
    i.id.getSession();
    i.id.session.setMode("ace/mode/"+i.type);
    i.id.commands.addCommand({
      name: "showSettingsMenu"+i.type,
      bindKey: {
        win: "Ctrl-"+i.key2,
        mac: "Command-"+i.key2
      },
      exec: function (editor) {
        ace.config.loadModule("ace/ext/settings_menu", function (module) {
          module.init(editor);
          i.id.showSettingsMenu()
        })
      }
    });

  });
}

function bindCreateInput(){
  _.forEach(config.postCreate.input, function (i) {
    function bindKeys() {
      a[i] = this.value;
      timestamp();
      $('#out').html(JSON.stringify(_.omit(a, ['entry']), 0, 2));
      highlightUd("code");
    }
    $('#' + i).keyup(_.debounce(bindKeys, 1000));
  });
}

function bindTpl(){
  function bindtitle() {
    a['title'] = this.value;
    $('#out').html(JSON.stringify(_.omit(a, ['entry']), 0, 2));
    highlightUd("code");
    console.log(JSON.stringify(a))
  }
  $('#title').keyup(_.debounce(bindtitle, 1000));
}

function timestamp() {
  a.date = _.now();
}

function highlightUd(item) {
  $(item + '#out').each(function (i, block) {
    $(this).removeClass('hidden'),
    hljs.highlightBlock(block);
  });
}

function bindKey() {
  a['tags'] = _.split(this.value, ',');
  timestamp();
  $('#out').html(JSON.stringify(_.omit(a, ['entry']), 0, 2));
  highlightUd("code");
  console.log(JSON.stringify(a));
}

function previewHeight(){
  $('#previewMenu,#previewDiv').css('height', this.value);
}
function previewBackground(){
  $('#previewMenu,#previewDiv').css('background', '#'+this.value);
}
function previewColor(){
  $('#previewMenu,#previewDiv').css('color', '#'+this.value);
}
function previewFontSize(){
  $('#previewMenu,#previewDiv').css('font-size', this.value);
}

function mdSet() {
  var out = _.unescape(markdown.toHTML(editor.getValue()));
  MD.setValue(out);
}

function mdUpdate() {
  editor.setValue(toMarkdown(MD.getValue()))
}

function editorSwitch(){
  $('.switch').click(function (event) {
    $('.markdwn, .pug').toggle(),
    $('.switch').toggleClass('red');
  });
}

function initPreview(){
  buildPreview()
  $('#previewBtn').click(function(event) {
    $('#previewMenu,#previewDiv').toggle();
    if (($(this).text())===('settings')){
      $(this).text('preview');
    } else {
      $(this).text('settings');
    }
  });



  $('#previewBackground,#previewColor').addClass('jscolor');
  $.getScript( "/js/jscolor.min.js");
  $('#previewHeight').keyup(_.debounce(previewHeight, 1000));
  $('#previewBackground').change(_.debounce(previewBackground, 1000));
  $('#previewColor').change(_.debounce(previewColor, 1000));
  $('#previewFontSize').keyup(_.debounce(previewFontSize, 1000));
  $('select').each(function (index, el) {
    $(this).addClass('custom-select');
  });
}

function previewUpdate() {
  $('#previewDiv').html(MD.getValue());
  a.entry = $('#previewDiv').html();
  highlightUd("code");
}

function minHtml(){
  socket.addEventListener("minifyHtml", function (i) {
    a.entry = i.data;
    console.log(a);
  });
}

function editorListeners(){
  socket.addEventListener("PUGCommit", function (i) {
    MD.setValue(i.data);
  });
  minHtml();
}

function getPostsData(){
  socket.addEventListener("getPostData", function (i) {
    entries = i.posts;
    a.id = entries.length + 1;
    $('#id').val(a.id).attr('disabled', true);
  });
  socket.emit('getPostData');
}

function getTplData(x,y){
  socket.addEventListener(x, function (data) {
    console.log(data);
    $('.tplList').empty();
    $('*.tplOption,.closeTpl,.tpl-delete').unbind();
    _.forEach(data, function (i) {
      $('.tplList').append('<span class="tplOption shrink">'+i.title+'</span>')
    });
    $('.tplOption').click(function() {
      var choice = this.innerHTML;
      var val = _.filter(data, { 'title': choice});
      $('.tpl-selected').html(choice);
      $('.tpl-delete').fadeIn('slow');
      MD.setValue(val[0].entry);
    });
    $('#tplMenu').toggle('slow');
    $('.closeTpl').click(function() {
      $('#tplMenu').toggle('slow');
    });

    $('.tpl-delete').click(function() {
      var selected = $('.tpl-selected').html();
      var toRemove = _.reject(data, { 'title': selected});
      console.log(toRemove)
      socket.emit(y,{data:toRemove});
    });
  });

  $('#getTplData').click(function () {
    $('.tpl-label').fadeIn('slow');
    socket.emit(x);
  });
}

function MDSettingsInit(i){
  $('#MDSettings').click(function () {
    MD.execCommand("showSettingsMenu"+i)
  });
}

function mdEvents(){
  MDSettingsInit("html");
  MD.on("change", _.debounce(previewUpdate, 500));
}

function pugEvents(){
  $('#PUGSettings').click(function () {
    PUG.execCommand("showSettingsMenujade")
  });
  $('#PUGCommit').click(function () {
    socket.emit('PUGCommit', {"data": PUG.getValue()});
  });
}
function hjsIt(e){
  $(e).each(function (i, block) {
    hljs.highlightBlock(block);
  });
}

function maskIn(i){
  bubbles();
  $(".mask").fadeIn('0.5s');
  $('.menu-btn').css('display','none');
  $(i).fadeIn('slow');
}

function maskOut(i){
  $(".mask").fadeOut('0.5s');
  $('.menu-btn').css('display','inline-block');
  $(i).fadeOut('slow');
  $(".bubble-container").remove();
}

function initBottomNav(){
  before('.bottomNav',preDiv({"divClass":"logsDiv","preClass":"json"}))

  if (config.app.console){
    append(".miniBtnDiv",miniBtnTpl({"id":"consoleBtn","title":"console"}))
    consoleActivate();
  }

  if (config.socketIO.debug){
    append(".miniBtnDiv",miniBtnTpl({"id":"socketBtn","title":"socket"}))
    socketDebug();
  }

  if (config.app.logging.file.enabled){
    append(".miniBtnDiv",miniBtnTpl({"id":"logsBtn","title":"Logs"}))
    getLogs()
    bindLogs('#logsBtn');
  }
}

function bindLogs(i){
  var ml = 'monitorLogs';
  var ld = '.logsDiv';
  $(i).click(function() {
    $('#consoleBtn').removeClass('consoleMonitoring');
    $('#socketBtn').removeClass('socketMonitoring');
    $('.consoleDiv,.socketDiv').css('display','none');
    if ($(this).hasClass(ml)){
      $(this).removeClass(ml);
      maskOut(ld);
      $('.logsDiv pre').empty();
    } else {
      $(this).addClass(ml);
      socket.emit('getLogs');
      maskIn(ld)
    }
  });
}

function getLogs(){
  socket.addEventListener("getLogs", function (i) {
    var logLength = i.logs.length
    console.log(logLength)
    var logFilter =  i.logs.slice((logLength - config.app.logging.consoleLimit));
    _.forEachRight(logFilter, function(e,a) {
        $('.logsDiv pre').append(logsTpl({"time":e.time,"method":e.method,"url":e.url,"status":e.status,"size":e.size,"resTime":e.resTime}))
    });
  });
}

function consoleActivate(){
  var cd = $('.consoleDiv'),
  cdp = $('.consoleDiv pre'),
  civ = $('.consoleInput'),
  csb = '#consoleBtn',
  csb2 = $('.consoleBtn');
  var cnsm = 'consoleMonitoring';

  socket.addEventListener("execCmd", function (i) {
    prepend(cdp,'[' + new Date().toLocaleTimeString() + '] '+ JSON.stringify(i,0,2) +'\n')
    hjsIt(cdp)
  });
  hjsIt(cdp)
  $(csb).click(function(event) {
    $('#logsBtn').removeClass('monitorLogs'),
    $('#socketBtn').removeClass('socketMonitoring');
    $('.logsDiv,.socketDiv').css('display','none');
    $('.logsDiv pre').empty();
    if ($(this).hasClass(cnsm)){
      $(this).removeClass(cnsm);
      maskOut(cd);
      civ.unbind();
    } else {
      $(this).addClass(cnsm);
      civ.unbind();
      maskIn(cd);
      civ.keyup(function(event) {
        if (event.keyCode === 13) {
          csb2.click();
        }
      });
    }
    setTimeout(function(){
      $('.consoleWarning').fadeOut('slow')
    }, 1500);
  });
  csb2.click(function(event) {
    prepend(cdp,'[' + new Date().toLocaleTimeString() + '] ' + $('.consoleInput').val() +'\n')
    hjsIt(cdp)
    socket.emit('execCmd',civ.val())
    civ.val('')
  });
}

function socketDebug(){
  var sd = $('.socketDiv'),
  sdp = $('.socketDiv pre'),
  ssb = $('#socketBtn'),
  snsm = 'socketMonitoring';

  hjsIt(sdp)
  ssb.click(function() {
    $('#logsBtn').removeClass('monitorLogs'),
    $('#consoleBtn').removeClass('consoleMonitoring');
    $('.consoleDiv,.logsDiv').css('display','none');
    sdp.empty();
    if ($(this).hasClass(snsm)){
      $(this).removeClass(snsm);
      maskOut(sd);
    } else {
      $(this).addClass(snsm);
      maskIn(sd);
    }
  });
}

function initGlobes(){
  _.forIn(config.globes, function (i,e) {
    $('.globeDiv').append(globeTpl({"id": e}));
      globeRed(e,i)
  })
}

function globeInfo(i,a,b,c,e){
  $('#'+i).removeClass(a).removeClass(b).addClass(c).unbind().hover(function() {
    $('.globeInfoDiv').html(e).fadeIn('slow');
  }, function() {
    $('.globeInfoDiv').empty().fadeOut('fast');
  });
}

function globeGreen(i,e){
  globeInfo(i,'redGlobe','orangeGlobe','greenGlobe',e)
}

function globeRed(i,e){
  globeInfo(i,'greenGlobe','orangeGlobe','redGlobe',e)
}

function globeOrange(i,e){
  globeInfo(i,'greenGlobe','redGlobe','orangeGlobe',e)
}

function eEvents(){
  $('#editorSettings').click(function (event) {
    editor.execCommand("showSettingsMenumarkdown")
  });
  editor.on("change", _.debounce(mdSet, 1000));
}

function editorEvents(){
  mdEvents();
  pugEvents();
  eEvents();
}

function tagsInit(){
  $('#tags').keyup(_.debounce(bindKey, 1000));
}

function postAlert(){
  _.forEach(config.postAlertMsg, function(i, e) {
    $(i.id).on('focus', function () {
      $('.alert-div').html('<p class="blink">'+i.msg+'</p>');
    });
  });
}

function commitNewPost(i){
  $('#updateMD').click(function () {
    socket.emit('minifyHtml', {"data": a.entry});
  });
  $('#commit').click(function () {
    socket.emit(i, {"data": a});
  });
}

function commitEnable(){
  $('#commit').attr('disabled', 'true');
  $('#updateMD').click(function() {
    $('#commit').removeAttr('disabled');
  });
}

function initEditPostInput(){

  _.forIn(_.omit(data, ['entry']), function(i, e) {
    $('.inputData').append('<div class="col-md-6"><label>'+_.startCase(e)+'</label><input id="'+e+'" class="form-control" value="'+i+'"></div>');
    function bindEditKeys() {
      if ((e)===('tags')) {
        data['tags'] = _.split(this.value, ',');
      } else {
        data[e] = this.value;
      }
      $('#out').html(JSON.stringify(_.omit(data, ['entry']), 0, 2));
      highlightUd("code");
      console.log(JSON.stringify(data, 0, 2))
    }
    $('#' + e).keyup(_.debounce(bindEditKeys, 1000));
  });
  _.forIn(config.editPostBtn, function(i, e) {
    $('#ctrl').append('<div class="col-md-3"><button type="button" id="'+e+'" class="btn btn-primary btn-block mb10 shrink">'+i+'</button></div>');
  });
  $('#updateMD').click(function () {
    data.entry = MD.getValue();
    socket.emit('minifyHtml', {"data": data.entry});
  });
  $('#commit').click(function () {
    console.log(JSON.stringify(data))
    socket.emit('postEdit', {"data": data});
  });
}

function initEditPost(){
  $('#out').removeClass('hidden').html(JSON.stringify(_.omit(data, ['entry']), 0, 2));
  highlightUd("code");
  $('#id, #date').attr('disabled', true);
  MD.setValue(data.entry);
  socket.addEventListener("postEdit", function (i) {
    console.log('success')
  });
}

function toPUG(){
  socket.addEventListener("toPUG", function (i) {
    PUG.setValue(i.data);
  });
  $('#toPUG').click(function () {
    socket.emit('toPUG', {"data": MD.getValue()});
  });
}

function toMARK(){
  $('#toMARK').click(function () {
  editor.setValue(MD.getValue());
  });
}

function beautifyHTML(){
  socket.addEventListener("beautify", function (i) {
    MD.setValue(i.data);
  });
  $('#beautify').click(function () {
    socket.emit('beautify', {"data": MD.getValue(),"format":"html"});
  });
}


function buildShema(){

  var base = {
    "@context": "http://www.schema.org",
    "@type": "",
    "address": {
      "@type": "PostalAddress"
    },
    "contactPoint": {
      "@type": "ContactPoint"
    }
  }

  $('.card-body').append(ldTpl({"title": "type","id": "typeOf"}))
  $('#typeOf').attr('placeholder','website/busines...');

  _.forEach(schema.jsonLd, function (i) {
    $('.card-body').append(ldTpl({"title": i.title,"id": i.id}))
  })

  _.forIn(config.schema.schemaBtns, function (a,b) {
    $('.card-footer').append(btnTpl({"id": b,"title": a}))
  })

  $('#rmvContact').click(function(event) {
    base = _.omit(base,'contactPoint');
    MD.setValue(buildLd(JSON.stringify(base,0,2)))
    _.forIn(third, function(value, key) {
      $('#'+value).parents('.ldItem').remove();
    });
    enableBtn('#updateSchema');
  });

  $('#rmvAddress').click(function(event) {
    base = _.omit(base,'address');
    MD.setValue(buildLd(JSON.stringify(base,0,2)))
    _.forIn(second, function(value, key) {
      $('#'+value).parents('.ldItem').remove();
    });
    enableBtn('#updateSchema');
  });

  $('#typeOf').keyup(function() {
    base['@type'] = this.value;
    MD.setValue(buildLd(JSON.stringify(base,0,2)))
    console.log(JSON.stringify(buildLd(JSON.stringify(base,0,2))));
    enableBtn('#updateSchema');
  });

  _.forIn(first, function (i,e) {
    $('#'+i).keyup(function() {
      base[e] = this.value;
      var arry = _.clone(entries);
      _.forIn(base, function(value, key) {
        if (value === ""){
          arry.push(key)
        }
        });
        MD.setValue(buildLd(JSON.stringify(_.omit(base,arry),0,2)))
        console.log(JSON.stringify(buildLd(JSON.stringify(base))));
        enableBtn('#updateSchema');
    });
  })
  _.forIn(second, function (i,e) {
    $('#'+i).keyup(function() {
      base.address[e] = this.value;
      var arry = _.clone(entries);
      _.forIn(base.address, function(value, key) {
        if (value === ""){
          arry.push(key)
        }
        });
        base.address = _.omit(base.address,arry);
      MD.setValue(JSON.stringify(base,0,2))
      enableBtn('#updateSchema');
    });
  })
  _.forIn(third, function (i,e) {
    $('#'+i).keyup(function() {
      base.contactPoint[e] = this.value;
      var arry = _.clone(entries);
      _.forIn(base.contactPoint, function(value, key) {
        if (value === ""){
          arry.push(key)
        }
        });
        base.contactPoint = _.omit(base.contactPoint,arry);
      MD.setValue(JSON.stringify(base,0,2))
      enableBtn('#updateSchema');
    });
  })
  $('#updateSchema').click(function (event) {
    console.log(base)
    //socket.emit('setSchema', base)
  });
}

function buildLd(i){
  return "<scri"+"pt type='application/ld+json'>\n"+i+"\n</scri"+"pt>";
}

function updateTimestamp(i){
  return i.toLocaleString()
}

function initPosts(){
  _.forEach(['id','title','date','category'] , function(i){
    $('.sortBy').append('<button type="button" id="'+i+'Btn" class="btn btn-primary sortByBtn shrink">'+_.capitalize(i)+'</button>');
  });

  socket.addEventListener("getPostData", function (items) {
    var newPosts = _.clone(items.posts);
    function empyPosts(){
      $('.postsDiv').empty();
      $('.deleteEntries,.editEntries').unbind();
    }

    function appendPosts(i){
      $('.postsDiv').append('<div class="col-md-6"><div class="card"><div class="card-title"><h5 class="inline nGreen">Title: <span class="blink grey">'+i.title+'</span><span id="'+i.id+'" class="deleteEntries">delete</span><span class="editEntries">edit</span></h5><h6 class="nGreen">Date: <span class="blink grey">'+updateTimestamp(i.date)+'</span></h6><h6 class="nGreen">Author: <span class="blink grey">'+i.author+'</span></h6><h6 class="nGreen">Category: <span class="blink grey">'+i.category+'</span></h6><h6 class="nGreen">Tags: <span class="blink grey">'+i.tags+'</span></div></div>');
    }

    function allPosts(sort){
      empyPosts();
      _.forEach(_.sortBy(items.posts, [sort]), function(i,e) {
        appendPosts(i);
      });
    }

    function postsEvents(){
      $('.deleteEntries').click(function() {
        newPosts = _.reject(newPosts, { 'id': _.parseInt(this.id) });
        $(this).parents('.col-md-6').remove();
        _.forEach(newPosts, function(i,e) {
          i.id = e+1;
        });
        socket.emit('deletePost', {"data":newPosts});
      });
      $('.editEntries').click(function(event) {
        var toFilter = $(this).prev('.deleteEntries').attr('id');
        $('#postData').val(toFilter);
        $('#toSubmit').submit();
      });
    }

    function postSort(){
      $('.sortByBtn').click(function() {
        var i = this.id.slice(0,-3);
        allPosts(i);
        $('#sortByLbl').html(_.capitalize(i));
        postsEvents();
      });
    }

    allPosts('id');
    postsEvents();
    postSort();
  });

  socket.emit('getPostData');
  socket.addEventListener("success", function (i) {
    showtoast('success');
  });
}

function addcard(a,e,i){
  $("#"+a).append('<div class="col-md-3"><div class="card statusCard shrink"><h4 class="card-title nGreen">'+e+'</h4><h5 class="blink">'+i+'</h5></div></div>');
}

function initAPI(){
  _.forEach(["versions","status","statistics"], function(i) {
    $(".w90").append('<h3>'+i+'</h3><div id="'+i+'" class="row"></div>');
  });

  socket.addEventListener("getVersions", function (i) {
    _.forEach(config.app.node, function(value, key) {
      addcard("versions",key,"v"+value);
    });
    _.forEach(i.versions, function(value, key) {
      addcard("versions",value.title,"v"+value.version);
    });
    _.forEach(i.fw, function(value, key) {
      addcard("versions",value.title,"v"+value.version);
    });
  });


  socket.addEventListener("getStats", function (i) {
    addcard("status","Platform",i.info.platform);
    addcard("status","OS",i.info.ostype);
    addcard("versions","Nodejs",i.info.nodeVersion);
    addcard("status","CWD",i.dir.cwd);
    addcard("status","homedir",i.dir.homedir);
  });

  socket.addEventListener("sendTimed", function (i) {
    $('#statistics').empty();
    addcard("statistics","Uptime",i.uptime+"s");
    addcard("statistics","totalmem",i.totalmem);
    addcard("statistics","freemem",i.totalmem);
    addcard("statistics","nodemem",i.nodeMemUsage);
    addcard("statistics","cpuUsage:user",i.cpuUser);
    addcard("statistics","cpuUsage:system",i.cpuSystem);
  });

  setInterval(function(){
    socket.emit('sendTimed');
  }, 3000);
  socket.emit('getStats');

  socket.emit('getVersions');
}

function checkUpdates(){
var xhr;

   xhr = new XMLHttpRequest();
   xhr.open('GET', 'https://raw.githubusercontent.com/angeal185/js-scripts/master/json/nodeRunner.json', true);
   xhr.send();
   xhr.onreadystatechange = function() {
     var latest,current,info,data,result;
     latest = document.getElementById('updateResult');
     current = document.getElementById('currentV');
     info = document.getElementById('currentInfo');
     if (this.readyState !== 4) {
       return;
     }
     if (this.status !== 200) {
       latest.innerHTML += 'OFFLINE';
       return;
     }

     data = JSON.parse(this.responseText);
     result = 'V' + data.latest;
     latest.innerHTML += result;

     //console.log(current)
     if (result === current.innerHTML) {
       console.log(result);
       info.classList.add('success');
       info.innerHTML += 'UP TO DATE';

       } else {
         info.classList.add('fail');
         info.innerHTML += 'UPDATE REQUIRED';
     }
   };
 }

 function buildEditorInput(){
   _.forIn(config.editorInput, function(i,e){
     $('.editorInputs').append(editorInpitTpl({"label":e,"cls":i}));
   });
 }

 function commitEditorData(){
   $('#commit').click(function() {
     var dirFull = $('.dirFullInput').val();
     socket.emit('editorSave', {"file": dirFull, "data": MD.getValue()});
   });
 }

 function tglMBBtn(i){
   $('#minify,#beautify').attr('disabled',i);
 }

 function initEditorSelect(){
   socket.addEventListener("loadit", function (i) {
     MD.setValue(i)
   });
   socket.addEventListener("beautify", function (i) {
     MD.setValue(i.data);
   });

   $('.ace_editor').css('height','600px')

   $('.treeSelect').click(function(event) {
     var title = this.innerHTML;
     var dir = _.toLower($(this).parents('ul').children('h3').html());
     var type = $(this).parents('ul').prev('.menuHead').children('strong').html();
     if (dir === 'admin'){
       var toLoad = _.join(['./dev', dir,type,title], '/');
     } else if (dir === 'app') {
       var toLoad = _.join(['./dev', dir,type,title], '/');
     }else if (dir === config.app.compiler) {
       var toLoad = _.join(['./dev', type, dir, title], '/');
     }

     if (type === 'css'){
       tglMBBtn(false);
       MD.session.setMode("ace/mode/"+type);
       beautifyIt(type);
       minIt('minCss');
     } else if (type === 'js') {
       var ext = 'javascript';
       tglMBBtn(false);
       MD.session.setMode("ace/mode/"+ext);
       beautifyIt(type);
       minIt('uglifyJs');
     } else if (type === 'data') {
       var ext = 'json'
       tglMBBtn(false);
       MD.session.setMode("ace/mode/"+ext);
       beautifyIt(ext);
       minIt('minHtml');
     } else if (dir === config.app.compiler) {
       MD.session.setMode("ace/mode/"+config.app.compiler);
       tglMBBtn(true);
     }
     $('.titleInput').val(title);
     $('.dirInput').val(dir);
     $('.dirFullInput').val(toLoad);
     $('.fileModeInput').val(type);
     socket.emit('loadit',toLoad);
   });
   $('#minify').click(function(event) {
     socket.emit('minHtml',MD.getValue());
   });
 }

 function beautifyIt(e){
   $('#beautify').unbind();
   $('#beautify').click(function () {
     socket.emit('beautify', {"data": MD.getValue(),"format":e});
   });
 }
 function minIt(e){
   $('#minify').unbind();
   $('#minify').click(function () {
     socket.emit(e, MD.getValue());
   });
 }

 function getEditorFiles(){
   socket.addEventListener("getEditorFiles", function (res) {
     //console.log(JSON.stringify(res.admin,0,2))


     _.forEach(res.admin, function (i,e) {
       $('#adminEditorList').append(fileEditorTpl({"title":e,"type":"admin"}))
       _.forEach(i, function (f) {
         $('.admin'+e+'FileLst').append('<li class="treeSub"><a class="blink treeSelect adminSelect">'+f+'</a></li>')
       });
     });
     _.forEach(res.app, function (i,e) {
       $('#appEditorList').append(fileEditorTpl({"title":e,"type":"app"}))
       _.forEach(i, function (f) {
         $('.app'+e+'FileLst').append('<li class="treeSub"><a class="blink treeSelect appSelect">'+f+'</a></li>')
       });
     });

     if (config.app.compiler !== false) {
       _.forEach(res.compiler, function (i,e) {
         $('#compilerEditorList').append(fileEditorTpl({"title":e,"type":"compiler"}))
         _.forEach(i, function (f) {
           $('.compiler'+e+'FileLst').append('<li class="treeSub"><a class="blink treeSelect compilerSelect">'+_.join([f, config.app.compilerExt], '.')+'</a></li>')
         });
       });
    }

     initEditorSelect()

     $('.treeSelect').click(function() {
       enableBtn('#commit')
     });

     $('#delete').click(function() {
      var arr = _.clone(entries),
      dirVal = $('.dirInput').val(),
      dirFull = $('.dirFullInput').val(),
      fileVal = $('.fileModeInput').val(),
      titleVal = $('.titleInput').val(),
      lst = '.'+$('.dirInput').val()+$('.fileModeInput').val()+"FileLst li a";

       function rmvEditorChoice(i){
         $(i).each(function() {
           if (this.innerHTML === titleVal){
             $(this).remove();
           }
         });
       }

       $(lst).each(function(index, el) {
         arr.push(el.innerHTML);
       });
       if ((dirVal) === 'admin'){
         res.admin[fileVal] = _.pull(arr, titleVal);
         rmvEditorChoice('.adminSelect')

       } else {
         res.app[fileVal] = _.pull(arr, titleVal);
         rmvEditorChoice('.appSelect')
       }
       socket.emit('deleteFile', {"update":res,"remove":dirFull})
     });

     initNav();
   });
   socket.emit('getEditorFiles');
 }


 function helpDiv(a,b){
   var data = [
     {
       AboutDevTypeText: '<span>'+a+'<br/><br/>'+b+'</span>'
     }
   ];

   var allElements = $(".typeing");
   for (var j = 0; j < allElements.length; j++) {
     var currentElementId = allElements[j].id;
     var currentElementIdContent = data[0][currentElementId];
     var element = document.getElementById(currentElementId);
     var devTypeText = currentElementIdContent;

     // type code
     var i = 0, isTag, text;
     (function type() {
       text = devTypeText.slice(0, ++i);
       if (text === devTypeText) return;
       element.innerHTML = text + '<span class="blinker">&#32;</span>';
       var char = text.slice(-1);
       if (char === "<") isTag = true;
       if (char === ">") isTag = false;
       if (isTag) return type();
       setTimeout(type, 60);
     })();
   }
 }
