const wppconnect = require('@wppconnect-team/wppconnect');
require('dotenv').config();

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    organization: process.env.OPEN_API_ORG,
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
async function chat(data){
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": data}]
      });
      return completion.data.choices[0].message.content;
      console.log(completion.data.choices[0].message.content);
    }

    async function image(data){
        const completion = await openai.createImage({
            "prompt": data,
            "n": 1,
            "size": "1024x1024"
          });
          return completion.data.data[0].url;
          console.log(completion.data.choices[0].message.content);
        }

wppconnect
  .create()
  .then((client) => start(client))
  .catch((error) => console.log(error));

async function start(client) {
  client.onMessage((message) => {
    var index = message.body.indexOf(" ")
    if (message.body.slice(0,5) === '.chat') {
        if(message.body.substr(index + 1).length > 1 && message.body.substr(index + 1)!=".chat"){

        client.sendText(message.from,"Got it !!Generating!!")
        chat(message.body.substr(index + 1)).then(x=>{
            client
        .sendText(message.from, x)
        .then((result) => {
          console.log('Result: ', result); //return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error
        });
        })

    }
    else{
        client.sendText(message.from, 'Please Enter message after .chat')

    }
}
else if (message.body.slice(0,6) === '.image') {
    if(message.body.substr(index + 1).length > 1 && message.body.substr(index + 1)!=".image"){

    client.sendText(message.from,"Got it !!Generating!!")
    image(message.body.substr(index + 1)).then(x=>{
        client
        .sendImage(message.from, x)
        .then((result) => {
          console.log('Result: ', result); //return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error
        });
        console.log(x);
    })

}
else{
    client.sendText(message.from, 'Please Enter message after .chat')

}
}


    
  });
}