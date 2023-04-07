const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

require("dotenv").config({path:'pk/.env'});
const mApiKey = process.env.apiKey
const mListId = process.env.listId 
const mApiServer = process.env.apiServer
const app = express();
// var YourVerySpecialKey = process.env.myApiKey;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req,res){
    var firstName =req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;

    var data = {
        members :[
            {
                email_address: email,
                status : "subscribed",
                merge_fields : {
                    FNAME : firstName,
                    LNAME : lastName
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data);
    const url =  "https://"+mApiServer+".api.mailchimp.com/3.0/lists/"+mListId
    const option = {
        method: "post",
        auth : "pk:"+mApiKey
    };
    
    const request = https.request(url, option, function(responce){
        if(responce.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
        } else{
            res.sendFile(__dirname+"/failure.html");
        }
        responce.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("server running on port 3000");
});

// 99a472249d52dee62239e2e60d68f25f-us21 api key
// d7f095f338   list id 