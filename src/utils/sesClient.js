const { SESClient } = require("@aws-sdk/client-ses");
require('dotenv').config();
// Set the AWS Region.
const REGION = "ap-south-1";
// Create SES service object.
console.log("ACCESS", process.env.AWS_ACCESS_KEY_ID);
console.log("SECRET", process.env.AWS_SECRET_ACCESS_KEY);
const sesClient = new SESClient(
    { 
        region: REGION, 
        credentials: 
        { 
            accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY 
        } 
    }
);
module.exports = sesClient;