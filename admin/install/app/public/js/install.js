var socket=io.connect();

socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});

socket.on('config', function (i) {
  console.log(JSON.stringify(i,0,2));
  $('#confPre').html(JSON.stringify(i,0,2))
});


$('.Compiler').click(function(event) {
  $('#compiler').val($(this).html())
});
