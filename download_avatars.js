var request = require('request');
var fs = require('fs');
var ignore = require('./secrets');

var repoOwner = process.argv.slice(2)[0];
var repoName = process.argv.slice(2)[1];

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

getRepoContributors(repoOwner, repoName, function(err, result) {
    if (!repoOwner || !repoName){
        return console.log('invalid input')
    }

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

    .pipe(fs.createWriteStream('drrpbz/' + filePath + '.jpg'));
    };