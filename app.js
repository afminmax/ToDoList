const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let items = ['Wake', 'Bathe', 'Make Coffee'];
let workItems = [];

app.get('/', function(req, res) {
  let day = date.getDay(); //calls the module from date.js to get the long date or name of the day of the week
  res.render('list', { listTitle: day, newListItemArray: items });
});

app.post('/', function(req, res) {
  let item = req.body.newItem;
  if (req.body.list === 'Work') {
    workItems.push(item);
    res.redirect('/work');
  } else {
    items.push(item);
    res.redirect('/');
  }
});

app.get('/work', function(req, res) {
  res.render('list', { listTitle: 'Work List', newListItemArray: workItems });
});

app.get('/about', function(req, res) {
  res.render('about');
});

app.listen(3000, function() {
  console.log('...server started on port 3000...');
});
