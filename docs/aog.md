# How to adapt BF to AoG

### Slides:
- basic concepts
- request / response and mic stop // ask() vs tell()
- voice bot vs chat bot
- diff with messenger bot and slack


### Adapt BF to AoG
1. Install `npm install --save botfuel-module-adapter-assistant`
2. Create `assistant-config.js` with this content:

```
module.exports = {
  adapter: {
    name: 'assistant',
  },
  modules: ['botfuel-module-adapter-assistant']
};
```

3. Create `action.json` with this content:

```
{
  "actions": [
    {
      "description": "Default Welcome Intent",
      "name": "MAIN",
      "fulfillment": {
        "conversationName": "botfuel-weather"
      },
      "intent": {
        "name": "actions.intent.MAIN",
        "trigger": {
          "queryPatterns": ["talk to Botfuel Weather"]
        }
      }
    }
  ],
  "conversations": {
    "botfuel-weather": {
      "name": "botfuel-weather",
      "url": "https://<SERVER>/webhook"
    }
  },
  "locale": "en"
}

```

4. In weather-view.js, change this:

```
messages.push(new BotTextMessage(askInfo(entityName)));
```

with this:

```
messages.push(new BotTextMessage(askInfo(entityName), {
    question: true,
}));
```

5. In weather-view.js, change this:

```
messages.push(
    new BotImageMessage(WebAdapter.getStaticUrl(`images/${images[description]`)),
);
```

with this:

```
messages.push(
    new BotImageMessage(WebAdapter.getStaticUrl(`images/${images[description]`), {
        accessibility_text: description,
        title: description,
    }),
);
```

### Deploy BF to AoG:

1. Create a new project called `botfuel-weather` at [console.actions.google.com](https://console.actions.google.com/) 
2. Name your Action `Botfuel Weather`
3. Run `gactions update --action_package action.json --project botfuel-weather`

### Try it:

1. Start the BF server:

```
BOTFUEL_APP_TOKEN=xxxxx  \
BOTFUEL_APP_ID=xxxxxxxx  \
BOTFUEL_APP_KEY=xxxxxxxx \
WEATHER_API_KEY=xxxxxxxx \
npm start npm start assistant-config.js
```

> replace `xxx` with your own API keys

2. [Install](https://ngrok.com/download) then run the ngrok proxy on port 5000: `ngrok http 5000`
3. Update `<SERVER>` placeholder in `action.json` with the ngrok generated URL. This looks like `xxxx.ngrok.io`
4. Redploy the AoG config: 

```
gactions update --action_package action.json --project botfuel-weather
```

5. Invoke your Action using: `talk to Botfuel Weather` (as specified in `action.json`)

### Deploy BF to Google Cloud Functions

@todo
