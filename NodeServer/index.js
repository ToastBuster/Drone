const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);


io.on('connection', function(socket) {
  console.log('A user connected');
  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function() {
    console.log('A user disconnected');
  });

});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/inputdata/', (req, res) => {
  let data = req.body;
  let sent = JSON.stringify(data);
  res.send('Data Received: ' + sent);
  data = req.params.input;
  io.emit("input", sent)
  console.log(sent);
});

app.use('/', express.static(path.join(__dirname, 'public/HTML')));
app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/', (req, res) => {
  res.status(404).send('404 dumbass');
});

http.listen(80, function() {
  console.log('listening on *:80');
});
