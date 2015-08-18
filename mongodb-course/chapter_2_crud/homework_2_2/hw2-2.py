import sys
import pymongo

connection = pymongo.MongoClient('mongodb://localhost')

db = connection.students
grades = db.grades

records = grades.find({'type':'homework'}).sort([('student_id', 1), ('score', 1)])

student_id = None

for rec in records:
    if student_id != rec['student_id']:
        student_id = rec['student_id']
        grades.delete_one({'_id': rec['_id']})
