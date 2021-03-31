const { WebClient, User } = require('@slack/web-api');

function getWebClient(token){
  if (token == null)
    token = "xoxb-1842660681846-1844217122567-Qq6SvfT1uD0SAfd0z2Ho3Non"; // Obtener el token desde la base de datos a partir del teamId
  return new WebClient(token);
}

async function getUser(token, userId) {
  try {
    const res = await getWebClient(token).users.info({user: userId})  
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
    const res = await getWebClient(token).team.info()  
    if (res.ok){
      return res.team;
    }
  } catch (error) {
    console.log(error)
  }
  return null;
}

async function isAdmin(token, userId) {
  const user = await getUser(token, userId)
  if (user != null){
    return user.is_admin;
  }
  return false;
}

module.exports = {
  getUser,
  getTeam,
  isAdmin
};
