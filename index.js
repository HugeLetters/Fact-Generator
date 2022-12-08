import 'dotenv/config';
import WebSocket from 'ws';
import fs from 'fs';
import imageToBase64 from 'image-to-base64';
import { readFile } from 'fs/promises';

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
    // send message
    if (lastSkylexmessage == 0 & auth
        // auth & data.t == "TYPING_START" & data.d.member.user.id == "214013992052588545" & (Date().getTime() - lastSkylexmessage) > 10800000
    ) {
        lastSkylexmessage = new Date().getTime();
        const filepath = "./source/Asuka_finger_point.png";
        let file = await readFile(filepath, "binary");
        file = new Buffer(file, 'binary').toString('binary');
        let boundary = "ndbszgbdtyrhsgrzs";
        let body = `--${boundary}
Content-Disposition: form-data; name="payload_json"
Content-Type: application/json

{
  "content": "Hello, World!",
  "attachments": [{
      "id": 0,
      "description": "Asuka",
      "filename": "asuka.png"
  }]
}
--${boundary}
Content-Disposition: form-data; name="files[0]"; filename="asuka.png"
Content-Type: image/png

${file}
--${boundary}--`;

        // const r = await fetch(`${url.http}/channels/${data.d.channel_id}/messages`, {
        const r = await fetch(`${url.http}/channels/1048360803373432844/messages`, {
            method: 'POST',
            headers: {
                ...headers, ...{ "Content-Type": `multipart/form-data; boundary=${boundary}` }
            },
            body: body
        }).then(x => x.json());
        console.log(r);
        socket.close(1000);
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