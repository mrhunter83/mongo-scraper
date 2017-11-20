var express = require('express');
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require('mongoose');
var path = require('path');

var cheerio = require("cheerio");
var request = require("request-promise");

var db = require("./models/models.js");

var PORT = 3000;
var app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/news', {useMongoClient: true});


function scrape() {
	var options = {
		uri: 'https://www.npr.org/sections/news/archive',
		transform: function(html) {
			return cheerio.load(html);
		}
	};
	return request(options) 
	.then(function($) {
		var image = [];
		var headline = [];
		var summary = [];
		var url = [];
		var news = {headline: [], summary: [], url: []};

		db.Article.remove({});

		$('div.item-info').each(function(i, element) {
			// Need additional functionality to exclude redundant articles; tried jQuery.inArray(), couldn't get it to work.
			// Also tried for loop with if statments to check each element of array before pushing, no dice
			if($(this).find('h2.title').text().trim()){
				news.headline = $(this).find('h2.title').text().trim();
			}
			if($(this).find('p.teaser').text().trim()){
				news.summary = $(this).find('p.teaser').text().trim();
			}
			if($(this).find('h2.title').find('a').attr('href')){
				news.url = $(this).find('h2.title').find('a').attr('href');
			}

			db.Article
			.create(news)
			.then(function(dbArticle) {
				res.send("Scrape Complete");
			});
		});
		console.log(news);
		return news;
	});
}

scrape();

app.get("/articles", function(req, res) {
	db.Article
	.find({})
	.then(function(dbArticle) {
		res.json(dbArticle);
	})
});

app.get("/articles/:id", function(req, res) {
  db.Article
    .findOne({ _id: req.params.id })
    .populate("comment")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
});

app.post("/articles/:id", function(req, res) {
  db.Comment
    .create(req.body)
    .then(function(dbComment) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbComment._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
});

app.get("/home", function(req, res) {
	res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, function() {
	console.log("App running on port " + PORT + "!");
});