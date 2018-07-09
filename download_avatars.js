var request = require('request');
var fs = require('fs');
var ignore = require('./secrets');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
    var options = {
      url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
      headers: {
        'User-Agent': 'request',
        'Authorization' : ignore.GITHUB_TOKEN
      }
    };
  
    request(options, function(err, res, body) {
      if (err) {
        cb(err, null)
      }
      else {
        var info = JSON.parse(body);
        cb(null, info);
      }
    })
  };

getRepoContributors("jquery", "jquery", function(err, result) {
    if (err) {
        console.log("Errors:", err);
        return
    }
    // console.log("Result:", result);
    result.forEach(element => {
        const url = element.avatar_url;
        const filePath = element.login;
        console.log(element.avatar_url);
        downloadImageByURL(url, filePath)
      });
});

function downloadImageByURL(url, filePath) {
    request.get(url)
    .on('error', function (err) {
      throw err; 
    })
    .on('response', function (response) {
      console.log('Response Status Code: ', response.statusCode);
    })
    .pipe(fs.createWriteStream('./' + filePath + '.jpg'));
    };