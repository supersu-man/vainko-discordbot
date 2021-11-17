import discord
from discord.ext import commands
from config import category_name, creating_channels, new_channels
import time

client = commands.Bot(command_prefix="_")

async def setup_channels(ctx):
    category = discord.utils.get(ctx.guild.categories, name = category_name)
    if not category:
        category_id = await ctx.guild.create_category(category_name)
        for i in creating_channels:
            await ctx.message.guild.create_voice_channel(i, category=category_id, user_limit=creating_channels[i])

async def move_user(channel, member):
    if str(channel) in new_channels.keys() and str(channel) in creating_channels.keys():
        category = discord.utils.get(member.guild.categories, name = category_name)
        new_channel = await member.guild.create_voice_channel(new_channels[str(channel)], category=category, user_limit=creating_channels[str(channel)])
        await member.move_to(new_channel)
    
async def delete_empty_channel(channel):
    time.sleep(2)
    if(str(channel) in new_channels.values() and len(channel.members) == 0):
        await channel.delete()


@client.command()
async def setup(ctx):
    await setup_channels(ctx)
    
@client.event
async def on_voice_state_update(member, before, after):
    if after.channel:
        await move_user(after.channel, member)
    if before.channel:
        await delete_empty_channel(before.channel)

#Use this while hosting on replit
#from keep_alive import keep_alive
#import os
#keep_alive()
#client.run(os.environ['key'])

#Use this if you just want to just run the python file on your env
from key import key
client.run(key)