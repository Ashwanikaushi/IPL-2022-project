const request = require('request');
const fs = require("fs");
const path = require("path");
const jsdom = require("jsdom");// ipl 2021 ka link -> https://www.espncricinfo.com/series/ipl-2021-1249214
const allMatchPageObj = require("./allMatchPage");// yo link yha url me put krdo pura 2021 ipl ka data aajaga agr script same h to.
const helperObj = require("./helper");
let url = 'https://www.espncricinfo.com/series/indian-premier-league-2022-1298423';
// main page request 

let iplPath = path.join(__dirname, "IPL 2022");
helperObj.dirCreater(iplPath);
request(url, cb);


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
let element = document.querySelector(".ds-block.ds-text-center.ds-uppercase.ds-text-ui-typo-primary.ds-underline-offset-4");
// yha querselectorall bhi use kr skte bs fir element[0] ese index btana hoga so vese bhi hme unique element mil chuka h.
let link = element.getAttribute("href");
// console.log("link",link);
let AllMatchPageKaLink = "https://www.espncricinfo.com" + link;
console.log(AllMatchPageKaLink);
// allmatch page 
allMatchPageObj.AllmatchFn(AllMatchPageKaLink)

}