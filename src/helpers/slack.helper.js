const { WebClient } = require('@slack/web-api');
const axios = require('axios');

function getWebClient(token){
  if (!token) return null;

  return new WebClient(token);
}

async function getUser(token, userId) {
  try {
    const client = getWebClient(token);
    if (!client) return null;

    const res = await client.users.info({ user: userId });

    if (res.ok){
      return res.user;
    }
  } catch (error) {
    console.log(error)
  }

  return null;
}

async function getTeam(token) {
  try {
    const client = getWebClient(token);
    if (!client) return null;

    const res = await client.team.info()  

    if (res.ok){
      return res.team;
    }
  } catch (error) {
    console.log(error)
  }
  return null;
}

async function isAdmin(token, userId) {
  const user = await getUser(token, userId);

  if (user != null){
    return user.is_admin;
  }

  return false;
}

module.exports = {
  getUser,
  getTeam,
  isAdmin,
  getWebClient
};
