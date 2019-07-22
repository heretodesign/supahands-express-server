
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors())
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/bulletindb", {useNewUrlParser: true});

const postsSchema = {
  image: String,
  title: String,
  date: String,
  content: String,
  comment: String
};

const Posts = mongoose.model("Posts", postsSchema);

/*************************REQUESTS TARGETING ALL POSTS (REFACTORED)*********************************/

app.route("/api/posts")

  .get(function(req, res) {
    Posts.find(function(err, foundPosts){
      if (!err) {
        res.send(foundPosts);
      } else {
        res.send(err);
      }
    })
  })

  .post(function(req, res) {
    Posts.find(function(err, foundPosts){
      const newPost = new Posts({
        image: req.body.image,
        title: req.body.title,
        date: req.body.date,
        content: req.body.content,
        comment: req.body.comment
      });
      newPost.save(function(err){
        if (!err) {
          res.send("Succefully added a new Post!!");
        } else {
          res.send(err);
        }
      })
    })
  })

  .put(function(req, res) {
    Posts.updateMany(
      {title: req.params.postTitle},
      {
        image: req.params.image,
        title: req.params.title,
        date: req.params.date,
        content: req.params.content,
        comment: req.params.comment
      },
      {overwrite: true},
      function(err){
        if (!err) {
          res.send("Succefully Updated Post!!");
        } else {
          res.send(err)
        }
      }
    )
  })

  .patch(function(req, res) {
      Posts.findById(
        {id: req.params.id},
        {$set: req.body},
        function(err){
          if (!err) {
            res.send("Succefully Updated Post!!");
          } else {
            res.send(err);
          }
        }
      )
  })

  .delete(function(req, res){
    Posts.deleteMany(function(err){
      if (!err) {
        res.send("Succefully Deleted all Post!!");
      } else {
        res.send(err);
      }
    });
  });

/*************************  REQUESTS TARGETING A SPECIFIC POST    *********************************/
app.route("/api/posts/:postTitle")

.get(function (req, res) {
  Posts.findOne({title: req.params.postTitle}, function(err, foundPost){
    if (foundPost) {
      res.send(foundPost);
    } else {
      res.send("No Post Matching that TITLE was found!");
    }
  })
});

app.listen(4000, function() {
  console.log("Server started on port 4000");
});
