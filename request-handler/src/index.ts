import express from "express";
import { S3 } from "aws-sdk";
require("dotenv").config()

const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
})

const app = express();

app.get("/*", async (req, res) => {

    const host = req.hostname; //erasd.vercel.com
    const id = host.split(".")[0]; //erasd

    //resource the client is requesting
    const filePath = req.path; //index.html

    const contents = await s3.getObject({
        Bucket: "my-vercel-clone-bucket",
        Key: `dist/${id}${filePath}`
    }).promise();
    
    //header for https request
    const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript"
    res.set("Content-Type", type);

    res.send(contents.Body);
})

app.listen(3001);