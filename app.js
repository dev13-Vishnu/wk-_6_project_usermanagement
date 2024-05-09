const express =require("express");
const session = require("express-session");
const mongoose = require ("mongoose");
// const MongoStore = require("conncect-mongodb-session")(session);
const bcrypt = require ("bcrypt");

// connect to MongoDb
// mongoose.connect("mongodb://127.0.0.1:27017/user-auth")
// .then(() => {
//     console.log("connected to MongoDB");
// }).catch((err) => {
//     console.error("Error connecting to MongoDB:",err);
//     process.exit(1);
// });
// // Create the Express app
const app = express();

// const store = new MongoStore({
//     uri:'mongodb://127.0.0.1:27017/user-auth',
//     collection:'sessions'
// });

// app.use(session({
//     secret:'your-secret-key',
//     resave:false,
//     saveUninitialized:false,
//     store:store
// }));

// set ejs as view engine
app.set("view engine","ejs");

// parse request bodies
app.use(express.urlencoded({extended:true}));


// // Routes 
// app.get("/",(req,res) => {
//     res.render("index");
// });

app.get('/',(req,res) =>{
    res.render('login');
});


app.listen(3000,()=> {
    console.log("Server started on port 3000");
});