var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var cors = require('cors');
var mongoose = require('mongoose');
var multiPart = require('connect-multiparty');

mongoose.connect('mongodb://localhost/UltimateAbusua');

var db = mongoose.connection;
var connectedUsers = {};

// Init App
var app = express();
var multipartyMiddleware = multiPart();

var http = require('http').Server(app);
var io = require('socket.io')(http);


// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multipartyMiddleware);

var routes = require('./routes/index');
var users = require('./routes/users');
var posts = require('./routes/posts');
var chats = require('./routes/chats');
var documents = require('./routes/documents');


var token = require('./token/authToken')
var ws = require('./routes/webSocket');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'),
  res.header('Access-Control-Allow-Credentials', 'true'),
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'),
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested With, Content-Type, Accept'),
  next()
});

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use('/node_modules', express.static(path.join(__dirname,'/node_modules')));

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use('/', routes);
app.get('/users/getUser', token.verifyToken, users.confirmUserbyID, users.getUser);
 
app.post('/users/register', users.Register);
app.post('/users/login', users.login);
app.post('/users/post', posts.addPost);
app.post('/users/document', documents.addDoc);
app.post('/users/logout', users.logout);

app.get('/users/IDtoUsername', token.verifyToken, users.IDtoUsername)

app.put('/users/post', posts.addLikeDislike);

app.get('/users/getUsers', users.getUsers);
app.get('/users/post', token.verifyToken, users.confirmUserbyID, posts.getPost);
app.get('/users/document', documents.getDoc);

app.post('/users/chat', chats.addChat);
app.get('/users/chat', chats.getChat);
app.post('/users/updateChat', chats.updateChat);
app.get('/users/noticeChat', chats.noticeChat);

app.get('/users/try', function(req, res){
  console.log(req.query);
})


//i have to remove this also too
//app.get('/users/register', multipartyMiddleware, users.getRegister);
//app.get('/users/login', users.getLogin);

// Set Port
app.set('port', (process.env.PORT || 3000));


//socket.io
io.on('connection', function(socket){ socket.joinRooms = [];
  console.log('user connected');
  
  socket.on('disconnect', function(){ ws.Disconnected(socket, connectedUsers)} );
  
  socket.on('typing', function(data){ ws.Typing(data, socket);});
  socket.on('post', function(data){ ws.Post(data, socket) });
  socket.on('room', function(data){ ws.Room(data, socket) });
  socket.on('doc', function(data){ ws.Doc(data, socket) });
  socket.on('user', function(data){ ws.User(data, socket, connectedUsers)} );
  socket.on('chat', function(data){ws.Chat(data, socket, connectedUsers)} );
  
})


http.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});