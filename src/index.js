const express = require('express');
const app = express();
app.set('view engine', 'pug');
app.set('views','src/views');


app.get('/home', function(req,res){
	res.render('homepage');
});




//Other Routes 404 not found
app.get('*', function(req,res){
	res.send('404 error');
});

app.listen(3000);