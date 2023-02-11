//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const aboutContent = `Welcome to JK Blogs, a platform where you can find fascinating and informative articles on a variety of topics. This blog is run by a passionate individual who has a love for writing and sharing knowledge with the world.

At JK Blogs, you can expect to find articles that are well researched, thought-provoking, and engaging. The blog is updated regularly with new content, ensuring that you never run out of interesting things to read. Whether you're looking for information on current events, science, technology, or anything in between, JK Blogs has got you covered.

The blog's creator has a deep appreciation for the power of information and the impact it can have on people's lives. They believe that by sharing their knowledge and insights, they can help make a difference in the world. With each article, they aim to inspire, inform, and educate their readers.

If you're a curious individual who loves to learn and explore new things, JK Blogs is the perfect platform for you. So, sit back, grab a cup of coffee, and start reading the articles today!`

const contactContent = `Welcome to the Contact Page of JK Blogs!

We appreciate your interest in connecting with us and would love to hear from you. If you have any questions, suggestions, or feedback regarding our website or any of our articles, please don't hesitate to reach out to us.`

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://admin-jattin:9h-5tGNPJN!Xec8@cluster0.xje4xs2.mongodb.net/blogDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  thumbnailUrl: String
})

const Blog = new  mongoose.model("Blog", blogSchema);


app.get("/", (req,res)=>{
  Blog.find({}, (err, posts)=>{
    res.render("home", {posts:posts})
  })
})

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

  const post = new Blog({
    title: req.body.postTitle,
    content: req.body.postBody,
    thumbnailUrl: req.body.thumbnailUrl
  })
  post.save(err=>{
    if(!err){
      res.redirect("/")
    }
  });

});

app.get("/posts/:postId", function(req, res){
  const requestedId = req.params.postId;

  Blog.findOne({_id: requestedId}, (err, post)=>{
    if(!err){ 
          res.render("post", {
            title: post.title,
            content: post.content
          });
    }
  })

});

let port = process.env.PORT
if(port == null || port == ""){
    port = 3000
}
app.listen(port, ()=>{
    console.log("Server started on port "+ port)
})
