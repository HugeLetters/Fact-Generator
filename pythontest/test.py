import requests


url = "https://discord.com/api/v10/applications/1048348518303137792/guilds/1048360802815574016/commands"

print(url)
# This is an example CHAT_INPUT or Slash Command, with a type of 1
json = {
    "name": "blep",
    "type": 1,
    "description": "Send a random adorable animal photo",
    "options": [
        {
            "name": "animal",
            "description": "The type of animal",
            "type": 3,
            "required": True,
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
            "required": False
        }
    ]
}

# For authorization, you can use either your bot token
headers = {
    "Authorization": "Bot MTA0ODM0ODUxODMwMzEzNzc5Mg.GeXHW_.Q-Z_GI7AxsREwXufPByaQ63EJGsG8olmsO6W3k"
}

# or a client credentials token for your app with the applications.commands.update scope
# headers = {"Authorization": "Bearer 0b710072835ac86c96e2c35086b36a97d8e3d5e0bec825f4bd0b89c6d92cf099"}

r = requests.get(url, headers=headers)

print(r.json())

for i in r.json():
    print(i["id"])
    requests.delete(url+"/"+i["id"], headers=headers)