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

const {
  PromptView,
  BotTextMessage,
  BotImageMessage,
  QuickrepliesMessage,
  WebAdapter,
} = require('botfuel-dialog');

const makeInfo = (entities) => {
  const location = entities.location && entities.location.values[0].value;
  const date = entities.date && new Date(entities.date.values[0].milliseconds);

  return `Ok. I can give you the information about the forecast ${
    location ? `in ${location}` : ''
  }${date ? ` on ${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}` : ''}`;
};

const askInfo = (entityName) => {
  switch (entityName) {
    case 'location':
      return 'In which city?';
    case 'date':
      return 'When?';
    default:
      return '';
  }
};

const images = {
  'Clear': 'clair.jpg',
  'Moderate rain': 'pluie.jpg',
  'Pluie modérée par moments': 'pluie.jpg',
  'Moderate rain at times': 'pluie.jpg',
  'Heavy rain': 'pluie.jpg',
  'Patchy rain possible': 'pluie.jpg',
  'Light freezing rain': 'pluie-legere.jpg',
  'Light rain': 'pluie-legere.jpg',
  'Patchy light rain': 'pluie-legere.jpg',
  'Sunny': 'ensoleille.jpg',
  'Cloudy': 'nuageux.jpg',
  'Mist': 'brume.jpg',
  'Patchy sleet possible': 'neige.jpg',
  'Patchy snow possible': 'neige.jpg',
  'Blizzard': 'neige.jpg',
  'Blowing snow': 'neige.jpg',
  'Partly cloudy': 'partiellement-nuageux.jpg',
  'Overcast': 'couvert.jpg',
  'Thundery outbreaks possible': 'foyers.jpg',
  'Fog': 'brouillard.jpg',
  'Freezing fog': 'brouillard.jpg',
  'Patchy freezing drizzle possible': 'bruine.jpg',
  'Patchy light drizzle': 'bruine.jpg',
  'Light drizzle': 'bruine.jpg',
  'Freezing drizzle': 'bruine.jpg',
  'Heavy freezing drizzle': 'bruine.jpg',
};

class WeatherView extends PromptView {
  render(userMessage, { matchedEntities, missingEntities, weatherData }) {
    const messages = [];
    const location = matchedEntities.location && matchedEntities.location.values[0].value;
    const date = matchedEntities.date && new Date(matchedEntities.date.values[0].milliseconds);

    // Print info of obtained information
    if (Object.keys(matchedEntities).length !== 0 && missingEntities.size !== 0) {
      messages.push(new BotTextMessage(makeInfo(matchedEntities)));
    }

    // Ask for any missing information
    if (missingEntities.size !== 0) {
      const entityName = missingEntities.keys().next().value;
      messages.push(new BotTextMessage(askInfo(entityName), {
        question: true,
      }));
      if (entityName === 'date') {
        messages.push(new QuickrepliesMessage(["Today", 'Tomorrow', 'in 7 days']));
      }
    }

    if (missingEntities.size === 0) {
      if (date - Date.now() > 15 * 86400000) {
        messages.push(new BotTextMessage("Sorry, we don't have any data for this date"));
      } else {
        messages.push(
          new BotTextMessage(
            `Here is the weather for ${location} on ${date.getDate()}-${date.getMonth() +
              1}-${date.getFullYear()}.`,
          ),
        );
        const maxTemp = weatherData.weather[0].maxtempC;
        const minTemp = weatherData.weather[0].mintempC;
        const description = weatherData.weather[0].hourly[0].weatherDesc[0].value;
        messages.push(new BotTextMessage(`${description}, ${minTemp} - ${maxTemp} degrés Celsius`));
        if (Object.keys(images).includes(description)) {
          messages.push(
            new BotImageMessage(WebAdapter.getStaticUrl(`images/${images[description]}`), {
              accessibility_text: description,
              title: description,
            }),
          );
        }
      }
    }

    return messages;
  }
}

module.exports = WeatherView;
