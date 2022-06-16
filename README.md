# Vainko - Discord Bot

Creates temporary voice channels.

Very helpful to keep the clutter of voice channels away, like in huge discord servers.

Automatically creates a new voice channel and moves the user to that newly created channel.
And deletes the empty voice channels when left.

## Instructions

#### Run on your machine
- Clone the repository 
- Open the project in an IDE (VS Code)
- Create a file called `.env` in project
- Add `token='your_token_here'` line to `.env` file
- Use `npm i` to install all the dependencies
- Use `npm run start` to run the bot

#### Host on Heroku (using actions)
- Fork the repository and clone the fork
- Open the project in an IDE (VS Code)
- Create a file called `.env` in project
- Add `token='your__discord_bot_token_here'` to `.env` file
- Create an app in Heroku
- Add `token` var to your Heroku app with your Discord bot token
- Add `HEROKU_API_KEY`, `HEROKU_APP_NAME` and `HEROKU_EMAIL` in GitHub secrets
- Make a commit and push, GitHub takes care of the rest.