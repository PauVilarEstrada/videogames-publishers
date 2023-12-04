var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();
var db = require('knex')(
    {
      client: 'sqlite3',
      connection: {
        filename: 'db_GHC.db'
      }
    }
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

//TEST DE CONEXION
//app.get('/', (req,res) => {
//  res.send('inicio');
//})



app.get('/api/games/', function (req,res) {   //NUEVO CODIGO
  db.select('id_game', 'id_pub', 'game_name', 'genero', 'release_date', 'image_url', 'game_text','premios')
      .from('videogames')
      .then(function (data){
        res.json({'games': data});
        console.log(data);
      }).catch(function (error){
          console.log(error)
  })
});

app.get('/api/publishers/', function (req,res) {
    db.select('id_pub','pub_name', 'year', 'ceo', 'sede', 'pub_text' ,'src_image')
        .from('publishers')
        .then(function (data){
            res.json({'publishers': data});
            console.log(data, "estos son los datos de la api");
        }).catch( function (error) {
        console.log(error)
    })
});


app.post('/api/games/', function (req,res) {
    let data_form = req.body;
    console.log('app.post(). Params:',data_form)
    db.insert(data_form)
        .into('videogames')
        .then(function (data){
            res.json(data);
        }).catch( function (error) {
        console.log(error)
    })
});


app.post('/api/games/:id', function (req,res) {
    let id = req.params.id;
    let gameData = req.body;
    db('videogames').update(gameData).where('id_game',id).then(function (data) {
        res.json(data)
    }).catch( function (error) {console.log('error: ',error)});
});


app.post('/api/publishers/:id', function (req,res) {
    let id = req.params.id;
    let publisherData = req.body;
    db('publishers').update(publisherData).where('id_pub',id).then(function (data) {
        res.json(data)
    }).catch( function (error) {console.log('error: ',error)});
});

app.post('/api/publishers/', function (req,res) {
    let data_form = req.body;
    console.log('app.post(). Params:',data_form)
    db.insert(data_form)
        .into('publishers')
        .then(function (data){
            res.json(data);
        }).catch( function (error) {
        console.log(error)
    })
});

app.get('/api/all/', function (req,res) {
  db.select('v.id_game', 'v.id_pub', 'v.game_name', 'v.genero', 'v.release_date', 'v.image_url',
      'p.id_pub','p.pub_name', 'p.year', 'p.ceo', 'p.sede', 'p.pub_text')
      .from('videogames as v')
      .join('publishers as p', 'v.id_pub', 'p.id_pub')
      .then(function (data){
        res.json({'all': data});
        console.log(data);
      })
});



app.get('/api/games/:id', function (req, res) {
    let id = req.params.id
    db.select('id_game', 'id_pub', 'game_name', 'genero', 'release_date', 'image_url', 'game_text', 'premios')
        .from('videogames')
        .where('id_game', id)
        .then(function (data) {
            res.send(data)
            console.log('los datos son:', data)
        })
});

app.delete('/api/games/:id', function (req, res) {
    let id = req.params.id
    console.log('se borra elemento con id:' + id)
    db.delete()
        .from('videogames')
        .where('id_game', id)
        .then(function (data) {
            res.json(data)
            console.log('los datos son:', data)
        }).catch(function (error) {
            console.log(error)
    })
});

app.delete('/api/publishers/:id', function (req, res) {
    let id = req.params.id
    console.log('se borra elemento con id:' + id)
    db.delete()
        .from('publishers')
        .where('id_pub', id)
        .then(function (data) {
            res.json(data)
            console.log('los datos son:', data)
        }).catch(function (error) {
        console.log(error)
    })
});

app.get('/api/publishers/:id', function (req,res) {
  let id = req.params.id
  db.select('id_pub','pub_name', 'year', 'ceo', 'sede', 'pub_text', 'src_image')
      .from('publishers')
      .where('id_pub',id )
      .then(function (data){
        res.json(data)
        console.log('los datos son:', data)
      })
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;