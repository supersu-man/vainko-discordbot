import { VoiceState, Client, REST, Routes, Events, ChannelType } from "discord.js";
import { commands } from "./commands";
import dotenv from 'dotenv';
import { categoryName, channels } from "./config";
dotenv.config();

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN as string);

const client = new Client({
	intents: [ "Guilds", "GuildVoiceStates" ]
})

client.once(Events.ClientReady, () => {
	console.log('Bot is Ready!')
})

client.on(Events.InteractionCreate, (interaction) => {
    if (!interaction.isCommand()) return
	if (interaction.commandName == "setup") {
		let ch = interaction.guild?.channels.cache.some(ch => ch.name == categoryName && ch.type == ChannelType.GuildCategory)
		if(ch) return 
		interaction.guild?.channels.create({
			name: categoryName,
			type: ChannelType.GuildCategory
		}).then((category) => {
			channels.forEach((channel) => {
				interaction.guild?.channels.create({
					name: channel.title,
					parent: category.id,
					type: ChannelType.GuildVoice,
					userLimit: channel.userLimit
				});
			})
		})
		
		interaction.reply('Setting up the bot')
	}
})

client.on(Events.VoiceStateUpdate, (oldState: VoiceState, newState: VoiceState) => {
	if (newState.channel?.name) {
		const channelIndex = channels.findIndex(channel => channel.title == newState.channel?.name)
		if(channelIndex == -1) return
		moveUser(newState, channels[channelIndex].newTitle, channels[channelIndex].userLimit)
	}

	if (oldState.channel?.name) {
		const channelIndex = channels.findIndex(channel => channel.newTitle == oldState.channel?.name)
		if (channelIndex == -1 && oldState.channel?.members.size == 0) return
		oldState.channel?.delete()
	}
})

function moveUser(newState: VoiceState, newName: string, userLimit: number) {
	newState.channel?.guild.channels.create({
		name: newName,
		type: ChannelType.GuildVoice,
		userLimit: userLimit,
		parent: newState.channel?.parent!!
	}).then((vc) => {
		newState.member?.voice.setChannel(vc)
	})
}

const main = async () => {
	await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID as string), {
		body: commands
	})
	client.login(process.env.token)
}

main()