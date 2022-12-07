import 'dotenv/config';
import WebSocket from 'ws';

const guild = process.env.GUILD_ID;
const app = process.env.APP_ID;
const token = process.env.DISCORD_TOKEN

const headers = { "Authorization": `Bot ${token}` }
const protocol = { http: "https", websocket: "wss" }

// let url = `${protocol.http}://discord.com/api/v10/applications/${app}/guilds/${guild}`
let url = `${protocol.http}://discord.com/api/v10/gateway/bot`

const response = await fetch(url, {
    method: 'GET',
    headers: headers
}).then(x => x.json());

url = response.url;
console.log(url);
const socket = new WebSocket(url);

socket.onopen = function(e) {
    console.log("[open] Connection established");
    socket.send("Hello from HugeLetters!!!");
  };

socket.onmessage = function(event) {
    let response=JSON.parse(event.data);
    // console.log(response);
    console.log(`[message] Data received from server: ${JSON.stringify(response)}`);
  };