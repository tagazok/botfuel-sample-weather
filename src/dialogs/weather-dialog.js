/**
 * Copyright (c) 2017 - present, Botfuel (https://www.botfuel.io).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


const { PromptDialog } = require('botfuel-dialog');
const { Logger } = require('botfuel-dialog');
const fetch = require('node-fetch');

const logger = Logger('WeatherDialog');

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

class WeatherDialog extends PromptDialog {
  async dialogWillDisplay(userMessage, { matchedEntities, missingEntities }) {
    if (missingEntities.size === 0) {
      const date = matchedEntities.date && new Date(matchedEntities.date.values[0].milliseconds);
      const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      const location = matchedEntities.location && matchedEntities.location.values[0].value;

      const response = await fetch(`http://api.worldweatheronline.com/premium/v1/weather.ashx?key=9b7a7201fbf64c56ace100508181008&q=${location}&format=json&date=${formattedDate}`);      
      const data = await response.json();
      const weatherData = data.data;

      return { weatherData };
    }

    return null;
  }
}

WeatherDialog.params = {
  namespace: 'weather',
  entities: {
    location: {
      dim: 'city',
      priority: 10,
    },
    date: {
      dim: 'time',
    },
  },
};

module.exports = WeatherDialog;
