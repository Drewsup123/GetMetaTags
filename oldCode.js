/================================================SELENIUM=================================================
  (async function example() {
    var service = new chrome.ServiceBuilder(path).build();
    chrome.setDefaultService(service);
    let driver = await new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    try {
      await driver.get(req.body.url);
      // await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
      await driver.wait(until.elementLocated('.ud-app-loader ud-component--user-profile--app ud-app-loaded'), 8000);
    } finally {
      
      await driver.quit();
    }
  })();
/================================================XMLHTTPREQUEST=================================================
  const xhr = new XMLHttpRequest()
fetch(req.body.url,
  {
   
    method: 'GET',
    
    
    })
.then((res) => {
   
   console.log(res)
  
  })
.catch(err => {console.log(err)})
.then(res => console.log(res)).catch(err=> {console.log(err)})
let myUrl = req.body.url
  function makeRequest(myUrl) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', myUrl, "xP1gARnTmU2raiogQFCbjAq5ufaEtnjzD1bP2LA9","R7mGCykeGciRDm74QsmhfC0GsPmhZ5QMHDhyBLj6Rlo4Rvvd7ibgaM2r6fAdtKKearQdRo4JOGrF4BYDmSJtAuZayKwbL7jTlWRw6I1JIEJC4ESCIs7X536UmEPuVP80");
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}
/================================================CASPER=================================================
casper.start(req.body.url, ()=> {
  this.wait(2000, () => {
    fs.write("udemy.html", this.getHTML())
  })
})
casper.run()
/================================================WEBSHOT=================================================
webshot(req.body.url, 'profile.png', err => {
  console.log(err)
})
/================================================CAPTURER=================================================
  const capturer = new WebCapture();
  await capturer.capture(req.body.url).then(capturer.close()).catch(console.log)
  page.create();
  page.open(req.body.url, () => {
    setTimeout(() => {
      page.render("profile.png");
      phantom.exit();
    }, 200);
  });
  /================================================MORE XMLHTTPREQUEST=================================================
  
  await xhr.open('get', req.body.url, true)
xhr.onload = () => {
  
}
        xhr.onreadystatechange = await  async function(e) {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            
            setTimeout(()=>{
              xhr.send()
              res.status(200).send(xhr)
              console.log("hello 4seconds")
            }, 4000)
            
          } else {
            
          }
        }
      }
      
      
      
  
 
  
    xhr.open('GET', req.body.url, true);
    xhr.onloadstart = () => {
      setTimeout(() => {
        xhr.send();
      }, 4000)
        console.log(xhr)
       const div = document.querySelector('.main-content-wrapper').innerHTML += this.response.querySelectorAll('.profile-course-card--card--sx0Aa')
       console.log("DIV", div)
      
    
  
 
  console.log("response", xhr)
  
  'head'
/================================================PUPPETEER=================================================
  pup.launch().then(browser => {
      return browser.newPage();
  }).then(page => {
      return page.goto(req.body.url).then( () => {
          return page.content()
      });
  }).then(html => {
      console.log(html);
      res.status(200).send(html);
  }).catch(err => {
      console.log(err);
  })
    axios.get(req.body.url).then((response) => {
        res.status(200).send(response.data)
        console.log(response.data)
      return response.data
    }).catch((err)=> {
      console.log(err)
    })
  const url = req.body.url;
  if(url){
      const data = cheerio.load(url)
      res.status(200).send(data)
  }