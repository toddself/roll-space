'use strict';

const http = require('http');
const test = require('tap').test;
const request = require('superagent');
const server = require('./');
const app  = http.createServer(server.callback());

test('dice', function(t) {
  app.listen(3000);
  request
    .get('localhost:3000/?dice=3d6')
    .end(function(err, res) {
      const keys = Object.keys(res.body);
      const answers = Object.keys(res.body['3d6']);
      t.notOk(!!err, 'no errors');
      t.equal(keys.length, 1, 'there is one key');
      t.equal(keys[0], '3d6', 'returned a 3d6');
      t.equal(answers.length, 2, 'there are two keys');
      t.deepEqual(answers, ['sum', 'rolls'], 'rolls');
      t.equal(res.body['3d6'].rolls.length, 3, 'three dice back');
      app.close();
      t.end();
    });
});

test('no dice', function(t) {
  app.listen(3000);
  request
    .get('localhost:3000/?dice=3')
    .end(function(err, res) {
      t.ok(err, 'got back an err');
      t.equal(res.statusCode, 400, 'got a 400');
      app.close();
      t.end();
    });
});

test('no dice', function(t) {
  app.listen(3000);
  request
    .get('localhost:3000/?dice=3dd')
    .end(function(err, res) {
      t.ok(err, 'got back an err');
      t.equal(res.statusCode, 400, 'got a 400');
      app.close();
      t.end();
    });
});

test('more dice', function(t) {
  app.listen(3000);
  request
    .get('localhost:3000/?dice=3d6,4d12')
    .end(function(err, res) {
      t.notOk(!!err, 'no errors');
      t.equal(Object.keys(res.body).length, 2, 'two answers');
      app.close();
      t.end();
    });
});
