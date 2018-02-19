const { Record } = require('./Record');

module.exports = server => {
  server.post('/api/data', (req, res, next) => {
    let recordData = req.body;
    Record.create(recordData)
      .then(record => res.send(record))
      .catch(next);
  });
  server.get('/api/data', (req, res, next) => {
    Record.find({})
      .then(() =>
        Record.find({})
          .sort({ score: -1 }) // sort by Descending
          .limit(10)
          .then(record => res.send(record))
          .catch(next)
      )
      .catch(next);
  });
  server.post('/api/reset', (req, res) => {
    Record.remove({}).then(record => res.send(record)); // to clear database
  });
};
