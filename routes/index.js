var express = require('express');
const puppeteer = require('puppeteer');
var router = express.Router();

const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });
const s3 = new AWS.S3();

/* GET home page. */
router.post('/pictures', function(req, res, next) {
  console.log("sprawdzamy body");
  console.log(req.body);
  let data = req.body;
  console.log("data");
  console.log(data);
     myF(data);
      res.send("Przetwarzanie danych")
});


async function myF(data) {

  console.log("jesteśmy w funkcji do tworzenia zdjęć headless")
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  let part;
  if(data.englishExample) {
    const modifyExample = data.englishExample.replace(/\?/, '').replace(/,/g, '').toLowerCase();
    console.log("jesteśmy w polishExample");
    part = "examples";
    if(data.story) {
      await page.goto('http://localhost:4000/pose_9_1.html');
      await page.$eval('.polish-text', (el, data) => {el.innerHTML= data.polishExample }, data);
      await page.$eval('.english-text', (el, data) => {el.innerHTML= data.englishExample }, data);
      await page.$eval('.info', (el, data) => {el.innerHTML= data.story }, data);
      // if(data.story.length > 120) {
      //   await page.evaluate(() => { document.querySelector('img').style.height = '750px'; });
      // } else if(data.story > 80) {
      //   await page.evaluate(() => { document.querySelector('img').style.height = '800px'; });
      // } else if (data.story > 40) {
      //   await page.evaluate(() => { document.querySelector('img').style.height = '850px'; });
      // } else {
      //   await page.evaluate(() => { document.querySelector('img').style.height = '900px'; });
      // }
      await page.screenshot({path: `public/pictures/${data.category}/${data.name}/example-${modifyExample}.png`, fullPage: true});
      await page.$eval('.report', el => el.innerHTML = "Dzięki za info! ");
      await page.screenshot({path: `public/pictures/${data.category}/${data.name}/report_example-${modifyExample}.png`, fullPage: true});
      // screen dla błędnej odpowiedzi
      await page.goto('http://localhost:4000/pose_4_1.html');
      await page.$eval('.polish-text', (el, data) => {el.innerHTML= data.polishExample }, data);
      await page.$eval('.english-text', (el, data) => {el.innerHTML= data.englishExample }, data);
      await page.$eval('.info', (el, data) => {el.innerHTML= data.story }, data);
      // if(data.story.length > 120) {
      //   await page.evaluate(() => { document.querySelector('img').style.height = '750px'; });
      // } else if(data.story > 80) {
      //   await page.evaluate(() => { document.querySelector('img').style.height = '800px'; });
      // } else if (data.story > 40) {
      //   await page.evaluate(() => { document.querySelector('img').style.height = '850px'; });
      // } else {
      //   await page.evaluate(() => { document.querySelector('img').style.height = '900px'; });
      // }
      await page.screenshot({path: `public/pictures/${data.category}/${data.name}/fallback_word-${modifyExample}.png`, fullPage: true});
      // let buffer = await page.screenshot({encoding: "base64"});
      // savePictureToS3(data, buffer, part)

    } else {
      await page.goto('http://localhost:4000/pose_2_1.html');
      await page.$eval('.polish-text', (el, data) => {el.innerHTML= data.polishExample}, data);
      await page.$eval('.english-text', (el, data) => {el.innerHTML= data.englishExample}, data);
      await page.screenshot({path: `public/pictures/${data.category}/${data.name}/example-${modifyExample}.png`, fullPage: true});
      await page.$eval('.report', el => el.innerHTML = "Dzięki za info!");
      await page.screenshot({path: `public/pictures/${data.category}/${data.name}/report_example-${modifyExample}.png`, fullPage: true});
      // dla błędnej odpowiedzi
      await page.goto('http://localhost:4000/pose_4_1.html');
      await page.$eval('.polish-text', (el, data) => {el.innerHTML= data.polishExample}, data);
      await page.$eval('.english-text', (el, data) => {el.innerHTML= data.englishExample}, data);
      await page.screenshot({path: `public/pictures/${data.category}/${data.name}/fallback_example-${modifyExample}.png`, fullPage: true});
      // let buffer = await page.screenshot({encoding: "base64"});
      // savePictureToS3(data, buffer, part)
    }

  } else if(data.englishSentence) {
      const modifySentence = data.englishSentence.replace(/\?/, '').replace(/,/g, '').toLowerCase();
      await page.goto('http://localhost:4000/pose_2_1.html');
      part = "sentences";
      await page.$eval('.polish-text', (el, data) => {el.innerHTML= data.polishSentence}, data);
      await page.$eval('.english-text', (el, data) => {el.innerHTML= data.englishSentence}, data);
      await page.screenshot({path: `public/pictures/${data.category}/${data.name}/sentence-${modifySentence}.png`, fullPage: true});
      await page.$eval('.report', el => el.innerHTML = "Dzięki za info!");
      await page.screenshot({path: `public/pictures/${data.category}/${data.name}/report_sentence-${modifySentence}.png`, fullPage: true});
      // dla błędnej odpowidzi
      await page.goto('http://localhost:4000/pose_4_1.html');
      await page.$eval('.polish-text', (el, data) => {el.innerHTML= data.polishSentence}, data);
      await page.$eval('.english-text', (el, data) => {el.innerHTML= data.englishSentence}, data);
      await page.screenshot({path: `public/pictures/${data.category}/${data.name}/fallback_sentence-${modifySentence}.png`, fullPage: true});
      // let buffer = page.screenshot({path: `public/pictures/${data.category}/${data.name}/word-${data.word}_sentence-${data.sentence}_phrase-${data.phrase}.png`, fullPage: true});
      // let buffer = await page.screenshot({encoding: "base64"});
      // savePictureToS3 (data, buffer, part)
  } else if(data.englishChallenge) {
    console.log("jesteśmy w data.challenge");
    const modifyChallenge = data.englishChallenge.replace(/\?/, '').replace(/,/g, '').toLowerCase();
    console.log(data.category);
    await page.goto('http://localhost:4000/pose_1_2.html');
    await page.$eval('.polish-text', (el, data) => {el.innerHTML = data.polishChallenge}, data);
    await page.screenshot({path: `public/pictures/${data.category}/challenges/challenge-${modifyChallenge}.png`, fullPage: true});
    await page.$eval('.report', el => el.innerHTML = "Dzięki za info!");
    await page.screenshot({path: `public/pictures/${data.category}/challenges/report_challenge-${modifyChallenge}.png`, fullPage: true});

  } else if (data.userRole && data.alexaPointer) {
    console.log("jesteśmy w data.alexaPointer")
    const modifyUserRole = data.userRole.replace(/\?/, '').replace(/,/g, '').toLowerCase();
    await page.goto('http://localhost:4000/pose_7.html');
    await page.$eval('.alexa-role', (el, data) => {el.innerHTML = data.alexaRole}, data);
    await page.$eval('.translated-alexa-role', (el, data) => {el.innerHTML = data.translatedAlexaRole}, data);
    await page.$eval('.user-role', (el, data) => {el.innerHTML = data.userRole}, data);
    await page.$eval('.translated-user-role', (el, data) => {el.innerHTML = data.translatedUserRole}, data);
    await page.screenshot({path: `public/pictures/${data.category}/${data.name}/chat-${modifyUserRole}.png`, fullPage: true});
    await page.$eval('.report', el => el.innerHTML = "Dzięki za info!");
    await page.screenshot({path: `public/pictures/${data.category}/${data.name}/report_chat-${modifyUserRole}.png`, fullPage: true});
  } else if (data.userRole && data.userPointer) {
    console.log("jesteśmy w data.userPointer")
    const modifyUserRole = data.userRole.replace(/\?/, '').replace(/,/g, '').toLowerCase();
    await page.goto('http://localhost:4000/pose_8.html');
    await page.$eval('.alexa-role', (el, data) => {el.innerHTML = data.alexaRole}, data);
    await page.$eval('.translated-alexa-role', (el, data) => {el.innerHTML = data.translatedAlexaRole}, data);
    await page.$eval('.user-role', (el, data) => {el.innerHTML = data.userRole}, data);
    await page.$eval('.translated-user-role', (el, data) => {el.innerHTML = data.translatedUserRole}, data);
    await page.screenshot({path: `public/pictures/${data.category}/${data.name}/chat-${modifyUserRole}.png`, fullPage: true});
    await page.$eval('.report', el => el.innerHTML = "Dzięki za info!");
    await page.screenshot({path: `public/pictures/${data.category}/${data.name}/report_chat-${modifyUserRole}.png`, fullPage: true});
  } else if(data.finishLesson) {
    await page.goto('http://localhost:4000/pose_6_1.html');
    await page.screenshot({path: `public/pictures/${data.category}/finish/finish_lesson.png`, fullPage: true});
  } else if(data.finishChallenge) {
    await page.goto('http://localhost:4000/pose_6_2.html');
    await page.screenshot({path: `public/pictures/${data.category}/finish/finish_challenge.png`, fullPage: true});
  } else if(data.monthlyChallenge) {
    await page.goto('http://localhost:4000/pose_6_1_1.html');
    await page.screenshot({path: `public/pictures/${data.category}/finish/finish_monthlyChallenge.png`, fullPage: true});
  } else if(data.pairsQuestion) {
    await page.goto('http://localhost:4000/pose_2_1_1.html');
    await page.screenshot({path: `public/pictures/${data.category}/finish/finish_pairsQuestion.png`, fullPage: true});
  } else if(data.pairsConfirmation) {
    await page.goto('http://localhost:4000/pose_6_2_1.html');
    await page.screenshot({path: `public/pictures/${data.category}/finish/finish_pairsConfirmation.png`, fullPage: true});
  }
  await browser.close();
}

// async function myF(data) {
//
//   console.log("jesteśmy w funkcji do tworzenia zdjęć headless")
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();
//   await page.setViewport({ width: 1920, height: 1080 });
//   let part;
//    if (data.userRole) {
//     console.log("jesteśmy w data.alexaRole")
//     const modifyUserRole = data.userRole.replace(/\?/, '').replace(/,/g, '').toLowerCase();
//     await page.goto('http://localhost:4000/pose_7.html');
//     await page.$eval('.alexa-role', (el, data) => {el.innerHTML = data.alexaRole}, data);
//     await page.$eval('.translated-alexa-role', (el, data) => {el.innerHTML = data.translatedAlexaRole}, data);
//     await page.$eval('.user-role', (el, data) => {el.innerHTML = data.userRole}, data);
//     await page.$eval('.translated-user-role', (el, data) => {el.innerHTML = data.translatedUserRole}, data);
//     await page.screenshot({path: `public/pictures/${data.category}/${data.name}/chat-${modifyUserRole}.png`, fullPage: true});
//   }
//   await browser.close();
// }


async function savePictureToS3 (data, buffer, part) {
  let filename;
  switch(part) {
  case "examples":
  filename = `pictures/${data.category}/${data.name}/word-${data.word}_example-${data.example}.png`;
    break;
  case "sentences":
  filename = `pictures/${data.category}/${data.name}/word-${data.word}_sentence-${data.sentence}_phrase-${data.phrase}.png`;
    break;
  default:
  console.log("no filename matched");
}
  let s3bucket = 'english-project';
  console.log(`Uploading screenshot 's3://${s3bucket}/${filename}'`);
  const s3Params = {
      Bucket: s3bucket,
      Key: filename,
      Body: buffer
  };
  await s3.putObject(s3Params, (err, data) => {
      if (err) {
          console.log(err);
      } else {
          console.log("uploading succeeded");
      }
  }).promise();
  console.log("uploading completed");

}



module.exports = router;
