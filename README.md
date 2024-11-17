# Vainko - Discord Bot

This bot creates temporary voice channels, which helps keep voice channel clutter to a minimum, especially in large Discord servers. 

It automatically generates a new voice channel and seamlessly moves the user to this newly created channel. Once the user leaves, the voice channel is promptly deleted.

## Instructions

#### Configuration
- Create .env file with `DISCORD_TOKEN` and `DISCORD_CLIENT_ID`
- Make neessary changes to src/config.ts (optional)

#### Development
- Use `npm install` to install all the dependencies
- Use `npm run dev` to run the bot

#### Production
- Use `npm install` to install the dependencies
- Use `npm run build` to build
- Use `npm run start` to run the bot

#### Docker
- Use `docker compose up --build -d` to build and run docker container