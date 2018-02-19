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
      .then(record => res.send(record))
      .catch(next);
  });
};
