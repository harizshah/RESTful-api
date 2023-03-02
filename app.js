//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// CONNECT
mongoose.connect("mongodb://0.0.0.0:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema)

////////// Request Targeting All Articles

// Chained Route Using Express
app.route("/articles").get(function(req, res){
    Article.find().then(function(foundArticles){
         res.send(foundArticles);
    }).catch(function(err){
         res.send(err);
    });
})
.post(function(req, res){
    console.log(req.body.title);
    console.log(req.body.content);

    //Create
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    })

    newArticle.save(function(err){
        if (!err) {
            res.send("Successfully added new article")
        } else {
            res.send(err);
        }
    });
})
.delete(function(req, res) {
    Article.deleteMany({})
      .then(function() {
        res.send("Successfully deleted all articles");
      })
      .catch(function(err) {
        res.send(err);
      });
  });

////////// Request Targeting All Articles


app.route("/articles/:articleTitle")
  .get(function(req, res) {
    Article.findOne({ title: req.params.articleTitle })
      .then(function(foundArticle) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("No articles matching that title were found.");
        }
      })
      .catch(function(err) {
        res.send(err);
      });
  })

  .put(function(req, rs){
    Article.update(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err) {
            if(!err) {
                res.send("Successfully updated")
            }
        }

        )
  })

  .patch(function(req, res){

    req.body = {
        title: "TEST",
        content: "TEST"
    }
    Article.update(
        {title: req.params.articleTitle},
        {$set : {content: "", title:""}},
        function(err){
            if (!err) {
                res.send("Successfully updated article")
            } else {
                res.send(err)
            }
        }
    )
  })

  .delete(function(req, res){
    Article.deleteOne({ title: req.params.articleTitle }, function(err) {
        if (!err) {
          res.send("Successfully deleted the corresponding article.");
        } else {
          res.send(err);
        }
      });
  })


app.listen(3000, function() {
  console.log("Server started on port 3000");
});  
