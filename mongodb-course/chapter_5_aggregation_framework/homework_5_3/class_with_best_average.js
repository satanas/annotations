use test
db.grades.aggregate([
  {$unwind: "$scores"},
  {$match:
    {
      $or: [{"scores.type": "exam"}, {"scores.type": "homework"}]
    }
  },
  {$group:
    {
      _id: {
        "student": "$student_id",
        "class": "$class_id"
      },
      avg: {$avg: "$scores.score"}
    }
  },
  {$group:
    {
      _id: "$_id.class",
      avg: {$avg: "$avg"}
    }
  },
  {$sort: {avg: -1}}
])
