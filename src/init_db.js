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

let sql = `SELECT DISTINCT name FROM sqlite_master
           ORDER BY name`;
 
let db = connectToDB();

db.all(sql, [], (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach((row) => {
    console.log(row.name);
  });
});



db.close();