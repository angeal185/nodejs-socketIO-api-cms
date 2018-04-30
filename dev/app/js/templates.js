_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;


var navTpl = _.template('<nav class="navbar navbar-expand-lg navbar-dark bg-dark"><span class="navbar-brand">Ajax blog</span><button class="navbar-toggler" type="button"><span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse" id="navbarResponsive"><ul id="navLinks" class="navbar-nav ml-auto"></ul></div></nav>');

var navDetails = _.template('<div class="nav-top"><div class="nav-details"><a href="{{url}}" target="_blank">{{info}}</a></div><div class="icn-group"></div></div>');

var navLink = _.template('<li class="nav-item active"><span id="{{id}}" class="nav-link" onclick="{{title}}()">{{title}}</span></li>')

var bodyTpl = _.template('<div id="main-content" class="w90"></div>');

var footerTpl = _.template('<footer class="py-5 bg-dark"><div class="container"><p class="m-0 text-center text-white"><span id="year"> </span> {{author}}</p></div></footer>');

var blogBody = _.template('<div class="row"><div class="col-md-8"><div class="posts"></div><div class="showMore"></div></div><div id="sideBar" class="col-md-4"></div></div>');

var searchTpl = _.template('<div class="card my-4"><h5 class="card-header">{{header}}</h5><div class="card-body"><div class="input-group"><input type="text" id="search" class="form-control" placeholder="{{placeholder}}"></div></div></div>');

var catTpl = _.template('<div class="card my-4"><h5 class="card-header">{{title}}</h5><div id="{{id}}" class="card-body"></div></div>');

var categorieTpl = _.template('<span class="{{e}} shrink">{{i}}</span>');

var titleTpl = _.template('<h1 class="mt-4">{{ i }}</h1>');

var postsTpl = _.template('<div class="card mb-4"><img class="card-img-top" src="{{subImg}}" alt="Card image cap"><div class="card-body"><h2 class="card-title">{{title}}</h2><p class="card-text">{{subTitle}}</p><button id="{{id}}" class="btn btn-primary postBtn">Read More &rarr;</button></div><div class="card-footer text-muted"><p>Posted on January {{date}} by {{author}}</p><small>Category: <span class="category shrink">{{category}}</span></small><br><small id="addTags"><span>Tags: </span><span class="tags tagGroup">{{tags}}</span></small></div></div>');

var postTpl = _.template('<h1 class="mt-4">{{title}}</h1><h3 class="mt-4">{{subTitle}}</h3><p class="lead">by{{author}}</p><hr><p>Posted on {{date}}</p><hr><img class="img-fluid rounded" src="{{img}}" alt=""><hr>{{entry}}<hr><small>Category: <span class="category shrink">{{category}}</span></small><br><small id="addTags"><span>Tags: </span><span class="tags tagGroup">{{tags}}</span></small><hr>');

var postPaginationTpl = _.template('<ul class="pagination justify-content-center mb-4"><li class="page-item"><button id="newer" class="page-link">&larr; Newer</button></li><li class="page-item"><button id="current" class="page-link" disabled>current</button></li><li class="page-item"><button id="older" class="page-link">&rarr; Older</button></li></ul>');

var postsShowMoreTpl = _.template('<div><small>viewing 1 to <span id="postCurrent">10</span><span id="postMin" hidden>1</span> of <span id="postLength"></span> posts</small><button type="button" id="showMoreBtn" class="btn btn-primary btn-block mb-4">Show more</button></div>');

var comments = _.template('<div id="disqus_thread"></div>');

var toTop = _.template('<span id="toTop" class="fa fa-chevron-up"></span>');

//gallery
var galleryBodyTpl = _.template('<h1 class="my-4 text-center text-lg-left">{{header}}</h1><div id="imgGallery" class="row text-center text-lg-left"></div><div id="myModal" class="mdl"><img class="mdl-content"><div class="captionText"></div></div>');

var galleryTpl = _.template('<div class="col-lg-3 col-md-4 col-xs-6 galImg"><span href="#" class="d-block mb-4 h-100"><img class="img-fluid img-thumbnail shrink galImg" src="{{img}}"><h5 class="galleryTitle">{{title}}</h5><h6 class="gallerySub">{{subTitle}}</h6></span></div>');

//carousel
var cTpl = _.template('<div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel"><div class="carousel-inner" role="listbox"></div></div>');

var cItem = _.template('<div class="carousel-item" style="background-image: url(\'{{url}}\')"><div class="carousel-caption d-none d-md-block"><h3>{{title}}</h3><p>{{sub}}</p></div></div>');
