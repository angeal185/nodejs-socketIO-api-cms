
var socket = io.connect(),
arr = [],
obj = {};

function removeAPI(){
  $('.removeApi').click(function() {
    $(this).parents('.col-md-4').remove();
  });
}

function initApi(a){
  socket.addEventListener(a, function (i) {
    if (status === 'api'){
      var y = i.API;
    }
    else if (status === 'links'){
      var y = i.links;
    }
    _.forEach(y, function(val, e) {
      if (status === 'api'){
        var x = { 'title': _.startCase(e),'name':'API  key','apiKey': val.apiKey,'url':val.url };
      }
      else if (status === 'links'){
        var x = { 'title': _.startCase(e),'name':'icon','apiKey': val.icon,'url':val.url };
      }
      $('.APIData').append(apiMainTpl(x));
    });
    removeAPI();
  });
  socket.emit(a);
}

function initGallery(x){
  socket.addEventListener(x, function (i) {
    var out = i.images;
    _.forEach(out, function(val, e) {
      console.log(JSON.stringify(val.url));
      $('.APIData').append(apiMainTpl({ 'title': val.title,'name':'TITLE','apiKey': val.title,'url':val.url }));
    });
    removeAPI();
  });
  socket.emit(x);
}

function updateAPIData(b){
  var apiData = _.clone(arr);
  var apiData2 = _.clone(arr);
  $('.card').each(function(index, el) {
    var APIKey = $(this).find('.APIKey').val();
    var APIUrl = $(this).find('.APIUrl').val();
    apiData.push(_.camelCase($(this).find('.APITitle').text()));
    if (status === 'api'){
      apiData2.push({"apiKey":APIKey,"url":APIUrl});
      console.log('status api')
    }
    else if (status === 'links'){
      apiData2.push({"icon":APIKey,"url":APIUrl});
    }

  });
  var x = _.zipObject(apiData, apiData2);
  console.log(JSON.stringify(x))
  socket.emit(b,x);
}

function updateGalData(x){
  var apiData = _.clone(arr);
  $('.card').each(function(index, el) {
    var title = $(this).find('.APIKey').val();
    var url = $(this).find('.APIUrl').val();
    apiData.push({"title":title,"url":url});
  });
  console.log(JSON.stringify(apiData))
  socket.emit(x,apiData);
}

function apiEvents(e){
  $('#APINew').click(function() {
    $('.APINewTitle,#APIUpdate').unbind();
    $('.APIData').append(e);
    $('.APINewTitle').keyup(function(i) {
      $(this).parents('.card').find('.APITitle').text(this.value);
    });
    removeAPI();
    ud();
  });
}
function ud(){
  $('#APIUpdate').click(function() {
    if (status === 'api') {
      updateAPIData("setAPI")
    } else if (status === 'links') {
      updateAPIData("setLinks")
    } else if (status === 'gallery') {
      updateGalData('setGallery')
    } else if (status === 'preload') {
      updateGalData('setPreload')
    }
  });
}
ud();
