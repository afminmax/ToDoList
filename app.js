const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');
const mongoose = require('mongoose');
const _ = require('lodash');

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
// ------------------------- MONGODB DECLARATIONS ------------------------------------ //

// ------------------------- CREATE DOCUMENTS IN MONGODB ----------------------------- //

const item1 = new Item({
  name: 'Wake up'
});

const item2 = new Item({
  name: 'Brush teeth'
});

const item3 = new Item({
  name: 'Make coffee'
});

const defaultItems = [item1, item2, item3];

// ----------------------------------------------------------------------------------- //

app.get('/', function(req, res) {
  //let day = date.getDay(); //calls the module from date.js to get the long date or name of the day of the week
  Item.find({}, function(err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log('Default items have been added to the database');
        }
      });
      res.redirect('/');
    } else {
      console.log(foundItems);
      res.render('list', {
        listTitle: 'Today',
        newListItemArray: foundItems
      });
    }
  });
});

app.post('/', function(req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    name: itemName
  });

  if (listName === 'Today') {
    item.save(); //mongoose shortcut to save the new item
    res.redirect('/');
  } else {
    List.findOne({ name: listName }, function(err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect('/' + listName);
    });
  }

  // -----------old v1 logic deprecated ----------- //
  // let item = req.body.newItem;
  // if (req.body.list === 'Work') {
  //   workItems.push(item);
  //   res.redirect('/work');
  // } else {
  //   items.push(item);
  //   res.redirect('/');
  // }
  // -------------------------------------------- //
});

app.post('/delete', function(req, res) {
  // console.log(req.body.checkbox);
  const checkedItemID = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === 'Today') {
    Item.findByIdAndRemove(checkedItemID, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log('The item has been deleted from the db');
        res.redirect('/');
      }
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemID } } },
      function(err, foundList) {
        if (!err) {
          res.redirect('/' + listName);
        }
      }
    );
  }
});

// -----------old v1 logic deprecated ----------- //
// app.get('/work', function(req, res) {
//   res.render('list', { listTitle: 'Work List', newListItemArray: workItems });
// });
// -------------------------------------------- //

// ------------------------- CUSTOM LIST ROUTES ------------------------------------ //

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model('list', listSchema);

app.get('/:customListName', function(req, res) {
  const customListName = _.capitalize(req.params.customListName);

  console.log(customListName);

  List.findOne({ name: customListName }, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        console.log('List does not exist');
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect('/' + customListName);
      } else {
        console.log('List does exist');
        res.render('list', {
          listTitle: foundList.name,
          newListItemArray: foundList.items
        });
      }
    }
  });
});

// ------------------------- END CUSTOM LIST ROUTES -------------------------------- //

app.get('/about', function(req, res) {
  res.render('about');
});

app.listen(3000, function() {
  console.log('...server started on port 3000...');
});
