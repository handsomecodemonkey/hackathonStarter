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




/* 
const createColony = require('./create_colony');
const createTask = require('./create_task');

createColony()
  .then(createTask)
  // We're exiting hard here as the providers keep polling otherwise
  .then(() => process.exit())
  .catch(err => console.error(err));
*/