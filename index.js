
//var app  = require('express')();
var bodyParser = require('body-parser');
var morgan = require('morgan');
//var express= require('express')()
var express   =     require("express");
var session = require('client-sessions');
var app       =     express();
app.use(express.static(__dirname + '/views'));;
app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded())
var _ = require('underscore');
/*var babel =require("babel-core").transform("code", {
  "presets": ["env"]
});*/

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mydb.db');
var check;
var users=[];
db.serialize(function() {

  db.run("CREATE TABLE if not exists users (id INTEGER,name TEXT,pass TEXT,PRIMARY KEY(id ASC))");
  
  var i;
  db.all("SELECT count(*) as cnt from users ",function(err,rows){
 rows.forEach(function (row) {
          i=row.cnt;
        });
});
if(i==0){
  var stmt = db.prepare("INSERT INTO users VALUES(?,?,?)");

      stmt.run(0,"Bob","123");
	    stmt.finalize();

}

  /*db.each("SELECT rowid AS id, info FROM user_info", function(err, row) {
      console.log(row.id + ": " + row.info);
  });*/
});

db.all("SELECT * from users ",function(err,rows){
 rows.forEach(function (row) {
           users.push( { id: row.id, name: row.name,pass:row.pass });
        });
});

//db.close();
var fs = require('fs'),
    path = require('path');
var port = process.env.PORT || 3000,
   /* users = [
      { id: 0, name: 'Bob',pass:"123" }
    ],*/
	threads=[
      { id: 0, name: 'Vlakno1' ,created:'1483720159', updated:'1483720159'},
	  { id: 1, name: 'Vlakno2' ,created:'1483720159', updated:'1483720159'}
    ],
	posts=[
      { id: 0,uname:'Bob', tname:'Vlakno1', text: 'text1' ,created: '1483720159', updated: '1483720159' },
	  { id: 1,uname:'Bob', tname:'Vlakno1', text: 'text2' ,created: '1483720159', updated: '1483720159'}
    ];
	
	//var app = express();
	/*app.set("view options", {layout: false});
    app.use(app.static(__dirname + '/views'));*/
	
	
	app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile)
//app.use(express.static(__dirname + '/public'));
//app.engine('html', require('ejs').renderFile);
//logging middleware
app.use(morgan('dev'));

//body-parser middleware - pro JSON requesty
app.use(bodyParser.json());

/**
* Vrati seznam vsech uzivatelu
*/
app.get('/thread', function (req, res) {
	 if (req.session && req.session.login) {
  res.send({ login:req.session.login,success: true, threads: threads });
	 }else{
		  res.send({ login:0,success: true});
	 }
});

app.get('/', function (req, res) {
	
	 res.render('index.html');
	/* var indexFile = path.join(__dirname, './index.html');
  console.log(indexFile);
 fs.readFile(indexFile, (err, data) => {
      if (err) {
        console.error(err);
        res.writeHead(500, {'Content-Type': 'text/html'});
        res.end('500 server error');
      } else {
		  res.send(data);
       /* res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
      }
    });
 /* if (req.url === '/' || req.url === '/index.html') {
    console.log("index: ", indexFile);

    fs.readFile(indexFile, (err, data) => {
      if (err) {
        console.error(err);
        res.writeHead(500, {'Content-Type': 'text/html'});
        res.end('500 server error');
      } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
      }
    });

  } else {
    // resource not found
    console.log('resource not found: ' + req.url);
    res.writeHead(404, {'Content-Type': 'text/html'} );
    res.end('<html><body><h1>404 not found</h1></body></html>');
  }*/
  
});


app.post('/login', function (req, res) {
 var user = req.body;
 
  console.log(user);
  console.log(user.name);

  if (!user || !user.name|| !user.pass) {
    res.send({ success: false, reason: 'cannot create user (missing user name)' });
    return;
  }

  var existing = _.findWhere(users, { name: user.name });

  if (existing) {
    if(existing.pass==user.pass){
		 req.session.login=user.name;
		   res.send({ success: true, user: user });
		   return;
	}else{
		  res.send({ success: false, reason: 'wrong name or password' });
    return;
	}
  }else{
		  res.send({ success: false, reason: 'wrong name or password' });
    return;
	}

  //users.push(user);
  //user.id = users.length;


});
app.post('/logout', function (req, res) {
	req.session.destroy();
res.send({ success: true});
});
app.get('/thread/:name', function (req, res) {
	 if (req.session && req.session.login) {
  var name = req.params.name;

  var thread = _.find(threads, function (u) {
    return u.name === name;
  });

  var post = _.filter(posts, function (u) {
    return u.tname === name;
  });
  
  var result = thread
    ? {  login:req.session.login,success: true, thread: thread ,posts:post}
    : { success: false, reason: 'thread not found: ' + name };

  res.send(result);
	 }else{
		 res.send({ success: true, login:0 });
	 }
});



app.post('/thread', function (req, res) {
		 if (req.session && req.session.login) {
  var thread = req.body;
 
  console.log(thread);
  console.log(thread.name);

  if (!thread || !thread.name) {
    res.send({ success: false, reason: 'cannot create thread (missing thread name)' });
    return;
  }

  var existing = _.findWhere(threads, { name: thread.name });

  if (existing) {
    res.send({ success: false, reason: 'thread already exists: ' + existing.name });
    return;
  }

  threads.push(thread);
  thread.id = threads.length;

  res.send({login:req.session.login, success: true, thread: thread });
 }else{
		 res.send({ success: true, login:0 });
	 }
});

app.put('/thread/:name', function (req, res) {
 if (req.session && req.session.login) {
	 var name = req.params.name,
      newName = req.body.name;

  var thread = _.find(threads, function (u) {
    return u.name === name;
  });

  if (thread) {
	   var post = _.filter(posts, function (u) {
    return u.tname ===  thread.name;
  });
	  post.forEach(function(post){
post.tname= newName;
 
});
    thread.name = newName;
  }

  var result = thread
      ? { login:req.session.login, success: true, thread: thread }
      : { success: false, reason: 'thread not found: ' + name };

  res.send(result);
   }else{
		 res.send({ success: true, login:0 });
	 }
});
app.delete('/thread/:name', function (req, res) {
	 if (req.session && req.session.login) {
  var name = req.params.name;

  var thread = _.find(threads, function (u) {
    return u.name === name;
  });
   var post = _.filter(posts, function (u) {
    return u.tname === name;
  });

  var result = thread
      ? { success: true, thread: thread,posts:post }
      : { success: false, reason: 'thread not found: ' + name };

posts = _.reject(posts, function (u) {
    return u.tname === name;
  });
  
  threads = _.reject(threads, function (u) {
    return u.name === name;
  });

  res.send(result);
  }else{
		 res.send({ success: true, login:0 });
	 }
});


app.get('/post', function (req, res) {
	if (req.session && req.session.login) {
  res.send({  login:req.session.login,success: true, posts: posts });
  }else{
		 res.send({ success: true, login:0 });
	 }
});

app.get('/post/:id', function (req, res) {
	if (req.session && req.session.login) {
  var id = req.params.id;

  var post = _.find(posts, function (u) {
    return u.id == id;
  });

  var result = post
    ? { success: true, post: post }
    : { success: false, reason: 'post not found: ' + id };

  res.send(result);
  }else{
		 res.send({ success: true, login:0 });
	 }
});

app.post('/post', function (req, res) {
	if (req.session && req.session.login) {
  var post = req.body;
 
  console.log(post);
  console.log(post.text);

  if (!post || !post.text) {
    res.send({ success: false, reason: 'cannot create post (missing post text)' });
    return;
  }
   if (!post.tname) {
    res.send({ success: false, reason: 'cannot create post (missing thread name)' });
    return;
  }
 if (!post.uname) {
    res.send({ success: false, reason: 'cannot create post (missing user name)' });
    return;
  }
  var existing = _.findWhere(threads, { name: post.tname });

  if (existing) {
	  post.id = posts.length;
    posts.push(post);
  

 // res.send({ success: true, post: post });
  var ex = _.findWhere(users, { name: post.uname });
  if (ex==undefined) {
	  
	  users.push({id:users.length, name:post.uname});
	  
  }
  }else{
	   res.send({ success: false, reason: 'thread doesnt exist: ' +post.tname });
  //  return;
  }
res.send({ success: true, post: post,ex:existing });
 }else{
		 res.send({ success: true, login:0 });
	 }

});



app.put('/post/:id', function (req, res) {
	if (req.session && req.session.login) {
  var id = req.params.id,
      newText = req.body.text;

  var post = _.find(posts, function (u) {
    return u.id == id;
  });

  if (post) {
    post.text = newText;
  }

  var result = post
      ? { success: true, post: post }
      : { success: false, reason: 'post not found: ' + name };

  res.send(result);
  }else{
		 res.send({ success: true, login:0 });
	 }
});
app.delete('/post/:id', function (req, res) {
	if (req.session && req.session.login) {
  var id = req.params.id;

  var post = _.find(posts, function (u) {
    return u.id == id;
  });

  var result = post
      ? { success: true, post: post }
      : { success: false, reason: 'post not found: ' + name };


  posts = _.reject(posts, function (u) {
    return u.id == id;
  });

  res.send(result);
  }else{
		 res.send({ success: true, login:0 });
	 }
});












app.get('/users', function (req, res) {
	if (req.session && req.session.login) {
  res.send({ success: true, users: users });
   }else{
		 res.send({ success: true, login:0 });
	 }
});

/**
* Vrati uzivatele 
* pokud je zadany parametr name 
*/

app.get('/users/:name', function (req, res) {
		if (req.session && req.session.login) {
  var name = req.params.name;

  var user = _.find(users, function (u) {
    return u.name === name;
  });

  var result = user
    ? { success: true, user: user }
    : { success: false, reason: 'user not found: ' + name };

  res.send(result);
   }else{
		 res.send({ success: true, login:0 });
	 }
});

/**
* Vytvori noveho uzivatele z json dat 
* request content-type musi byt application/json
*  {
*     "name": "Tom"
*  }
*/
app.post('/users', function (req, res) {
  var user = req.body;
 
  console.log(user);
  console.log(user.name);

  if (!user || !user.name|| !user.pass) {
    res.send({ success: false, reason: 'cannot create user (missing user name)' });
    return;
  }

  var existing = _.findWhere(users, { name: user.name });

  if (existing) {
    res.send({ success: false, reason: 'user already exists: ' + existing.name });
    return;
  }

  users.push(user);
  user.id = users.length;
 req.session.login=user.name;
  var stmt = db.prepare("INSERT INTO users VALUES(?,?,?)");
  //for (var i = 0; i < 10; i++) {
      stmt.run(user.id,user.name,user.pass);
 // }
  stmt.finalize();
  res.send({ success: true, user: user });

});

/**
* Aktualizuje uzivatele 
* request data 
*  {
*     "name": "Tomas"
*  }
* v URL stare jmeno
*/
app.put('/users/:name', function (req, res) {
		if (req.session && req.session.login) {
  var name = req.params.name,
      newName = req.body.name;

  var user = _.find(users, function (u) {
    return u.name === name;
  });

  if (user) {
    user.name = newName;
  }

  var result = user
      ? { success: true, user: user }
      : { success: false, reason: 'user not found: ' + name };

  res.send(result);
    }else{
		 res.send({ success: true, login:0 });
	 }
});

/**
* smaze uzivatele 
* v URL parametr jmeno
*/
app.delete('/users/:name', function (req, res) {
	if (req.session && req.session.login) {
  var name = req.params.name;

  var user = _.find(users, function (u) {
    return u.name === name;
  });

  var result = user
      ? { success: true, user: user }
      : { success: false, reason: 'user not found: ' + name };


  users = _.reject(users, function (u) {
    return u.name === name;
  });

  res.send(result);
    }else{
		 res.send({ success: true, login:0 });
	 }
});


app.listen(port);
console.log('CRUD demo started on port %s', port);