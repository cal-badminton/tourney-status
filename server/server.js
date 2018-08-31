const express = require('express');
const mongoose = require('mongoose');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Tourney = require('./models/Tourney.js');
const getSecret = require('./secrets.js');
const btoa = require('btoa');

mongoose.connect(getSecret('db'));
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to mongodb!');
});

app.get('/', (req, res) => {
  res.send("nice!");
});

io.on('connection', function(socket) {
  console.log('user connected!');

  // BEGIN HANDLING SOCKET.IO CALLS //

  // Handle making a tourney
  socket.on('create tourney', function(data) {
    console.log("make a tourney!");
    console.log(data);
    Tourney.findOne({name: data.name}, (err, tourney) => {
      if (tourney === null) {
        const tourney = new Tourney();
        tourney.name = data.name;
        tourney.password = data.password;
        tourney.players = [];
        tourney.status = '';
        tourney.queue = [];
        tourney.matches = [];
        tourney.save();
        socket.emit('manage', btoa(tourney.name));
        console.log('made a tournament!');
      } else {
        socket.emit('warning', 'A tournament with this name already exists!');
        console.log('tournament already exists!');
      }
    });
  });

  // Handle finding a tourney
  socket.on('find tourney', function(data) {
    Tourney.findOne({name: data.name}, (err, tourney) => {
      if (tourney === null) {
        socket.emit('warning', 'That tournament does not exist!');
      } else {
        socket.emit('view', tourney.name);
      }
    });
  });

  // Sends updated view to client when requested
  socket.on('get view', function(data) {
    Tourney.findOne({name: data}, (err, tourney) => {
      if (tourney === null) {
        socket.emit('warning', 'That tournament does not exist!');
      } else {
        socket.emit('update view', {status: tourney.status,
                                    queue: tourney.queue,
                                    matches: tourney.matches});
      }
    });
  });

  // Handle editing a tourney
  socket.on('manage tourney', function(data) {
    Tourney.findOne({name: data.name}, (err, tourney) => {
      if (tourney === null) {
        socket.emit('warning', 'That tournament does not exist!');
      } else if (tourney.password === data.password){
        socket.emit('manage', btoa(tourney.name));
      } else {
        socket.emit('warning', 'Incorrect password!');
      }
    });
  });

  // Sends new status when status is changed
  socket.on('update status', function(data) {
    Tourney.findOneAndUpdate(
      {name: data.name},
      {status: data.status},
      {upsert: false},
      function(err, prev) {
        if (prev === null) {
          socket.emit('warning', 'Unable to update status!');
        } else {
          io.emit('update status', {status: data.status});
        }
      }
    );
  });

  // Returns the current queue

  socket.on('get queue', function(data) {
    Tourney.findOne({name: data}, (err, tourney) => {
      if (tourney === null) {
        socket.emit('warning', 'Unable to find the queue!');
      } else {
        socket.emit('update queue', tourney.queue);
      }
    });
  });

  // Returns the current list matches

  socket.on('get matches', function(data) {
    Tourney.findOne({name: data}, (err, tourney) => {
      if (tourney === null) {
        socket.emit('warning', 'Unable to find the matches!');
      } else {
        socket.emit('update matches', tourney.matches);
      }
    });
  });

  // Adds a match to the queue and updates all clients

  socket.on('add queue', function(data) {
    let match = [data.name, data.leftTeam, data.rightTeam];
    Tourney.findOneAndUpdate(
      {name: data.id},
      {$push: {queue: match} },
      {upsert: false},
      function(err, prev) {
        if (prev === null) {
          socket.emit('warning', 'Unable to add to queue!');
        } else {
          match = prev.queue.concat([match]);
          io.emit('update view', {status: prev.status,
                                  queue: match,
                                  matches: prev.matches});
          socket.emit('update queue', prev.queue.push(match));
        }
      }
    );
  });

  socket.on('disconnect', function() {
    console.log('user disconnected!');
  });
});

http.listen(8000, () => console.log('Listening on port 8000!'));
