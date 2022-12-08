import { EmbedBuilder } from 'discord.js';
import fs from 'fs';

const formData = new FormData();
const filepath = "./source/Asuka_finger_point.png";
let file = fs.readFileSync(filepath);
formData.append("username", "Groucho");
formData.append("accountnum", 123456); // number 123456 is immediately converted to a string "123456"

// HTML file input, chosen by user
formData.append("userfile", new Blob([file],{type:"image/png"}));
formData.append('username','lol');
// JavaScript file-like object
const content = '<q id="a"><span id="b">hey!</span></q>'; // the body of the new file…
const blob = new Blob([content], { type: "text/xml"});
formData.append("webmasterfile", blob);

console.log("lol\nlol");

const channel = client.channels.cache.get('id');
const e= new EmbedBuilder();
e.setImage();
channel.send();