var initialize = _.once(initApp)
  arr = []
  obj = {};

function getJSON(e, i) {
  $.getJSON("app/data/" + e + ".json", i);
}

function getGallery(i) {
  getJSON("gallery", i);
}


function getHome(i) {
  getJSON("home", i);
}

function getPost(i) {
  getJSON("posts", i);
}


function getData(i) {
  getJSON("data", i);
}

function addTop(e) {
  $('nav').before(navDetails({
    'url': e.nav.details.url,
    'info': e.nav.details.info
  }));

  _.forEach(e.nav.social, function(i) {
    $('.icn-group').append('<i class="shrink fa fa-' + i.icon + '"><i>');
  });
}


function initNav(e) {
  _.forEach(e.nav.links, function(i) {
    $('#navLinks').append(navLink({
      'id': i,
      'title': i
    }));
  });
  $('.navbar-toggler').click(function() {
    $('#navbarResponsive').toggle('slow');
  });
  addTop(e);
}


function initMain(i) {
  $('body').prepend(navTpl(), bodyTpl(), footerTpl({
    'author': i.details.author
  }), toTop());
}

function initApp() {
  getData(function(res) {
    initMain(res);
    initNav(res);
    home();
    showtoast('loading');
    scrollTop();
  });
}

function hash(i) {
  location.hash = i;
}

function preload() {
  var images = _.clone(arr);
  for (var i = 0; i < arguments.length; i++) {
    images[i] = new Image();
    images[i].src = preload.arguments[i];
  }
}

function commentsSrc() { // DON'T EDIT BELOW THIS LINE
  var d = document,
    s = d.createElement('script');
  s.src = 'https://blog-4l5uws4c2a.disqus.com/embed.js';
  s.setAttribute('data-timestamp', +new Date());
  (d.head || d.body).appendChild(s);
}

function disqusReset(newIdentifier, newUrl, newTitle, newLanguage) {
  DISQUS.reset({
    reload: true,
    config: function() {
      this.page.identifier = 'localhost:8080/';
      this.page.url = 'index.html/#';
      this.page.title = newTitle;
      this.language = 'en';
    }
  });
}

function updateTimestamp(i) {
  var newDate = new Date();
  newDate.setTime(i);
  dateString = newDate.toUTCString();
  return dateString;
}

function emptyIt(i) {
  $(i).empty();
}

function removeIt(i) {
  $(i).empty();
}

function resetShowMore(e) {
  if (_.lte(e.length, 9)) {
    console.log(e.length);
    $('#postCurrent').html(e.length);
    $('#postMin').html('1');
    $('#showMoreBtn').attr('disabled', 'true').html('No more Posts');
  } else {
    $('#postCurrent').html('10'),
      $('#postMin').html('1');
    $('#showMoreBtn').removeAttr('disabled').html('Show more');
  }
}

function appendPosts(i) {
  $('.posts').append(postsTpl({
    'subImg': i.subImg,
    'title': i.title,
    'subTitle': i.subTitle,
    'id': 'no' + i.id,
    'date': updateTimestamp(i.data),
    'author': i.author,
    'category': i.category,
    'tags': i.tags
  }));
}

function addFiltered(e, postCountMin, postCountMax) {
  _.filter(e, function(i) {
    if ((_.gte(i.id, postCountMin)) && (_.lte(i.id, postCountMax))) {
      appendPosts(i);
    }
  });
}

function showMore(e, postCountMin, postCountMax) {
  $('#showMoreBtn').click(function() {
    $('#postMin').html(postCountMin + 10);
    if (_.gte(postCountMax, e.length - 10)) {
      $('#postCurrent').html(e.length);
      $(this).html('No more Posts');
      $(this).attr('disabled', 'true');
    } else {
      $('#postCurrent').html(postCountMax + 10);
    }
    filterPosts(e);
  });
}

function filterPosts(e) {
  $('#showMoreBtn').unbind();
  var postCountMin = parseInt($('#postMin').html());
  var postCountMax = parseInt($('#postCurrent').html());
  addFiltered(e, postCountMin, postCountMax);
  $('#postLength').html(e.length);
  showMore(e, postCountMin, postCountMax);
}

function initLnk(e) {

  function joinEm() {
    splitTags();
    selectPost(e);
    initLnk(e);
    backToTop(60);
  }

  $('*.category,*.tags,*.months').unbind();
  $('.category').click(function() {
    var choice = this.innerHTML;
    var filtered = _.filter(e.posts, {
      'category': choice
    });
    emptyIt('.posts');
    removeIt('.showMore');
    $('.posts').append(titleTpl({
      'i': e.blog.mainHeading
    }));
    _.forEach(filtered, function(i) {
      appendPosts(i);
    });
    hash('/blog/category/' + choice);
    joinEm();
  });

  $('.tags').click(function() {
    var choice = this.innerHTML;
    var filtered = _.filter(e.posts, {
      'tags': [choice]
    });
    emptyIt('.posts');
    removeIt('.showMore');
    $('.posts').append(titleTpl({
      'i': e.blog.mainHeading
    }));
    _.forEach(filtered, function(i) {
      appendPosts(i);
    });
    hash('/blog/tags/' + choice);
    joinEm();
  });

  $('.months').click(function() {
    var choice = this.innerHTML;
    var year = $("#blogYear").val();
    emptyIt('.posts');
    removeIt('.showMore');
    $('.posts').append(titleTpl({
      'i': e.blog.mainHeading
    }));
    filterMonth(e, choice, year);
    hash('/blog/' + year + '/' + choice);
    joinEm()
  });
}

function filterMonth(e, x, y) {
  _.filter(e.posts, function(i) {
    var newDate = new Date();
    newDate.setTime(i.date);
    dateString = _.zipObject(['month', 'year'], _.pullAt(_.words(JSON.stringify(newDate.toDateString())), [1, 3]));
    if ((_.eq(dateString.month, x)) && (_.eq(dateString.year, y))) {
      appendPosts(i);
    }
  })
}


function initBlog(e) {
  emptyIt('.posts');
  $('.posts').append(titleTpl({
    'i': e.blog.mainHeading
  }));
  filterPosts(e.posts);
  $('#postLength').html(e.posts.length);
}

function paginationAdd(i, e) {
  $('#current').html(i);
  if (_.lt(parseInt(i), 2)) {
    $('#newer').attr("disabled", true);
  }
  if (_.eq(parseInt(i), e.posts.length)) {
    $('#older').attr("disabled", true);
  }
}


function postChoice(i, e) {
  removeIt('.showMore');
  emptyIt('.posts');
  $('.posts').append(postTpl({
    'img': i.img,
    'title': i.title,
    'subTitle': i.subTitle,
    'author': i.author,
    'date': updateTimestamp(i.date),
    'entry': i.entry,
    'category': i.category,
    'tags': i.tags
  }), postPaginationTpl(), comments());
}

function nextPrevPost(e) {
  var changePost, gotPost;
  $('#newer').click(function() {
    changePost = parseInt($(this).parent('li').next('li').children('button').html()) - 1;
    gotPost = _.clone(_.find(e.posts, {
      'id': changePost
    }));
    postChoice(gotPost);
    paginationAdd(changePost, e);
    nextPrevPost(e);
    splitTags();
    initLnk(e);
    hash('/blog/post/' + changePost);
  });

  $('#older').click(function() {
    changePost = parseInt($(this).parent('li').prev('li').children('button').html()) + 1;
    gotPost = _.clone(_.find(e.posts, {
      'id': changePost
    }));
    postChoice(gotPost)
    paginationAdd(changePost, e);
    nextPrevPost(e);
    splitTags();
    initLnk(e);
    hash('/blog/post/' + changePost);
  });

}

function selectPost(e) {
  $('*.postBtn').unbind();
  $('.postBtn').click(function() {
    var getPost = this.id.slice(2);
    var gotPost = _.clone(_.find(e.posts, {
      'id': parseInt(getPost)
    }));
    postChoice(gotPost)
    paginationAdd(getPost, e);
    nextPrevPost(e);
    splitTags();
    initLnk(e);
    hash('/blog/post/' + getPost);
  });
}

function addCategories(e) {
  var categories = _.union(_.map(e.posts, 'category'))
  _.forEach(_.sortBy(categories), function(i) {
    $('#catList').append(categorieTpl({
      "e": "category",
      'i': i
    }));
  });
}

function addTags(e) {
  var tags = _.union(_.flattenDeep(_.map(e.posts, 'tags'))) //
  _.forEach(_.sortBy(tags), function(i) {
    $('#tagList').append(categorieTpl({
      "e": "tags",
      'i': i
    }));
  });
}

function addMonths(e) {
  var months = e.blog.months,
    years = e.blog.years;
  $('<input>').attr({
    'type': 'number',
    'id': 'blogYear',
    'class': 'form-control',
    'value': years.max,
    'min': years.min,
    'max': years.max
  }).appendTo('#monthList');
  _.forEach(months, function(i) {
    $('#monthList').append(categorieTpl({
      "e": "months",
      'i': i
    }));
  });
}

function splitTags() {
  $('.tagGroup').each(function(index, el) {
    var newArr = _.split(this.innerHTML, ',');
    _.forEach(newArr, function(i) {
      $(el).parent('small').append('<span class="tags tag-single">' + i + '</span>');
    });
    $(el).remove();
  });
}





function blog() {
  getData(function(res) {
    emptyIt('#main-content');
    hash('/blog');
    $('#main-content').append(blogBody());
    $('.showMore').append(postsShowMoreTpl())

    $('#sideBar').append(searchTpl({
      'header': res.blog.search.header,
      'placeholder': res.blog.search.placeholder
    }), catTpl({
      'title': 'Categories',
      'id': 'catList'
    }), catTpl({
      'title': 'Tags',
      'id': 'tagList'
    }), catTpl({
      'title': 'Months',
      'id': 'monthList'
    }));

    getPost(function(data) {
      //filterMonth(data,'Mar');
      addCategories(data);
      addTags(data);
      addMonths(res);
      initBlog(data);
      selectPost(data);
      splitTags();
      initLnk(data);

      $('#search').keyup(function() {
        var searchField = $(this).val();
        if (searchField === '') {
          $('#filter-records').html('');
          return;
        }

        var regex = new RegExp(searchField, "i");
        var output = '<div>';
        var count = 1;

        $.each(data.posts, function(key, i) {
          if ((i.title.search(regex) != -1)) {
            output += postsTpl({
              'subImg': i.subImg,
              'title': i.title,
              'subTitle': i.subTitle,
              'id': 'no' + i.id,
              'date': updateTimestamp(i.data),
              'author': i.author,
              'category': i.category,
              'tags': i.tags
            })
            if (count % 2 == 0) {
              output += ''
            }
            count++;
          }
        });
        output += '</div>';
        removeIt('.showMore');
        $('.posts').html(titleTpl({
          'i': 'Search results:' + (count - 1)
        }) + output);
        selectPost(data);
        splitTags();
        initLnk(data);
        hash('/blog/search');
      });
    });
  });
}

function gallery() {
  getData(function(res) {
    emptyIt('#main-content');
    hash('/glllery');
    getGallery(function(data) {
      $('#main-content').append(galleryBodyTpl({
        'header': data.header
      }));
      _.forEach(data.images, function(i) {
        $('#imgGallery').append(galleryTpl({
          'img': i.url,
          'title': i.title,
          'subTitle': i.subTitle
        }));
      });

      $('img.galImg').click(function() {
        $('#myModal').css('display','block')
        $('.mdl-content').attr({"src":$(this).attr('src')})
        $('.captionText').html($(this).next('.galleryTitle').html());
      });
      $('#myModal').click(function() {
        $(this).css('display','none')
      });
    });
  });

}


function home() {
  getData(function(res) {
    emptyIt('#main-content');
    hash('');
    getHome(function(data) {
      $('#main-content').append(cTpl());
      _.forEach(data.carousel, function(i, e) {
        $('.carousel-inner').append(cItem({
          'url': i.url,
          'title': i.title,
          'sub': i.sub
        }));
      });
      $('div.carousel-item').eq(0).addClass('active');
      $('.carousel').carousel({
        interval: 2000
      })
    });
  });
}

initialize();
