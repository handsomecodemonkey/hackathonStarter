const express = require('express');
const app = express();
app.set('view engine', 'pug');
app.set('views','src/views');

app.use(express.static('src/img'));
app.use(express.static('src/scripts'));
app.use(express.static('src/styles'));

function connectToDB() {
  var sqlite3 = require('sqlite3').verbose();
  var db = new sqlite3.Database('src/temp.db', (err) => {
    console.log("Connecting to DB...")
    if(err) {
      console.log("problem connecting to db");
      db.close();
      return null;
    } else {
      console.log("succesful connection to db");
    }
  });
  return db;
}

app.get('/home', function(req,res){
	res.render('homepage');
});


app.get('/team/:id', function(req, res) {
	var teamDomainId = req.params.id;

	var sql = "SELECT NAME FROM DOMAIN WHERE ID = ?";

	var db = connectToDB();
	db.get(sql, [teamDomainId], (err,row) =>{
		if(err) {
			console.log("domain team error");
		} else {
			var object = {};
			object.teamName = row.name;

			db.close();
			res.render('team', object);
		}
	});

})

//Other Routes 404 not found
app.get('*', function(req,res){
	res.send('404 error');
});

app.listen(3000);