const express = require('express')
const app = express()
const port = 3002
//middle ware file
const user_model = require('./user')
const token_model = require('./token')
const event_model = require('./event')
const NoReportsError = require('./Errors')

app.use(express.json())

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization');
  next();
})

app.get('/eventconflicts', (req, res) => {
  event_model.getConflictEvents(req.headers, req.query)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    if (error.name === "NoReportsError") {
      res.status(204).send(error);
    } else {res.status(500).send(error);}
  })
})

app.get('/events', (req, res) => {
  
  event_model.getEvents(req.headers, req.query)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    if (error.name === "NoReportsError") {
      res.status(204).send(error);
    } else {res.status(500).send(error);}
  })
})

app.post('/events', (req, res) => {
  event_model.createEvent(req.headers, req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

/**
 * app.get('/loginattempts', (req, res) => {
  token_model.validateUserToken(req.headers)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})
 */

app.delete('/loginattempts', (req, res) => {
  token_model.deleteUserToken(req.headers)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.post('/loginattempts', (req, res) => {
  user_model.getUser(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.post('/user', (req, res) => {
  user_model.createUser(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})