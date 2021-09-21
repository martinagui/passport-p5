const express = require("express");
const helmet = require("helmet");
const http = require("http");
const path = require("path");
const sequelize = require('./api/models/index');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const config = require("./server.config.js");

const passport = require('./passport-config');

const app = express();

// Express Route File Requires
const authAPI = require("./api/routes/index");

app.use(helmet());
app.use(express.static(path.resolve(__dirname, "./src/public")));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: "bootcamp", resave: true, saveUninitialized: true}));

// Three pieces need to be configured to use Passport for authentication:

// 1) Authentication strategies
// 2) Application middleware XX DONE
// 3) Sessions (optional)


app.use(passport.initialize());
app.use(passport.session());


// Express Routing
app.use("/api", authAPI);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "./src/public", "index.html"));
});


sequelize.db.sync({force:false})
.then(()=>{
  console.log('Connected to database!');
  http.createServer(app).listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
})



