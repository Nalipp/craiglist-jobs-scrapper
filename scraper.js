var request = require('request');
var cheerio = require('cheerio');


function queryCraigslistPages() {
  var numberOfRequests = process.argv[2];
  var arrayOfUrls = generateUrlRequests(numberOfRequests)
  var combinedResults = scrapeEach(arrayOfUrls);
  console.log(combinedResults);
}

function generateUrlRequests(numberOfRequests) {
  var baseUrl = 'http://seoul.craigslist.co.kr/search/edu';
  var arrayOfUrls = [baseUrl];

  for (let i = 100; i <= numberOfRequests; i += 100) {
    arrayOfUrls.push(`${baseUrl}?s=${i}`)
  }
  return arrayOfUrls
}

function scrapeEach(arrayOfUrls) {
  var combinedResults = [];
  for (let i = 0; i < arrayOfUrls.length; i++) {
    combinedResults.push(scrapePage(arrayOfUrls[i]));
  }
  return combinedResults;
}


function scrapePage(address) {
  request(address, function (error, response, htmlStr) {
    if (!error && response.statusCode == 200) {
      var resultRowArr = htmlStr.split('<li class="result-row"');
      var resultsArr = [];
      for (let i = 2; i < resultRowArr.length; i++) {
        resultsArr.push([scrapeUrl(resultRowArr[i]) + "," + scrapeLocation(resultRowArr[i])]);
      }
      console.log(resultsArr);
    }
  });
}

function scrapeUrl(resultRow) {
  var myRe = /a href="\/(.+).html/;
  var jobUrl = myRe.exec(resultRow);
  return `http://seoul.craigslist.co.kr/${jobUrl[1]}.html`;
}

function scrapeLocation(resultRow) {
  var myRe = /result-hood"> \((.+)\)<\/span>/;
  var jobLoc = myRe.exec(resultRow);
  if (jobLoc !== null) return jobLoc[1];
  return "no location";
}


queryCraigslistPages()
