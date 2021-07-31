const fetch = require('node-fetch');
const cheerio = require('cheerio')

async function getInfo(url)  {
  try {
    const response = await fetch(url);
    const $ = cheerio.load(await response.text());
    const jsonRaw = $("script[type='application/ld+json']")[0].children[0].data; 
    const {
      name,
      description,
      image,
      author: { name: authorName },
      keywords,
    } = JSON.parse(jsonRaw);

    return {
      name: (name || "").substring(0, 255),
      description: (description || "").substring(0, 255),
      image,
      authorName,
      keywords
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  getInfo,
};