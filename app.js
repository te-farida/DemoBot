const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 5000;
const sessionId = uuid.v4();

app.use(function (req, res, next) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(bodyParser.urlencoded({
  extented: false
}))

app.get('/send-msg',(req,res)=>{
  res.sendFile(path.join(__dirname+'/index.html'))
})


app.post('/send-msg',(req,res)=>{
   runSample(req.body.MSG).then(data=>{
     res.send({Reply:data})
   })
})

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
async function runSample(msg,projectId = 'apiexample-xbgk') {
  // A unique identifier for the given session
  

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient({
      keyFilename: "C:/Users/farid/Desktop/JavaScript/apiexample-xbgk-bc2f2d1daef0.json"
  });
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: msg,
        // The language used by the client (en-US)
        languageCode: 'en-US',
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
  return result.fulfillmentText;
}

app.listen(port,()=>{
  console.log("Running on port "+port)
})