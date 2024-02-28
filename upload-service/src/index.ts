import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generate } from "./utils";
import { getAllFiles } from "./file";
import path from "path";
import { uploadFile } from "./aws";
import { createClient } from "redis";

/* Initializes two Redis clients, publisher and subscriber, 
and connects them to the Redis server. These are used for 
publishing messages to channels and subscribing to them, 
respectively. I am using this for redis-queue and status updates on deployments by their hashed id.*/
const publisher = createClient();
publisher.connect();

const subscriber =  createClient();
subscriber.connect()


//Initialize an Express application instance to set up the server. 
const app = express()

/*Apply CORS middleware to allow cross-origin requests, enhancing 
  API accessibility from different domains. */
app.use(cors());

/* Use express.json() middleware to automatically parse incoming request 
  bodies as JSON, facilitating data handling in API requests. */
app.use(express.json());

// expose an endpoint for the client to send their repoUrl.
app.post("/deploy", async (req, res) => {

    //req body contains the url of the repo coming from the client to be deployed
    const repoUrl = req.body.repoUrl;

    //generates a unique-id for the deployment
    const id = generate();

    //use simple-git to clone the repo into a temporary storage folder.
    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

    //gets complete filepath in the form of an array of strings.
    const allFiles = getAllFiles(path.join(__dirname,'output/${id}'));

    allFiles.forEach( async file => {
      await uploadFile(file.slice(__dirname.length+1), file)
    })

    await new Promise((resolve) => setTimeout(resolve, 5000))

    //push id of deployment to the queue.
    publisher.lPush("build-queue", id)

    //create a status for client side representation.
    publisher.hSet("status", id, "uploaded to s3.")

    //sends the generated id back to client side in response body.
    res.json({
      id: id
    })


});



// expose and endpoint for the client to request the status of their deployment.
app.get("/status", async (req, res) => {
  //get the id from the body of the req
  const id = req.body.id
  // retrive the status of the requested id.
  const response = await subscriber.hGet("status", id as string)
  //send status back in response json
  res.json({
    status: response
  })
})

app.listen(3000);

