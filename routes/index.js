var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');

/* GET home page. */
router.get('/', function(req, res) {
  var url = "http://filmgola.com/home";
    request(url, function(error, response, html){
      if(!error){
        console.log('entered');
        var $ = cheerio.load(html);
        var prefix = "http:";
        var site = "http://filmgola.com";
        var result = [];
        $('.appTrailer').each(function(i, element){

             var trailers = {image:"", name:"", link:""}; 

             var img = $(this).children().first().children().first().children().attr('src');
             img = prefix.concat(img);
             var li = $(this).children().first().children().attr('href');
             li = site.concat(li);
             var na = $(this).children().first().next().next().children().first().text();

             trailers.image = img;
             trailers.name = na;
             trailers.link = li;

             result.push(trailers);
        });
        res.render('index', {result:result});
      }
      else{
        console.log('not entered');
      }
  });
  //res.render('index', { title: 'Express' });
});

router.get('/user', function(req, res){
  var url = "http://www.filmgola.com/filmHistory";
  request(url, function(error, response, html){
    if(!error){
      console.log('entered');
      var $ = cheerio.load(html);
      var result=[];
      var prefix = "http://www.filmgola.com";
      $('#filmHistory .odd').each(function(i, element){

          var li = {moviename:"", link:"", rate:""};
          var li2={moviename:"", link:"", rate:""};

          var name1 = $(this).children().first().children().text();
          var link1 = $(this).children().first().children().attr('href');
          var rate1 = $(this).children().first().next().next().children().first().children().text();
          li.moviename = name1;
          li.rate = rate1;
          //li.link = prefix.concat(link1);
          li.link = link1;

          var name2 = $(this).next().children().first().children().text();
          var link2 = $(this).next().children().first().children().attr('href');
          var rate2 = $(this).next().children().first().next().next().children().first().children().text();
          li2.moviename = name2;
          //li2.link = prefix.concat(link2);
          li2.link = link2;
          li2.rate = rate2;
      
          result.push(li);
          result.push(li2);
      });
      res.render('user', {result:result});
    }
    else{
        console.log('cannot enter the url - failed');
    }
  });
});

router.get('/history',function(req, res){
  var url = "http://www.filmgola.com/filmHistory";
  request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);
      $('#filmHistory .odd').each(function(i, element){
        var name = $(this).children().first().children().text();
        var link1 = $(this).children().first().children().attr('href');
        var rate1 = $(this).children().first().next().next().children().first().children().text();
        console.log(name);
        console.log(link1);
        console.log(rate1);
        var name2 = $(this).next().children().first().children().text();
        var link2 = $(this).next().children().first().children().attr('href');
        var rate2 = $(this).next().children().first().next().next().children().first().children().text();
        console.log(name2);
        console.log(link2);
        console.log(rate2);
      });
    }
    else{
      console.log('error in openning');
    }
  });
});

router.get('/reviews', function(req, res){
  
  var movieurl = req.url.split('=');
  var prefix = "http://www.filmgola.com";

  var sub1 = "http://www.omdbapi.com/?t=";
  var sub2 =  "&y=&plot=full&r=json";
 
  var url = movieurl[1];
  var movienameis = url.split('/');
  var nameis = movienameis[2];
  url2 = sub1.concat(nameis);
  url2 = url2.concat(sub2);
  
  var  movie = {overallrating:"", allsites:"", name:"",image:"", story:"", genre:"", director:"", actors:"", language:"", date:""};
  var  result = {post:""};

  url = prefix.concat(url);

  
  request(url, function(error, response, html){
    if(!error){
          var $ = cheerio.load(html);
          var site;
          var rate;
          var others = [];
          var name = $('.filmName').text();
          var overallrating = $('.criticRating').text();
          console.log(overallrating);
          $('.reviewbox').each(function(i, element){
            var li = {site:"", rate:"", story:"",extlink:""};
            site = $(this).children('.siteName').text();
            rate = $(this).children('.siteRating').text();
            shortstory = $(this).children('.body').text();
            externallink = $(this).children('.bottom').children().first().attr('href');

            li.site = site;
            li.rate = rate;
            li.story = shortstory;        
            li.extlink = externallink;
            others.push(li);
            
          });
          var story = $('.filmInfo').text();
          var photo = $('.filmPosterArea').children().first().children().attr('src');
         // movie = {overallrating:"", allsites:"", name:"",image:"", story:"", genre:"", director:"", actors:"", language:"", date:""};
         // result = {post:""};
          movie.overallrating = overallrating;
          movie.allsites = others;
          movie.name = name;
          movie.story = story;
          movie.image = photo;

          while(response == null){}


        request(url2, function(error, response, html){
        if(!error){

           jsonresult = JSON.parse(html);
           movie.actors=jsonresult.Actors;
           movie.director = jsonresult.Director;
           movie.genre = jsonresult.Genre;
           movie.language = jsonresult.Language;
           movie.date = jsonresult.Released;
          
           result.post = movie;  
           res.render('telugumovies',{movie:result.post});
        }
        else{
          console.log('cannot enter omdb');
        }
      })
     
             //result.post = movie;  
             //res.render('telugumovies',{movie:result.post});

      }

      else{
          console.log(error);
      }
        });
});

router.get('/hindi', function(req, res){
  var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  for (var num =0; num < letters.length;num++){
    console.log(letters[num]);
    var url = "http://movies.ndtv.com/movie-reviews/bollywood/"+letters[num];
    request(url, function (error, response, html) {
      if (!error) {
        var $ = cheerio.load(html);
        linksarray = [];
        $('.ndmv-pagination').children().each(function (i, element) {
          var link = $(this).attr('href');
          linksarray.push(link);
        });
        var dummy = linksarray.pop();
        linksarray.push(url);
        for (var i = 1; i < linksarray.length; i++) {
          var head = linksarray[i];
          request(head, function (error, response, html) {
            if (!error) {
              var rav = cheerio.load(html);
              rav('.ndmv-review-title').each(function (i, element) {
                var title = rav(this).children().first().children().text();
                var href = rav(this).children().first().children().attr('href');
                console.log(title);
                //console.log(href);
              });
            }
            else {
              console.log('error in opening all links');
            }
          });
        }

      }
      else {
        console.log('error in opening url');
      }
    });
  }
});



module.exports = router;
