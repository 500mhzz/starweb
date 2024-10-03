# StarWeb
Starweb is a simple WebUi that uses discord.js to get embeds from a channel and display it on the website with pagintation, its super fast too!

# ENV Setup
```env
TOKEN="Discord Bot Token"
CLIENT_ID="Discord Bot Client ID"
CHANNEL_ID="Main Starboard Channel ID"
DISCORD_GUILD_ID="Discord Guild ID"

MONGO_URI="MongoDB URI"
```

- TOKEN is the discord bot token used for commands and getting starboard posts.
- CLIENT_ID is the discord bot id used for internal stuff.
- CHANNEL_ID is used for the default channel when the user enters the website.
- DISCORD_GUILD_ID is the server to fetch the channels from.
- MONGO_URI used to store user preferances.

# NOTE:
Make sure to change the channel ids and names in the +page.svelte file!

# PREVIEW
![image](https://github.com/user-attachments/assets/888bfb29-50f6-479f-995b-4e5670ce82e8)
![image](https://github.com/user-attachments/assets/0407785c-1011-4b84-848b-0e3b8c242684)

