use blog
db.posts.aggregate([
  {$unwind: "$comments"},
  {$group: {_id: "$comments.author", comments:{"$sum": 1}}},
  {$sort: {comments: -1}}
])
