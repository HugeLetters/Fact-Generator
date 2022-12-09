import { createReadStream, readFileSync } from "fs";
import "dotenv/config"
const token = process.env.DISCORD_TOKEN
const headers = { "Authorization": `Bot ${token}` }

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
}

const filename = "asuka.png"
const filepath = "./source/" + filename;

let file = "data:image/png;base64," + readFileSync(filepath, "base64");
file = dataURItoBlob(file);

body = new FormData();
body.append("content", "ASUKA");
body.append("files[0]", file, filename)
console.log(body);
const r = await fetch(`https://discord.com/api/v10/channels/1048360803373432844/messages`, {
    method: 'POST',
    headers: {
        ...headers
    },
    body: body
}).then(x => x.json());
console.log(r);