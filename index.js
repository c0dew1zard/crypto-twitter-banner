// Require all the packages
require('dotenv').config()
const client = require('twitter-api-client');
const axios = require('axios');
const fs = require('fs');
const jimp = require('jimp');
const textToImage = require('text-to-image');
const fetch = require('node-fetch');


// Your Twitter account
const TWITTER_HANDLE = 'C0deW1zard'
const twitterClient = new client.TwitterClient({
  apiKey: process.env.API_KEY,                      //YOUR CONSUMER API KEY
  apiSecret: process.env.API_SECRET,                //YOUR CONSUMER API SECRET 
  accessToken: process.env.ACCESS_TOKEN,            //YOUR ACCESS TOKEN
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET    //YOUR ACCESS TOKEN SECRET
});

// Test the twitter-api-client
// async function test() {
//   const data = await twitterClient.accountsAndUsers.followersList({ screen_name: 'C0deW1zard', count: 3 });

//   console.log(data.users)
// }


// test()

let quotes;


//push the url of profile image recent followers
let image_url = [];

//check below drawit()
let lastDrawImage = 0;

//function to download image
const download_image = (url, image_path) =>
  axios({
    url,
    responseType: 'stream',
  }).then(
    response =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on('finish', () => resolve())
          .on('error', e => reject(e));
      }),
  );

// function to draw image and post it
async function drawImage(back) {
  //Creating an array so it becomes easier to Promise.all instead of one at a time
  //Would love to see if you have any other approach to this, can't think of anything else
  let imgArr = [back];

  let jimps = [];

  //Read the image in jimp and push it to jimps array 
  imgArr.forEach(image => jimps.push(jimp.read(image)));

  // fetch all the images
  Promise.all(jimps).then(data => {
    return Promise.all(jimps)
  }).then(data => {

    (async () => {

      let quoteidx = getRandomInt(0, 1500);

      let quote = quotes[quoteidx].text;

      
      let btc = await axios.get('https://api.binance.com/api/v3/avgPrice?symbol=BTCUSDT');
      let eth = await axios.get('https://api.binance.com/api/v3/avgPrice?symbol=ETHUSDT');
      let bnb = await axios.get('https://api.binance.com/api/v3/avgPrice?symbol=BNBUSDT');

      console.log("BTC PRICE:", btc.data.price);
      console.log("ETH PRICE:", eth.data.price);
      console.log("BNB PRICE:", bnb.data.price);

      let priceslabel = "Live Prices"; 

      let btcprice = "BTC: $" + Math.floor(btc.data.price).toString();
      let ethprice = "ETH: $" + Math.floor(eth.data.price).toString();
      let bnbprice = "BNB: $" + Math.floor(bnb.data.price).toString();

      let labelpriceimage = textToImage.generateSync(priceslabel, {
        fontSize: 40,
        fontFamily: 'Verdana',
        lineHeight: 55,
        margin: 0,
        bgColor: 'black',
        textColor: '#B80000',
        maxWidth: 300,
        customHeight: 55,
        fontPath: './Carter_One/CarterOne-Regular.ttf'
      });

      let btcpriceimage = textToImage.generateSync(btcprice, {
        fontSize: 40,
        fontFamily: 'Verdana',
        lineHeight: 45,
        margin: 0,
        bgColor: 'black',
        textColor: 'white',
        maxWidth: 300,
        customHeight: 55,
        fontPath: './Carter_One/CarterOne-Regular.ttf'
      });      

      let ethpriceimage = textToImage.generateSync(ethprice, {
        fontSize: 40,
        fontFamily: 'Verdana',
        lineHeight: 55,
        margin: 0,
        bgColor: 'black',
        textColor: 'white',
        maxWidth: 300,
        customHeight: 55,
        fontPath: './Carter_One/CarterOne-Regular.ttf'
      });
      
      let bnbpriceimage = textToImage.generateSync(bnbprice, {
        fontSize: 40,
        fontFamily: 'Verdana',
        lineHeight: 55,
        margin: 0,
        bgColor: 'black',
        textColor: 'white',
        maxWidth: 300,
        customHeight: 55,
        fontPath: './Carter_One/CarterOne-Regular.ttf'
      });      

      let quotetoimage = textToImage.generateSync(quote, {
        fontSize: 40,
        fontFamily: 'Verdana',
        lineHeight: 55,
        margin: 0,
        bgColor: 'black',
        textColor: '#B80000',
        maxWidth: 1000,
        customHeight: 55*3,
        fontPath: './Carter_One/CarterOne-Regular.ttf'
      });

      let jimptext = null;

      jimptext = await jimp.read(Buffer.from(labelpriceimage.replace(/^data:image\/png;base64,/, ""), 'base64'));
      
      data[0].composite(jimptext, 1200, 10);

      jimptext = await jimp.read(Buffer.from(btcpriceimage.replace(/^data:image\/png;base64,/, ""), 'base64'));

      data[0].composite(jimptext, 1200, 70);

      jimptext = await jimp.read(Buffer.from(ethpriceimage.replace(/^data:image\/png;base64,/, ""), 'base64'));

      data[0].composite(jimptext, 1200, 130);

      jimptext = await jimp.read(Buffer.from(bnbpriceimage.replace(/^data:image\/png;base64,/, ""), 'base64'));

      data[0].composite(jimptext, 1200, 190);

      jimptext = await jimp.read(Buffer.from(quotetoimage.replace(/^data:image\/png;base64,/, ""), 'base64'));

      data[0].composite(jimptext, 20, 20);

      // composite the images on one another
      //data[0].composite(data[1], 1200, 30); //Your banner is 1500x500px, so change this pixels accordingly
      //data[0].composite(data[2], 1290, 30); //place the images wherever you want on the banner
      //data[0].composite(data[3], 1380, 30); //experiment with it or DM me on Twitter @Deveshb15 if you want any help

      // Write the image and save it
      data[0].write('1500x500.png', function () {
        console.log("done");
      })

    })();


  })

  // encode to base64 to post the image
  const base64 = await fs.readFileSync('1500x500.png', { encoding: 'base64' });
  // console.log(base64);

  // Update the banner
  await twitterClient.accountsAndUsers.accountUpdateProfileBanner({ banner: base64 });
}

async function start() {

  const name = Math.random();
  const params = {
    screen_name: TWITTER_HANDLE, //name of twitter account
    count: 3                     //number of followers to be fetched
  }
  // fetch followers
  const data = await twitterClient.accountsAndUsers.followersList(params);

  //push url of profile image to array
  data.users.forEach(item => {
    image_url.unshift(item.profile_image_url_https)
  });

  (async () => {
    //download the image
    //await download_image(image_url[0], `${name}-1.png`)
    //await download_image(image_url[1], `${name}-2.png`)
    //await download_image(image_url[2], `${name}-3.png`)

    //let perserve_name = name;

    /*await jimp.read(`${name}-1.png`, (err, image) => {
      if (err) reject(err)
      image.resize(100, 100)
           .quality(100)                 
           .write(__dirname + "./" + `${perserve_name}-1.png`); 
    });*/

    async function drawit() {
      lastDrawImage = Date.now();
      // Draw the image and Post it
      await drawImage('1500x500.png');
    }
    const remaining = Date.now() - lastDrawImage;

    // Avoid hitting rate limit when update banner
    // 30 requests per 15 mins meaning 1 request per 30 secs
    if (remaining > 30000) {
      await drawit();
    }

/*    async function deleteImages() {
      try {
        console.log('removing', `${name}{1,2,3}.png`);
        await fs.unlinkSync(`${name}-1.png`);
        await fs.unlinkSync(`${name}-2.png`);
        await fs.unlinkSync(`${name}-3.png`);
      } catch (e) {
        console.log(e);
      }
    }

    await deleteImages();*/

  })();
}

getquotes();

start();
setInterval(() => {
  start();
}, 60000);



function getquotes() {

  fetch("https://type.fit/api/quotes")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //console.log("quotes:",data);
      quotes = data;
    });
}


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}