import pymongo

connection_string = "mongodb://localhost"
connection = pymongo.MongoClient(connection_string)
db = connection.photo

orphan = []
for image in db.images.find():
    exist = db.albums.find_one({'images': image['_id']})
    if not exist:
        orphan.append(image['_id'])

for image in orphan:
    db.images.delete_one({'_id': image})

print 'Deleted ' + str(len(orphan)) + ' images'
