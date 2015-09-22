use enron;
db.messages.aggregate([
  {
    $project: {
      'headers.To': 1,
      'headers.From': 1
    }
  },
  {
    $unwind: '$headers.To'
  },
  {
    $group: {
      _id: {_id: '$_id', from: '$headers.From'},
      to: {$addToSet: '$headers.To'}
    }
  },
  {
    $unwind: '$to'
  },
  {
    $group: {
      _id: {from: '$_id.from', to: '$to'},
      count: {$sum: 1}
    }
  },
  {
    $sort: {count: -1}
  }
]);
