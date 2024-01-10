const Pool = require('pg').Pool
const pool = new Pool({
  user: 'newuser',
  host: 'localhost',
  database: 'scheduler_db',
  password: 'root',
  port: 5432,
});

const validateUserToken = async (headers) => {  //get function
	try {
	  return await new Promise(function (resolve, reject) {
		var h = headers['authorization']
		h = h.substring(7)
		pool.query("SELECT userid FROM loginattempts WHERE token=($1);", [h],
		 (error, results) => {
		  if (error) {
			reject(error);
		  }
		  if (results && results.rows && (results.rows[0] != undefined)) {
			//console.log(results.rows[0])
			resolve(results.rows[0]);
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


const deleteUserToken = async (headers) => {  //get function
	try {
	  return await new Promise(function (resolve, reject) {
		var h = headers['authorization']
		h = h.substring(7)
		console.log(h)
		pool.query("DELETE FROM loginattempts WHERE token=$1;", [h],
		 (error, results) => {
		  if (error) {
			reject(error);
		  }
		  else {
			resolve('Token deleted')
		  }
		});
	  });
	} catch (error_1) {
	  console.error(error_1);
	  throw new Error(error_1);
	}
};


module.exports = {
	validateUserToken,
	deleteUserToken
}