'use strict';

var querystring = require('querystring');
var koa = require('koa');

var app = koa();

function roll(die) {
  const instructions = die.split('d');
  const rolls = [];
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

app.use(function *(){
  const payload = querystring.parse(this.request.querystring);
  if (payload.dice.length < 3) {
    this.throw(400, 'Format is [num]d[sides], e.g. 3d6. Multiple dice separated by commas. e.g. 2d10,5d4');
  }

  const pairs = payload.dice.split(',');
  const resp = {};
  pairs.forEach(function(die){
   resp[die] = roll(die)
  });
  this.body = resp;
});

app.listen(process.env.PORT || 8000, function(){
  console.log('listening on', process.env.PORT || 8000);
});