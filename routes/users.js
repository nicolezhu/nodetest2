var express = require('express');
var router = express.Router();

/* Get User List */
router.get('/userlist', function(req, res) {
	var db = req.db;
	var collection = db.get('userlist');
	collection.find({}, {}, function(e, docs) {
		res.json(docs);
	});
});

/* Post to User List */
router.post('/adduser', function(req, res) {
	var db = req.db;
	var collection = db.get('userlist');
	collection.insert(req.body, function(err, result) {
		res.send(
			(err == null) ? { msg: '' } : { msg: err }
		);
	});
});

/* Delete to deleteuser */
router.delete('/deleteuser/:id', function(req, res) {
	var db = req.db;
	var collection = db.get('userlist');
	var userToDelete = req.params.id;
	collection.remove({ '_id' : userToDelete }, function(err) {
		res.send((err == null) ? { msg: '' } : { msg : 'error: ' + err });
	});
});

/* Put to update user */
router.put('/updateuser/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('userlist');
  var userToUpdate = req.params.id;
  console.log(userToUpdate);
  console.log(req.body);
  collection.update({ '_id' : userToUpdate }, { $set : req.body }, function(err) {
		res.send((err == null) ? { msg: '' } : { msg : 'error: ' + err });
	});
});

// router.put('/updateuser/:id', function(req, res) {
// 	var db = req.db;
// 	var collection = db.get('userList');
// 	var userToUpdate = req.params.id;
// 	var doc = { $set: req.body };
// 	collection.update({ '_id': userToUpdate }, { $set: req.body }, function(err, result) {
// 		res.send((err == null ) ? { msg: '' } : { msg : 'error: ' + err });
// 	});
// });

module.exports = router;