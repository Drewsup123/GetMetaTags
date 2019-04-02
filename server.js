const express = require("express");
const server = express();
const cors = require("cors");
const urlMetadata = require("url-metadata");
const request = require("request");
const cheerio = require("cheerio");
const requestPromise = require("request-promise");
server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
  res.status(200).send("hello");
});

server.post("/udemy-cat", async (req, res) => {
  console.log(req.body);
  let category = req.body;
  await requestPromise(
    {
      method: "GET",
      url: "https://www.udemy.com/api-2.0/courses/?category=" + category,
      headers: {
        Accept: "application/json, text/plain, */*",
        Authorization:
          "Basic eFAxZ0FSblRtVTJyYWlvZ1FGQ2JqQXE1dWZhRXRuanpEMWJQMkxBOTpSN21HQ3lrZUdjaVJEbTc0UXNtaGZDMEdzUG1oWjVRTUhEaHlCTGo2UmxvNFJ2dmQ3aWJnYU0ycjZmQWR0S0tlYXJRZFJvNEpPR3JGNEJZRG1TSnRBdVpheUt3Ykw3alRsV1J3NkkxSklFSkM0RVNDSXM3WDUzNlVtRVB1VlA4MA==",
        "Content-Type": "application/json;charset=utf-8"
      }
    },
    function(error, response, body) {
      console.log(body)
      res.status(200).send(body)
    }
  );
});

server.post("/get-meta", (req, res) => {
  const url = req.body.url;
  if (url) {
    if (url.includes("http://") || url.includes("https://")) {
      urlMetadata(url)
        .then(data => {
          res.status(200).send(data);
        })
        .catch(err => {
          res.status(500).send(err);
        });
    } else {
      res
        .status(400)
        .send("bad request. Make sure to have http or https in req.body");
    }
  } else {
    res.status(500).send("Url not provided");
  }
});

server.post("/user-udemy", async (req, res) => {
  //RUNTIME == 45-55 seconds
  // api key :  9bd569c5901a72fa4a94d2b525a9b007
  var url = req.body.url; //this will be dynamic
  let links = []; // original array of "/coursename" links
  let LinksArr = []; //full udemy link with https://www.udemy.com/ parsed in
  let Final = []; //Final array full of metaData from href endpoints

  await requestPromise(
    {
      method: "GET",
      url:
        "http://api.scraperapi.com/?key=9bd569c5901a72fa4a94d2b525a9b007&url=" +
        url +
        "&render=true",
      headers: {
        Accept: "application/json"
      }
    },
    function(error, response, body) {
      const $ = cheerio.load(body); // loads the html body, which should be a string of html content
      $(".merchandising-course-card--mask--2-b-d").each(function(i, elm) {
        //go to each class of the <a> of courses. In this case it is '.merchandising....' class
        links.push($(elm).attr("href")); // push only the href of each element to links array
      });
      for (let i = 0; i < links.length; i++) {
        LinksArr.push(`https://www.udemy.com${links[i]}`); // pushes full link to Final array so we can reference it later
      }
    }
  ); //end request()

  //need to wait for this function to run before sending the res
  await (async () => {
    for (let i = 0; i < LinksArr.length; i++) {
      console.log(LinksArr[i]);
      // need to wait for this function as well
      await urlMetadata(LinksArr[i])
        .then(data => {
          Final.push({ ...data });
          console.log(Final);
        })
        .catch(err => {
          return -1;
        });
      // console.log("METADATA", metaData)
      // Final.push({...metaData, url : LinksArr[i]})
      // console.log("final at ",i,Final)
    }
  })();
  res.status(200).send(Final);
});

module.exports = server;
