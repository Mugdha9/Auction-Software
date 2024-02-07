const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const crypto = require('crypto');
const session = require('express-session');

const app = express();
app.use("/assets", express.static("assets"));
app.set('view engine', 'ejs');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "@Marshmallow123",
    database: "auction_software"
});

const secretKey = crypto.randomBytes(32).toString('hex');

app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true
}));

connection.connect(function (error) {
    if (error) throw error;
    else
        console.log("Connected to the database successfully");
});

app.listen(4500);

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

//Load Home page
app.post("/", bodyParser.urlencoded(), (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    req.session.username = username;

    connection.query("SELECT salt FROM ilance_users WHERE username = ?", [username], (error, results) => {
        if (error) {
            console.error("Error executing query: ", error);
            return res.status(500).send("Internal Server Error");
        }

        if (results.length > 0) {
            let salt = results[0].salt;
            console.log('Salt: ', salt);

            let hashedPassword = crypto.createHash('md5').update(crypto.createHash('md5').update(password).digest('hex') + salt).digest('hex');
            console.log('Hashed Password:', hashedPassword);

            connection.query("SELECT * FROM ilance_users WHERE username = ? AND password = ?", [username, hashedPassword], (error, results, fields) => {
                if (results.length == 1) {
                    res.redirect('/projects');
                } else {
                    res.redirect('/');
                }
                res.end();
            });
        } else {
            console.log("User not found");
            res.redirect('/');
            res.end();
        }
    });
});

//Display Projects
app.get('/projects', (req, res) => {
    let username = req.session.username;
    connection.query("SELECT p.project_title, u.username, p.date_added, c.category FROM ilance_users u JOIN ilance_projects p ON u.user_id = p.user_id LEFT JOIN ilance_categories c ON p.cid = c.cid where u.username = ? ORDER BY p.date_added DESC;", [username], (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        if(username === undefined){
            res.redirect('/');
        }
        if (results.length > 0) {
            res.render('projects', { results});
        } else {
            console.log('No projects found.');
            res.render('projects', { results }); 
        }
    });
});


//Logout
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/');
    });
});

//Handle incorrect URLs
app.use((req,res) => {
    res.status(404).render('404',{title:'404'});
});
