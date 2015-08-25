import sys
import pymongo

connection = pymongo.MongoClient('mongodb://localhost')

db = connection.school
students = db.students

for student in students.find():
    score_to_del = 99999999999
    for score in student['scores']:
        if score['type'] == 'homework':
            if score['score'] < score_to_del:
                score_to_del = score['score']

    scores = [s for s in student['scores'] if s['type'] != 'homework' or (s['type'] == 'homework' and s['score'] != score_to_del)]
    if '_id' in student:
        students.update_one({'_id': student['_id']}, {'$set':{'scores': scores}})

