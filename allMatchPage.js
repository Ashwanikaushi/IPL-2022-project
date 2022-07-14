const request = require('request');
const fs = require("fs");
const jsdom = require("jsdom");
const scoreCardObj = require("./Scorecard");


// main page request 

function AllMatchPageExecutor(url){
    request(url, cb);
}




// data recieve
function cb(error, response, body){
   
    if(error){
        console.log('error:',error.message);// print the eror message 

    }else if (response && response.statusCode == 404){
        console.log("Page not found");

    }else{
    //    console.log( body); // print the HTML for the google homepage.
       
       console.log("content recieved");
       extractData(body);
        }
}
function extractData(body){
    const JSDOM = jsdom.JSDOM;
    let dom = new JSDOM(body);

let document = dom.window.document;
let matchboxes = document.querySelectorAll(".ds-flex.ds-mx-4.ds-pt-2.ds-pb-3.ds-space-x-4.ds-border-t.ds-border-line-default-translucent");
for(let i=0; i<matchboxes.length; i++){
let curmatch = matchboxes[i];
let allanchors = curmatch.querySelectorAll("a");
let scorecardanchor = allanchors[2];
let link = scorecardanchor.getAttribute("href");
let ScoreCardLink = "https://www.espncricinfo.com" + link;
console.log(ScoreCardLink);
scoreCardObj.scoreCardFn(ScoreCardLink)
}

}
module.exports = { // to export to another program 
    AllmatchFn:AllMatchPageExecutor// it is an another function in this code
}