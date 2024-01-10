const { 
v4: uuidv4,
} = require('uuid');

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'newuser',
  host: 'localhost',
  database: 'scheduler_db',
  password: 'root',
  port: 5432,
});

//wont create a user if one already exists
const createUser = (body) => {
	return new Promise(function (resolve, reject) {
	  const {email, password } = body;
	  var id = uuidv4()
	  pool.query(
		"INSERT INTO users (id, email, password) VALUES ($1, $2, $3) RETURNING *",
		[id, email, password],
		(error, results) => {
		  if (error) {
			reject(error);
		  }
		  if (results && results.rows) {
			resolve(
			  `A new user has been added: ${JSON.stringify(results.rows[0])}`
			);
		  } else {
			reject(new Error("No results found"));
		  }
		}
	  );
	});
  };

  const getUser = async (body) => { //Used for login, will find user, then post login attempt
	try {
	  return await new Promise(function (resolve, reject) {
		
		const {emailText, passwordText} = body; //need to be the same name as the values passed in react app
		
		if (!emailText || !passwordText) {
			reject(new Error("email or password not given"));
		}
		pool.query("SELECT id FROM users WHERE email=($1) AND password=($2);", [emailText, passwordText],
		 (error, results) => {
		  if (error) {
			reject(error);
		  }
		  if (results && results.rows && (results.rows[0] != undefined)) {
			var d = Date().indexOf('G');
			var token = uuidv4();
			var id = results.rows[0]
			var userid = id["id"]
			pool.query(
				"INSERT INTO loginattempts (token, userid, date) VALUES ($1, $2, $3) RETURNING *",
				
				[token, userid, Date().slice(0, d-1)],
				(error, results) => {
				  if (error) {
					console.log("error" + error)
					reject(error);
				  }
				  if (results && results.rows) {
					resolve(token);
				  } else {
					reject(new Error("Could obtain token"));
				  }
				}
			  );
			
		  } else {
			reject(new Error("No results found"));
		  }
		});
	  });
	} catch (error_1) {
	  console.error(error_1);
	  throw new Error(error_1);
	}
  };

  module.exports = {
	getUser,
	createUser
  };