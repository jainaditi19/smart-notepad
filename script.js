// import express from 'express'

// const app = express();

// app.use(express.json()); // Middleware to parse JSON bodies
// app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
// //so that we can check and use or see req.body on postman
// //as data gets mixed up(url encoded way) when coming from browser to server 

// app.use(function(req, res, next) {
//     console.log("hey middleware");
//     next();
// })

// app.use(function(req, res, next) {
//     console.log("hey middleware 2");
//     next();
// })

// app.get('/', (req, res) => {
//   res.send('Hello World and Hello Node.js!') // shown on the browser
// })

// app.get('/about', (req, res) => {
// //   res.send('Hello About!')
//     return next(new Error('Something went wrong!')) // This will trigger the error handler and skip the response
//     //this will come in console
// })

// app.use((err, req, res, next) => {
//     console.error(err.stack)
//     res.status(500).send('Something broke!') // shown on the browser
// })


// app.listen(3000)

const express = require('express');
const path = require('path'); // Import the path module to handle file paths
const fs = require('fs'); // Import the fs module to handle file system operations


const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
// //to use form data from browser to server

app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' directory
// //static files like css, js, images etc are stored in public folder so it's a direction to serve static files
// //whole path to public folder is given
// //__dirname is a global variable that gives the current directory of the file

app.set('view engine', 'ejs'); // Set EJS as the templating engine

// app.get('/', function(req, res) {
//     // res.send("Hey it's working")
//     res.render("index")
// })

// app.get('/profile/:username', function(req, res) {   //after adding : username, it becomes a route parameter (a dynamic part of the URL)
//     req.params.username //req.params is an object that contains route parameters
//     res.send(req.params.username + "'s profile") //send the username in the response
//     // res.render("index")
// })

// app.get('/profile/:username/:page', function(req, res) {   
//     res.send(req.params) //give an object with both username and page
//     // res.render("index")
// })

app.get('/', function (req, res) {
    // res.send("Welcome")
    fs.readdir(`./files`, function (err, files) {
        console.log(files); // at first blank array and then show files names in that folder
        res.render("index", { files: files })

    })
})

app.get('/files/:filename', function (req, res) {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function (err, data) { //utf-8 is used to read the file as text
        res.render('show', { filename: req.params.filename, filedata: data })
    })
})

app.get('/edit/:filename', function (req, res) {
    res.render('edit', { filename: req.params.filename })
})

app.post('/create', function (req, res) {
    console.log("rew", req.body); // req.body contains the data sent from the form
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, function (err) {
        res.redirect('/'); // Redirect to the home page after creating the file
    })
})

app.post('/edit', function (req, res) {
    fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}`, function (err) {
        res.redirect('/'); // Redirect to the home page after renaming the file        
    });
})

// app.listen(3000, function(){
//     console.log('Server is running on port 3000');    
// });
app.listen(3000);