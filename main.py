import discord
from discord.ext import commands
from config import category_name, creating_channels, new_channels
import time

client = commands.Bot(command_prefix="_")

async def setup_channels(ctx, category_id):
    for i in creating_channels:
        await ctx.message.guild.create_voice_channel(i, category=category_id, user_limit=creating_channels[i])

async def get_category(ctx):
    category = discord.utils.get(ctx.guild.categories, name = category_name)
    if not category:
        category_id =  await ctx.guild.create_category(category_name)
        return category_id
    else:
        return category

async def create_temp_vc(ctx, category, name,  num):
    if name not in creating_channels.keys():
        new_channel = await ctx.guild.create_voice_channel(name, category=category, user_limit=num)
        await ctx.message.author.move_to(new_channel)

async def move_user(member, channel):
    if str(channel) in creating_channels:
        category = await get_category(member)
        new_channel = await member.guild.create_voice_channel(new_channels[str(channel)], category=category, user_limit=creating_channels[str(channel)])
        await member.move_to(new_channel)

async def delete_empty_channel(member, channel):
    category = discord.utils.get(member.guild.categories, name = category_name)
    time.sleep(2)
    if(channel in category.channels and str(channel) not in creating_channels.keys() and len(channel.members) == 0):
        await channel.delete()

async def delete_all(ctx):
    category = discord.utils.get(ctx.guild.categories, name = category_name)
    channels = category.channels 

    for channel in channels: 
        try:
            await channel.delete() 
        except AttributeError: 
            pass
    await category.delete()

@client.command()
async def setup(ctx):
    category = await get_category(ctx)
    await setup_channels(ctx, category)

@client.command()
async def delete(ctx):
    await delete_all(ctx)

@client.command()
async def create(ctx, *query):
    name = query[0]
    num = query[1]
    category = await get_category(ctx)
    await create_temp_vc(ctx, category, name, num)
    
@client.event
async def on_voice_state_update(member, before, after):
    if after.channel:
        await move_user(member, after.channel)
    if before.channel:
        await delete_empty_channel(member, before.channel)

#Uncomment below lines if you want to run bot on replit else comment them

"""from keep_alive import keep_alive
import os
keep_alive()
client.run(os.environ['key'])"""

#Uncomment below lines if you want to run bot on your machine else comment them

from key import key
client.run(key)