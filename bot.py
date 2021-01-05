import os
import discord
from dotenv import load_dotenv
from polls import generate_poll, record_vote_row
from uuid import uuid4

load_dotenv()

# Make sure that a discord bot token is available in an environment variable
TOKEN = os.getenv("DISCORD_TOKEN")

client = discord.Client()

@client.event
async def on_ready():
    print(f'{client.user} has connected to Discord!')

fptp_command = 'pollbot fptp '
# Precompute this
fptp_command_len = len(fptp_command)

help_command = 'pollbot help '

# returns the topic for the poll
def get_topic(command, content):
    start_at = len(command)
    end_at = content.index('?') + 1
    return content[start_at:end_at]

# returns list of option strings
def get_options(content):
    start_at = content.index('?') + 1
    return [ option.strip() for option in content[start_at:].split(',')]

def get_option_value(submitted_options, key):
    return submitted_options.find(key)
    

async def record_vote(message):
    messages = await message.channel.history(limit=2).flatten()
    for prev_message in messages:
        if prev_message.author == client.user:
            ordered_options = [ option.strip().lower() for option in message.content.split(',') ]
            
            # Get poll info
            prev_content_lines = prev_message.content.split('\n')
            print(prev_content_lines[0])
            poll_id_start = prev_content_lines[0].find('#')+1
            if poll_id_start != -1:
                
                poll_id = prev_content_lines[0][poll_id_start:]
                option_lines = prev_content_lines[6:]
                
                # Convert ordered options to row values
                option_keys = []
                key_option_map = {}
                for line in option_lines:
                    key_end = line.index(')')
                    key = line[:key_end]
                    key_option_map[key] = line[key_end+1:]
                    option_keys.append(key)

                ordered_options = list(filter(lambda o: o in option_keys, ordered_options))
                
                option_results = []
                for key in option_keys:
                    try:
                        submitted_index = ordered_options.index(key) + 1
                        option_results.append(submitted_index)
                    except:
                        option_results.append(-1)
                        
                record_vote_row(poll_id, message.author.id, message.author.name, option_results)
                key_results = [ f'{key_option_map[key]}) {result if result > 0 else "unspecified"}' for key, result in zip(option_keys, option_results) ]
                result_message = '\n'.join(key_results)
                await message.channel.send(
                    'Your vote has been recorded. Here\'s a summary of your vote:\n'
                    f'{result_message}'
                )
            else:
                print('Did not record vote. Invalid syntax')
            return

@client.event
async def on_message(message):
    if message.author == client.user:
        return

    if message.channel.type == discord.ChannelType.private:
        await record_vote(message)
        return

    content = message.content
    
    if content.lower().startswith(fptp_command):
        topic = get_topic(fptp_command, content)
        options = get_options(content)
        option_string = ', '.join([f'`{option}`' for option in options ])
        poll = generate_poll('fptp', topic, options)
        msg = await message.channel.send(
            f'#{poll.id}\n'
            f'**{poll.topic}**\n'
            f'{option_string}\n'
            '_React to this message to be sent your ballot_'
        )
        await msg.add_reaction('👋')
        return

    if content.lower().startswith(help_command):
        await message.channel.send(
            f'Commands:\n'
            'help - print this help text\n'
            'fptp - create a first-past-the-post poll >:P'
        )

@client.event
async def on_reaction_add(reaction, user):
    if user == client.user:
        return

    if reaction.message.channel.type == discord.ChannelType.private:
        return
    
    message_lines = reaction.message.content.strip().splitlines()
    # Check for '#' special character location to indicate type of message
    if message_lines[0].startswith('#'):
        poll_id = message_lines[0][1:]
        poll_topic = message_lines[1]
        poll_options = message_lines[2].split(',')
        poll_options_enumerated = '\n'.join([ f'{chr(97+i)}) {option}'.strip() for i, option in enumerate(poll_options) ])
        await user.send(
            f'> Here\'s your ballot for poll #{poll_id}\n'
            '> To vote, order the options from best to worst in a comma-separated list.\n'
            '> E.g. `C,b,a,d`\n'
            '*Be sure that your votes are correct before sending*: You cannot edit your vote.\n'
            '_Invalid options will be ignored_\n'
            f'{poll_topic}\n'
            f'{poll_options_enumerated}'
        )

client.run(TOKEN)
