const express = require('express')
const google = require('googleapis')
const bodyParser = require('body-parser')
const cors = require('cors')
const crypto   = require('crypto')
const ejs = require('ejs')
const mailer = require('nodemailer')
const app = express()
app.set('view engine','ejs')
app.use(cors())
const CLIENTID ='385308947703-up1ac7losbv057ic12mdsug8prjhlpae.apps.googleusercontent.com'
const CLIENT_KEY ='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'
const REFRESH_TOKEN ='1//04cvda_5i6mV3CgYIARAAGAQSNwF-L9IrMLJX_PJck_AINTJLR2UhiU7PNDT8Pe3OaKk-tq1JdRUHLd99ajTvNwReCHBgOM4lWWg'
const REDERECT_URL='https://developers.google.com/oauthplayground'

const Oauth2client = new google.Auth.OAuth2Client(CLIENTID,CLIENT_KEY,REDERECT_URL)
Oauth2client.setCredentials({refresh_token: REFRESH_TOKEN})

app.use(bodyParser.urlencoded({extended:true}))

let userinfo = {
    name: null,
    email:null,
    password  : null,
    authCode:null
 }
 app.get('/',(req,res)=>{
    res.render('index')
 })

app.post("/userinfo",(req,res)=>{
const fullName = req.body.fullname
const email = req.body.email
const password = req.body.password
const code = crypto.randomBytes(5).toString('hex')
  userinfo.name = fullName
  userinfo.email = email,
  userinfo.password = password
  userinfo.authCode =code

useMail(userinfo);

res.send(`<p> Auth Code was sent to ${email} click <a href="./Response">here</a> to verify Email `)
 console.log(userinfo)
})


async function useMail(userinfo){
    const emailTxt = `Hello ${userinfo.name},<br><br>
    Your Auth Code is <strong>${userinfo.authCode}</strong>.<br><br>
    Use it to verify your email.`;
    
    const acesstoken =  await Oauth2client.getAccessToken()
  const transport=  mailer.createTransport(({
    service:'gmail',
    auth:{
        type:'OAuth2',
        user:'khumalothato56@gmail.com',
        clientId:CLIENTID,
        clientSecret:CLIENT_KEY,
        refreshToken:REFRESH_TOKEN,
        acessToken:acesstoken
    }
    }))

    transport.sendMail(({
        from:' Quiz App <khumalothato56@gmail.com>',
        to: `${userinfo.email}`,
        subject:'Email Verification',
     html:emailTxt
    }))
    .then((res)=>{
        console.log(res)
    })
}
app.get('/getData',(req,res)=>{
    res.json(userinfo)

})
app.get('/Response',(req,res)=>{
    res.render('response')

})

app.listen(3000,()=>{
console.log("server i s listening on 3000")
})