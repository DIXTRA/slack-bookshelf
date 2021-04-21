const fetch = require('node-fetch');
const cheerio = require('cheerio')

async function getInfo(url)  {
  try {
    const response = await fetch(url);
    const $ = cheerio.load(await response.text());
    const jsonRaw = $("script[type='application/ld+json']")[0].children[0].data; 
    const json = JSON.parse(jsonRaw);
    return json;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  getInfo,
};