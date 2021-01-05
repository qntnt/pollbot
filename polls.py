import os
from uuid import uuid4
import csv
from datetime import datetime

POLL_DIR = 'polls'

class Poll:
    def __init__(self, id, topic, options):
        self.id = id
        self.topic = topic
        self.options = options

voter_rows = ['id', 'name', 'datetime']
        
# Creates a poll
# @param type the type of tabulation. 'fptp', 'ranked', etc.
def generate_poll(_type, topic, options):
    poll_id = uuid4()
    with open(POLL_DIR+'/'+str(poll_id)+'.csv', 'w', newline='') as csvfile:
        writer = csv.writer(csvfile, delimiter=',')
        writer.writerow([topic, _type]) # poll metadata
        writer.writerow(voter_rows+options) # poll header row
    return Poll(poll_id, topic, options)

def record_vote_row(poll_id, user_id, name, option_results):
    time = datetime.now().isoformat()
    with open(POLL_DIR+'/'+str(poll_id)+'.csv', 'a+', newline='') as csvfile:
        writer = csv.writer(csvfile, delimiter=',')
        writer.writerow([user_id, name, time] + option_results)
