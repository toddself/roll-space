[![build status](https://secure.travis-ci.org/toddself/roll-space.png)](http://travis-ci.org/toddself/roll-space)
# Roll Dice

Die rolling as as service.

## Usage

```
git clone git@github.com:toddself/die-roller
cd die-roller
npm install
PORT=[port || 80000] npm start
```

```
curl localhost:8000/?dice=3d6,6d12
```


## Demo

[https://die-roll.heroku.com/?dice=3d6,6d12,4d20](https://die-roll.heroku.com/?dice=3d6,6d12,4d20)

## License

Apache 2.0, copyright 2015 Todd Kennedy
