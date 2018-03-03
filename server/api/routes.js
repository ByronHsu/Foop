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
      .then(() => {
        BestTen.find({})
          .sort({ score: -1 })
          .then(sortedRecords => {
            if (sortedRecords.length > 10) {
              // remove all records out of 10th
              for (let i = 0; i < sortedRecords.length - 10; i++) {
                BestTen.remove({ _id: sortedRecords[10 + i]._id }, err => {
                  if (err) return err;
                });
                sortedRecords.pop();
              }
            }
            res.send(sortedRecords);
          })
          .catch(next);
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
      .then(records => res.send(records))
      .catch(next);
  });
  server.post('/api/getbest', (req, res, next) => {
    Record.find({ id: req.body.id })
      .sort({ score: -1 })
      .limit(1)
      .then(record => res.send(record))
      .catch(next);
  });
  server.get('/api/resetbestten', (req, res) => {
    BestTen.remove({}).then(record => res.send(record));
  });
  server.get('/api/reset/reallyneedtoreset', (req, res) => {
    Record.remove({}).then(record => res.send(record)); // to clear database
  });
};
