const { Record, BestTen } = require('./Record');

module.exports = server => {
  server.post('/api/data', (req, res, next) => {
    let recordData = req.body;
    Record.create(recordData)
      .then(record => res.send(record))
      .catch(next);
  });
  server.post('/api/bestten', (req, res, next) => {
    let recordData = req.body;
    BestTen.create(recordData)
      .then(record => {
        BestTen.find({}).then(records => {
          if (records.length > 10) {
            BestTen.find({})
              .sort({ score: -1 })
              .then(sortedRecords => {
                BestTen.remove({ _id: sortedRecords[10]._id }, err => {
                  if (err) return err;
                });
                sortedRecords.pop();
                res.send(sortedRecords);
              })
              .catch(next);
          } else res.send(record);
        });
      })
      .catch(next);
  });
  server.get('/api/bestten', (req, res, next) => {
    BestTen.find({})
      .sort({ score: -1 })
      .then(records => res.send(records))
      .catch(next);
  });
  server.get('/api/data', (req, res, next) => {
    Record.find({})
      .then(() =>
        Record.find({})
          .then(records => res.send(records))
          .catch(next)
      )
      .catch(next);
  });
  server.post('/api/getbest', (req, res, next) => {
    Record.find({ id: req.body.id })
      .sort({ score: -1 })
      .limit(1)
      .then(record => res.send(record))
      .catch(next);
  });
  server.post('/api/reset', (req, res) => {
    Record.remove({}).then(record => res.send(record)); // to clear database
  });
};
