import { Message, VoiceState, Client, Intents } from "discord.js";
import { categoryName, channels } from "./config";
import express from "express"
import dotenv from 'dotenv';
dotenv.config();


var app = express();
app.set('port', (process.env.PORT || 5000));

//For avoidong Heroku $PORT error
app.get('/', function(request : express.Request, response : express.Response) {
    var result = 'Vainko discord bot is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_VOICE_STATES
	]
})

client.once('ready', () => {
	console.log('Ready!')
})

client.on("messageCreate", (msg: Message) => {
	if (msg.content.startsWith('_')) {
		commandDeploy(msg)
	}
})

client.on('voiceStateUpdate', (oldState: VoiceState, newState: VoiceState) => {
	if (newState != undefined) {
		channels.forEach((ch: Array<any>) => {
			if (ch[0] == newState.channel?.name) {
				moveUser(newState, ch[1], ch[2])
			}
		})
	}

	if (oldState != undefined) {
		channels.forEach((ch: Array<any>) => {
			if (ch[1] == oldState.channel?.name && oldState.channel?.members.size == 0) {
				oldState.channel?.delete()
			}
		})
	}
})

function moveUser(newState: VoiceState, newName: string, userLimit: number) {
	newState.channel?.guild.channels.create(newName, {
		type: 'GUILD_VOICE',
		userLimit: userLimit,
		parent: newState.channel?.parent!!
	}).then((vc) => {
		newState.member?.voice.setChannel(vc)
	})
}

function commandDeploy(msg: Message) {
	let key = msg.content.split('_')[1].split(' ')[0]
	switch (key) {
		case 'setup':
			if (msg.member?.permissions.has("ADMINISTRATOR")) {
				setupBot(msg)
			}
			break
		case 'delete':
			if (msg.member?.permissions.has("ADMINISTRATOR")) {
				deleteChannels(msg)
			}
			break
		default:
			commandNotFound(msg)
			break
	}
}

function setupBot(msg: Message) {
	let ch = msg.guild?.channels.cache.find(ch => ch.name === categoryName && ch.type == 'GUILD_CATEGORY')
	if(ch) return
	msg.guild?.channels.create(categoryName, {
		type: 'GUILD_CATEGORY'
	}).then((channel) => {
		channels.forEach((ar: Array<any>) => {
			msg.guild?.channels.create(ar[0], {
				type: 'GUILD_VOICE',
				userLimit: ar[2],
				parent: channel
			})
		})
	})
	msg.reply('Setting up')
}

function deleteChannels(msg: Message) {
	let ch = msg.guild?.channels.cache.find(ch => ch.name === categoryName && ch.type == 'GUILD_CATEGORY')
	if(!ch) return
	if(ch.type =='GUILD_CATEGORY'){
		ch.children.forEach((vc) => {
			vc.delete()
		})
		ch.delete()
	}
	msg.reply('Deleting')
}

function commandNotFound(msg: Message) {
	msg.reply('Command not found')
}

client.login(process.env.token)