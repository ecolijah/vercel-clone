import express from "express";
import { S3 } from "aws-sdk";


const app = express()
//global route catch
app.get("/*", async (req, res) => {
    const host = req.hostname;
    const id = host.split(".")[0];
})

app.listen(3001);

