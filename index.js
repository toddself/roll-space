'use strict';

var fs = require('fs');
var querystring = require('querystring');
var koa = require('koa');

var app = koa();

function roll(die, self) {
  const rolls = [];
  const instructions = die.split('d').map(function(num) {
    const n = parseInt(num, 10);
    if (isNaN(n)){
      self.throw(400, 'Format is [num]d[sides], e.g. 3d6. Multiple dice separated by commas. e.g. 2d10,5d4');
    }
    return n
  });

  if (instructions.length < 2 || instructions.length > 2) {
    self.throw(400, 'Format is [num]d[sides], e.g. 3d6. Multiple dice separated by commas. e.g. 2d10,5d4');
  }

  for (let i = 0; i < instructions[0]; i++) {
    rolls.push(Math.floor(Math.random() * (instructions[1] - 1) + 1));
  }

  const sum = rolls.reduce(function(a, n) {
    a += n;
    return a;
  }, 0);

  return {
    sum: sum,
    rolls: rolls
  }
}

function read(path) {
  return function (done) {
    fs.readFile(path, done);
  }
}

app.use(function *(){
  if (/^\/d20.png/.test(this.request.url)) {
    this.type = 'png';
    this.body = yield read('d20.png');
  } else if (!this.request.querystring) {
    this.type = 'html';
    this.body = yield read('index.html');
  } else {

    const payload = querystring.parse(this.request.querystring);
    const self= this;
    if (payload.dice.length < 3) {
      this.throw(400, 'Format is [num]d[sides], e.g. 3d6. Multiple dice separated by commas. e.g. 2d10,5d4');
    }

    const pairs = payload.dice.split(',');
    const resp = {};
    pairs.forEach(function(die){
     resp[die] = roll(die, self)
    });
    this.body = resp;
  }
});



if (!module.parent) {
  app.listen(process.env.PORT || 8000, function() {
    console.log('running on', process.env.PORT || 8000);
  });
} else {
  module.exports = app;
}
