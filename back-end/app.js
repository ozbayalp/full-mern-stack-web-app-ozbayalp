require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// new route for my About Us page
app.get('/about', (req, res) => {
  res.json({ 
    title: 'About Us',
    paragraphs: [
      'Hi! This is my first time coding in javascript, I am excited to learn about javascript and learn how to code full-stack web applications. Some personal information about me, I am a Computer Science major that is in their junior year at NYU, I know it is a little early to say but I feel anxious about graduating already, time flies so quick!',
      'My name is Alp Ozbay and I am from Istanbul, Turkey. However, I also consider myself half French because I have grown up around a lot of french people because I was studying at a french High-school, my favorite subject in High-school was history or biology, I really do not know how I ended up studying computer science but here I am!',
      'I am a very curious person and I like to build solutions for people with problems, especially around health/medical related problems, my github has a few projects if you want to check them out, this is my old github account, in my new github account I try to contribute to a lot of open-source projects in my free-time. I think open-source is the future of this AI era and democratizing these new technologies through open-source is the best way to make sure that these technologies are not monopolized by a few big companies.',

    ],
    // to get a url of the picture I want I need to upload it in the repository first
    imageUrl: 'http://localhost:5002/about-photo.jpg' //my image is not loading I couldn't figure out why sorry.
  })
})

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})

// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
