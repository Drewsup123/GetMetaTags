const express = require("express");
const server = express();
const cors = require("cors");
const urlMetadata = require("url-metadata");
const request = require("request");
const cheerio = require("cheerio");
const requestPromise = require("request-promise");
server.use(express.json());
server.use(cors());

const loadDB = require("./firebaseConfig");
const firebase = require("firebase");

async function addToUdemyCollection(userId, metaData){//passing in single url object
    console.log(metaData)
    let result = await loadDB();
    let db = result.firestore();
    let link = metaData.url;
    let newLink = link.split("//").pop().replace(/[/]/g, "-");
    console.log('newLink:  ', newLink)
    const contentRef = db.collection('content-collection');

    contentRef.doc(newLink).set({
        title: metaData.title,
        author: metaData.author,
        photoUrl: metaData.image,
        description: metaData.description,
        link: link,
        UserList: firebase.firestore.FieldValue.arrayUnion(userId)
    }).then(() => {
        console.log("Added content to the db", )
        db.collection('user').doc(userId).update({ UdemyList: firebase.firestore.FieldValue.arrayUnion(newLink)}).then(() => { 
            console.log("SUCCESS")
        })
    }).catch((err) => {
        console.log("error adding courses to the db", err);
    });
}

server.get("/", (req, res) => {
  res.status(200).send("hello");
});


var whitelist = ['http://localhost:1738', 'https://learned-app.now.sh/','http://localhost:1738/Homepage','http://localhost:3333']
var corsOptions = {
  origin: function (origin, callback) {
    console.log(origin)
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

server.post("/udemy-cat", /*cors(corsOptions),*/ async (req, res) => {
  let categoryArr = req.body.category
  let finalArr = [];
  console.log(req.body)
  await (async () => {

    for (const cat of categoryArr){
      let url = "https://www.udemy.com/api-2.0/courses/?page=1&page_size=5&category=" + cat;
        console.log("url:   ", url);
        await requestPromise(
          {
            method: "GET",
            url: url,
            headers: {
              Accept: "application/json, text/plain, */*",
              Authorization:
                process.env.UDEMY_AUTH,
            },
            json: true
          },
          await function(error, response, body) {
            // console.log("BODY:  ", body);
            console.log("I AM BEING CALLED")
            for (let j = 0; j<body.results.length; j++){
              console.log(`${j}: ${body.results[j]}`)
              console.log(body.results[j])
              let {title, image_480x270, author, url, price} = body.results[j]
              url = `https://www.udemy.com${url}`

              console.log(j,":  ", title )
              finalArr.push({title,image_480x270, author, url, price});
            }
          
        }
      );
}
  })();

  res.status(200).send(finalArr) 
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

server.post("/user-udemy", async (req, res) => { //RUNTIME == 15-30 seconds
  // api key :  9bd569c5901a72fa4a94d2b525a9b007
  var url = req.body.url; //this will be dynamic
  let userId = req.body.userId;
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
  await(async ()=>{
    for(let i = 0; i<Final.length; i++){
      console.log("adding something to the database now :)", i);
      await(addToUdemyCollection(userId, Final[i]))
    }
  })();
  res.status(200).send("done");
});

module.exports = server;
