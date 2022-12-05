import 'dotenv/config';

const guild = process.env.GUILD_ID;
const app = process.env.APP_ID;
const token = process.env.DISCORD_TOKEN

const headers = { "Authorization": `Bot ${token}` }
const url = `https://discord.com/api/v10/applications/${app}/guilds/${guild}/commands`

const json = {
    "name": "blep",
    "type": 1,
    "description": "Send a random adorable animal photo",
    "options": [
        {
            "name": "animal",
            "description": "The type of animal",
            "type": 3,
            "required": true,
            "choices": [
                {
                    "name": "Dog",
                    "value": "animal_dog"
                },
                {
                    "name": "Cat",
                    "value": "animal_cat"
                },
                {
                    "name": "Penguin",
                    "value": "animal_penguin"
                }
            ]
        },
        {
            "name": "only_smol",
            "description": "Whether to show only baby animals",
            "type": 5,
            "required": false
        }
    ]
}

const response = fetch(url, {
    method: 'GET',
    headers: { ...headers, ...{ "Content-Type": 'application/json' } },
    // body:JSON.stringify(json),
}).then(x => x.json());

response.then(response => console.log(JSON.stringify(response)));