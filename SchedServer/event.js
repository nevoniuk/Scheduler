const Pool = require('pg').Pool
const token_model = require('./token')
var NoReportsError = require('./Errors');
const { 
	v4: uuidv4,
	} = require('uuid');
	
const pool = new Pool({
  user: 'newuser',
  host: 'localhost',
  database: 'scheduler_db',
  password: 'root',
  port: 5432,
}); 

const createEvent = async (req, body) => {
	try {
		const id = await token_model.validateUserToken(req)
		if (id === undefined || id === null) {
			reject(new Error("Invalid Token"));
		}
		var userid = id["userid"]
		
		return new Promise(function (resolve, reject) {
			const {name, start, end, details} = body;
			var eventid = uuidv4()

			var startdate = start
			var enddate = end
			startdate.slice(0, start.length - 1)
			enddate.slice(0, end.length - 1)
		
			pool.query(
				"INSERT INTO events (eventid, userid, startdate, enddate, name, details) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
				[eventid, userid, startdate, enddate , name, details],
				(error, results) => {
				if (error) {
					reject(new Error("query incorrect"));
				}
				if (results && results.rows) {
					resolve(
					`A new event has been added: ${JSON.stringify(results.rows[0])}`
					);
				} else {
					reject(new Error("event could not be added"));
				}
				}
			);
		});
	}
	catch (error_1) {
		console.error(error_1);
		throw new Error(error_1);
	}
	
  };

//time passed in the body is converted to UTC, time passed as a parameter is not
  const getEvents = async (req, query) => { //takes a start and end date as parameters
	try {
		
		const id = await token_model.validateUserToken(req)
		if (id === undefined || id === null) {
			reject(new Error("Invalid Token"));
		}
	  	return await new Promise(function (resolve, reject) {
		var userid = id["userid"]
		const {startDate, endDate} = query; //need to be GMT/UTC time
		var startdate = startDate
		var enddate = endDate
		var index1 = startDate.indexOf('G')
		var index2 = endDate.indexOf('G')
		startdate = startdate.slice(0, index1)
		enddate = enddate.slice(0, index2)
		if (!endDate || !startDate) {
			reject(new Error("start or end not given"));
		}
		console.log(startDate)
		console.log(endDate)
		pool.query("SELECT * FROM events WHERE userid=($1) AND startdate >= ($2) AND enddate <= ($3) ORDER BY startdate;", [userid, startdate, enddate],
		 (error, results) => {
		  if (error) {
			reject(error);
		  }
		  if (results && results.rows && (results.rows[0] != undefined)) {
			resolve(results.rows)
			console.log("events found")
		  } else if (!results || !results.rows || results.rows[0] === undefined) {
			reject(new NoReportsError("No results"))
		  }
		});
	  });
	} catch (error_1) {
	  console.error(error_1);
	  throw error_1;
	}
  };


  //time passed in the body is converted to UTC, time passed as a parameter is not
  const getConflictEvents = async (req, query) => { //takes a start and end date as parameters
	try {
		
		const id = await token_model.validateUserToken(req)
		if (id === undefined || id === null) {
			reject(new Error("Invalid Token"));
		}
	  	return await new Promise(function (resolve, reject) {
		var userid = id["userid"]
		const {startDate, endDate} = query; //need to be GMT/UTC time
		var startdate = startDate
		var enddate = endDate
		var index1 = startDate.indexOf('G')
		var index2 = endDate.indexOf('G')
		startdate = startdate.slice(0, index1)
		enddate = enddate.slice(0, index2)
		if (!endDate || !startDate) {
			reject(new Error("start or end not given"));
		}
		console.log("Possible conflict event start " + startDate)
		console.log("Possible conflict event end " + endDate)
		pool.query("SELECT * FROM events WHERE userid=($1) AND (((($2) >= startdate AND ($2) <= enddate) OR  (($3) >= startdate AND ($3) <= enddate)) OR (($2) < startdate AND ($3) > enddate)) ORDER BY startdate;", [userid, startdate, enddate],
		 (error, results) => {
		  if (error) {
			reject(error);
		  }
		  if (results && results.rows && (results.rows[0] != undefined)) {
			resolve(results.rows)
			console.log("Conflicting events found")
		  } else if (!results || !results.rows || results.rows[0] === undefined) {
			reject(new NoReportsError("No results"))
		  }
		});
	  });
	} catch (error_1) {
	  console.error(error_1);
	  throw error_1;
	}
  };
/**
 * const deleteEvent = (body) => {
	return new Promise(function (resolve, reject) {
	  const { name, email, password } = body;
	  pool.query(
		"INSERT INTO users (userid, email, password) VALUES ($1, $2, $3) RETURNING *",
		[name, email, password],
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
 */
  

  module.exports = {
	getEvents,
	createEvent,
	getConflictEvents
  };