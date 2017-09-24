const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/',(req,res)=>{
  res.sendFile(__dirname+'/index.html');
});
app.post('/subscribe',(req,res)=>{
  if(
    req.body.captcha === undefined ||
    req.body.captcha === '' ||
    req.body.captcha === null
  ){
    return res.json({'success':false,'msg':'please select captcha'});
  }

  // secret key
  const secretKey = '6Lf54TEUAAAAAMfAZS7zrKUcfXRZnXHYg19PzbRn';

  // verify url
  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=
  ${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;
  // make request to verifyUrl
  request(verifyUrl,(err,response,body)=>{
    body = JSON.parse(body);
    console.log(body);
    // if not Successfull
    if(body.success !== undefined && !body.success){
      return res.json({'success':false,'msg':'Failed captcha Verification'});
    }
    // if Successfull
    return res.json({'success':true,'msg':'Captcha passed'});
  })
});
app.listen(3000 , ()=>{
  console.log('Server has just begun ');
});
