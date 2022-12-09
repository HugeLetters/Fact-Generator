import 'dotenv/config';
import WebSocket from 'ws';
import { readdirSync, readFileSync } from 'fs';
import { dataURItoBlob, randomChoiceArray, randomInteger } from "./utils.js"

const guild = process.env.GUILD_ID;
const app = process.env.APP_ID;
const token = process.env.DISCORD_TOKEN

const headers = { "Authorization": `Bot ${token}` }
const protocol = { http: "https", websocket: "wss" }
let url;
//url = {http:`${protocol.http}://discord.com/api/v10/applications/${app}/guilds/${guild}`}
url = { http: `${protocol.http}://discord.com/api/v10` }

const response = await fetch(url.http + "/gateway/bot", {
    method: 'GET',
    headers: headers
}).then(x => x.json());

url.ws = response.url;
let hb_interval;
let lastSkylexmessage = 0;
console.log(url.ws);
let auth = false;
let last_seq = null;
const socket = new WebSocket(url.ws + "/?v=10");
const heartbeat = (s, d = null) => {
    s.send(JSON.stringify({
        "op": 1,
        "d": d,
    }));
}

socket.onmessage = async function (event) {
    console.log('----------------------------------------------------------------------------------------')
    console.log(`[${event.type}] Data received from server: ${event.data}`);
    const data = JSON.parse(event.data);
    last_seq = data.s != null ? data.s : last_seq;
    // handshake
    if (data.op == 10) {
        console.log("Responding to handshake");
        hb_interval = data.d.heartbeat_interval;
        setTimeout(() => (heartbeat(socket, last_seq)), hb_interval * Math.random() / 10)
    };
    //auth
    if (!auth & data.op == 11) {
        console.log("Trying to authenticate");
        const msg = {
            "op": 2,
            "d": {
                "token": token,
                "properties": {
                    "os": "windows",
                    "browser": "chrome",
                    "device": "laptop"
                },
                "intents": (1 << 9) | (1 << 8) | (1 << 1) | (1 << 15) | (1 << 11),
            }
        };
        socket.send(JSON.stringify(msg));
        console.log(`New heartbeat queued in: ${hb_interval}ms`);
        setTimeout(() => (heartbeat(socket, last_seq)), hb_interval);
    };
    if (data.op == 0 & data.t == "READY") {
        console.log("Authenticated");
        auth = true
    };
    // SKYLEX печатает
    if (auth & lastSkylexmessage == 0
        // & data.t == "TYPING_START" & data.d.member.user.id == "214013992052588545" & (Date().getTime() - lastSkylexmessage) > 10800000
    ) {
        lastSkylexmessage = new Date().getTime();

        const files = readdirSync('source/');
        const filename = randomChoiceArray(files);
        const filepath = "./source/" + filename;
        let file = "data:image/png;base64," + readFileSync(filepath, "base64");
        file = dataURItoBlob(file);

        let body = new FormData();
        body.append("content", `${"Эй, ".repeat(randomInteger(0,1))}${"кто-то" || data.d.member.user.username} печатает${"!".repeat(randomInteger(1, 5))}`);
        body.append("files[0]", file, filename);

        fetch(`${url.http}/channels/${"1048360803373432844" || data.d.channel_id}/messages`, {
            method: 'POST',
            headers: headers,
            body: body
        });
    }
    // NEW MESSAGE
    if (data.t == "MESSAGE_CREATE") {
        console.log(`New message on server: ${data.d.content}`)
    }
    // heartbeat
    if (auth & data.op == 11) {
        console.log(`New heartbeat queued in: ${hb_interval}ms`);
        setTimeout(() => (heartbeat(socket, last_seq)), hb_interval);
    }
};

socket.addEventListener("open", (event) => (console.log(`[${event.type}] Connection established: ${event}`)));
socket.addEventListener("error", (event) => (console.log(`[${event.type}] Error: ${event}`)));
socket.addEventListener("close", (event) => (console.log(`[${event.type}] Connection closed: ${event.code}, ${event.reason}`)));