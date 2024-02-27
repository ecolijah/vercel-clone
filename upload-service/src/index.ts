//setup express app listening on oport 3000
import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generate } from "./utils";
// import { getAllFiles } from "./file";
import path from "path";
// import { uploadFile } from "./aws";
import { createClient } from "redis";

/* Initializes two Redis clients, publisher and subscriber, 
and connects them to the Redis server. These are used for 
publishing messages to channels and subscribing to them, 
respectively. */
const publisher = createClient();
publisher.connect();

const subscriber =  createClient();
subscriber.connect()

/* 
- Initialize an Express application instance to set up the server. 
- Apply CORS middleware to allow cross-origin requests, enhancing 
  API accessibility from different domains.
- Use express.json() middleware to automatically parse incoming request 
  bodies as JSON, facilitating data handling in API requests. 
*/

const app = express()
app.use(cors());
app.use(express.json());


app.post("/deploy", async (req, res) => {

    //req body contains the url of the repo coming from the client to be deployed
    const repoUrl = req.body.repoUrl;

    //generates a unique-id for the deployment
    const id = generate();

    //use simple-git to clone the repo into a temporary storage
    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));
});

app.listen(3000);

