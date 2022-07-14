const request = require('request');
const fs = require("fs");
const path = require("path");
const jsdom = require("jsdom");
const helperObj = require("./helper");

function scoreCardExecutor(url){
    request(url,cb);
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
let output = document.querySelectorAll(".ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo-title");
let resultElem = output[0];
let res = resultElem.textContent;
// console.log("result: ",res);
let othercontentelem = document.querySelector(".ds-text-tight-m.ds-font-regular.ds-text-ui-typo-mid");
let otherContent = othercontentelem.textContent;

// 0 -> team 1 name, 1 -> team 2 name
let teamNamesElement = document.querySelectorAll(".ds-flex.ds-items-center.ds-cursor-pointer.ds-px-4");
// tables -> from a match -> 4 tables -> 2 batting , 2 bowling
// -> 0 idx -> team 1 batting, 1 -> team 2 bowling,
// 2 -> team 2 batting , 3 -> team 1 bowling 

let teamStatsElements = document.querySelectorAll(".ReactCollapse--content table");
// let htmlString = "<table>" + teamStatsElements[0].innerHTML + "</table>";


// fs.writeFileSync("firstTeam.html", htmlString);
// console.log("file created");
let firstBattingTeam = teamStatsElements[0];
let secondBattingTeam = teamStatsElements[2] ;


let firstTeamName = teamNamesElement[0].textContent;
// yha kuch nhi bs hum jab folder bna rhe the tab 
// team INNINGS (20 overs) likha aa rha tha jisse folder nhi ban rha tha
// in neeche wali line se ye hat gya or folder ban gya:) 
let firstTeamNameArr = firstTeamName.split("INNINGS");
firstTeamName = firstTeamNameArr[0].trim();
// trim simply aage peeche ke wide space ko remove krta h


let secondTeamName = teamNamesElement[1].textContent;
let secondTeamNameArr = secondTeamName.split("INNINGS");
secondTeamName = secondTeamNameArr[0].trim();


processTeam(firstBattingTeam, firstTeamName,secondTeamName,res, otherContent);
processTeam(secondBattingTeam, secondTeamName, firstTeamName,res, otherContent);
console.log("----------------------------------------");

}

function processTeam(TeamElement, currTeam, opponentTeam, result, otherDetails){
// it will print all the stats of it's player
let allRowswithextras = TeamElement.querySelectorAll("tbody tr.ds-border-b.ds-border-line.ds-text-tight-s");
// console.log(allRowswithextras.length);
for(let i = 0; i< allRowswithextras.length; i++){
    // required rows -> remove extra rows 
    let cRow = allRowswithextras[i];
    let cols = cRow.querySelectorAll("td");
    if(cols.length == 8 ){
        let name = cols[0].textContent.trim();
        let runs = cols[2].textContent;
        let balls = cols[3].textContent;
        let fours = cols[5].textContent;
        let sixes = cols[6].textContent;
        let sr = cols[7].textContent;
        // console.log("Name "+ name + " plays for " + currTeam + " against " + opponentTeam +" Runs " + runs+ " balls "
        // + balls + " fours "+ fours + " sixes "+ sixes + " sr " 
        // + sr + " result " + result + " otherDetails " + otherDetails);
    // venue, result , teamName, opponent teamname
    let dataObj = {
        name, runs, balls, fours, sixes, sr, opponentTeam, result, otherDetails
    }
    dataOrganizer(currTeam, name, dataObj);
    }
}
console.log("------------------------");
}

function dataOrganizer(teamName, playerName, dataObj){
    // folder will not be present
    // folder will be present
    const teamPath = path.join(__dirname, "IPL 2022",teamName);
    helperObj.dirCreater(teamPath);

    // file will not be present
    const playerPath = path.join(teamPath, playerName+ ".xlsx");// .json file extension name h only
   helperObj.fileHandler(playerPath, dataObj)
   
}



module.exports = {
    scoreCardFn: scoreCardExecutor
}
