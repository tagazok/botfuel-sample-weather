/**
 *
 * WARNING: This is a workaround to make the Botfuel server work in a Serverless environement!
 *
 *
 * Copyright 2018 Wassim Chegham (MIT License)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

require('babel-polyfill');
require('dotenv').config();

const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: true }));

const { Bot } = require('botfuel-dialog');
const config = {
  logger: 'debug',
  adapter: {
    name: 'google-assistant'
  },
  modules: ['botfuel-module-adapter-assistant']
};
app.post('/webhook', async (req, res, next) => {
  return await new Bot(config).run();
});

// app.post('/webhook', async (req, res, next) => {
//   res.send(':)');
// });

module.exports.botfuel = functions.https.onRequest(app);
