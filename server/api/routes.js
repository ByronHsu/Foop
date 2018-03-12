const { Record, BestTen } = require('./Record');
const { User } = require('./User');

module.exports = server => {
  server.post('/api/user', (req, res, next) => {
    let userData = req.body;
    User.findOneAndUpdate({ id: userData.id }, { sessionID: req.sessionID })
      .then(updatedUser => {
        if (!updatedUser) {
          User.create(Object.assign(userData, { sessionID: req.sessionID }))
            .then(user => res.send(user))
            .catch(next);
        } else res.send(updatedUser);
      })
      .catch(next);
  });
  server.get('/api/user', (req, res, next) => {
    User.find({})
      .then(users => res.send(users))
      .catch(next);
  });
  server.post('/api/data', (req, res, next) => {
    let recordData = req.body;
    User.find({ id: recordData.id })
      .then(user => {
        if (
          user[0].sessionID === req.sessionID &&
          user[0].name === recordData.name
        ) {
          Record.create(recordData)
            .then(record => res.send(record))
            .catch(next);
        } else console.log(`user doesn't exist, check failed.`);
      })
      .catch(next);
  });
  server.post('/api/bestten', (req, res, next) => {
    let recordData = req.body;
    User.find({ id: recordData.id })
      .then(user => {
        if (
          user[0].sessionID === req.sessionID &&
          user[0].name === recordData.name
        ) {
          BestTen.create(recordData)
            .then(() => {
              BestTen.find({})
                .sort({ score: -1 })
                .then(sortedRecords => {
                  if (sortedRecords.length > 10) {
                    // remove all records out of 10th
                    for (let i = 0; i < sortedRecords.length - 10; i++) {
                      BestTen.remove(
                        { _id: sortedRecords[10 + i]._id },
                        err => {
                          if (err) return err;
                        }
                      );
                      sortedRecords.pop();
                    }
                  }
                  res.send(sortedRecords);
                })
                .catch(next);
            })
            .catch(next);
        } else console.log(`user doesn't exist, check failed.`);
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
  server.get('/api/cleanexceedten', (req, res) => {
    BestTen.find({})
      .sort({ score: -1 })
      .then(sortedRecords => {
        for (let i = 0; i < sortedRecords.length - 10; i++) {
          BestTen.remove({ _id: sortedRecords[10 + i]._id }, err => {
            if (err) return err;
          });
          sortedRecords.pop();
        }
        res.send(sortedRecords);
      })
      .catch(err => console.error(err));
  });
  // server.get('/api/resetbestten', (req, res) => {
  //   BestTen.remove({}).then(record => res.send(record));
  // });
  // server.get('/api/reset/reallyneedtoreset', (req, res) => {
  //   Record.remove({}).then(record => res.send(record)); // to clear database
  // });
};
