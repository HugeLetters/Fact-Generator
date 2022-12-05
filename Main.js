import 'dotenv/config';

const guild = process.env.GUILD_ID;
const app = process.env.APP_ID;
const token = process.env.DISCORD_TOKEN

const headers = { "Authorization": `Bot ${token}` }
const url = `https://discord.com/api/v10/applications/${app}/guilds/${guild}/commands`

fetch(url, {
    method: 'GET',
    headers: headers,
    // body: ''
})
    .then(response => response.json())
    .then(response => console.log(JSON.stringify(response)))