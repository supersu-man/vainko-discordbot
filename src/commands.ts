import { SlashCommandBuilder } from "discord.js";

const setupCommand = new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Setup vainko bot')

const commands = [ setupCommand ]

export { commands }