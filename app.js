const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// arrays removed for db version 2
// let items = ['Wake', 'Bathe', 'Make Coffee'];
// let workItems = [];

// ------------------------- MONGODB DECLARATIONS ------------------------------------ //
mongoose.connect('mongodb://localhost:27017/todolistDB', {
  useNewUrlParser: true
});

const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model('item', itemsSchema);

const item1 = new Item({
  name: 'Welcome to your to do list'
});

const item2 = new Item({
  name: 'Click the button to add a new item.'
});

const item3 = new Item({
  name: '<--- Click this to delete an item.'
});

const defaultItems = [item1, item2, item3];

Item.insertMany(defaultItems, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Items have been added to the database');
  }
});

// ------------------------- MONGODB DECLARATIONS ------------------------------------ //

app.get('/', function(req, res) {
  //let day = date.getDay(); //calls the module from date.js to get the long date or name of the day of the week
  res.render('list', { listTitle: 'Today', newListItemArray: items });
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
