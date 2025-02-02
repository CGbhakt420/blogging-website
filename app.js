require('dotenv').config();

const express = require("express");
const path = require("path");
const userRoute = require("./routes/user");
const blogRouter = require("./routes/blogs")
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const { Blog } = require("./models/blog");

const app = express();
const PORT = process.env.PORT || 8005;

mongoose.connect(process.env.MONGO_URL).then((e)=>console.log("MongoDB connected"))

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')))

app.get('/', async (req, res)=>{
    const allBlogs = await Blog.find({})
    console.log(req.user);
    res.render('home',{
        user: req.user,
        blogs: allBlogs
    });
    
})

app.use('/user', userRoute);
app.use('/blog', blogRouter);

app.listen(PORT, ()=> console.log(`Server started at PORT:${PORT}`)); 