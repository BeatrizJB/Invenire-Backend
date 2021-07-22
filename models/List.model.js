const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const ListSchema = new Schema({
  title: String,
  listItems: [
    {
      designation: String,
      category: String,
      quantity: {
        type: Number,
        min: 1,
        max: 10000,
      },
      description: String,
      location: String,
      imageUrl: String,
    },
  ],
});

const List = model("List", ListSchema);

module.exports = List;


// const { Schema, model } = require("mongoose");

// // TODO: Please make sure you edit the user model to whatever makes sense in this case
// const ItemSchema = new Schema({
//   itemSpecs: {
//     designation: String,
//     category: String,
//     quantity: {
//       type: Number,
//       min: 1,
//       max: 10000,
//     },
//     description: String,
//     location: String,
//     imageUrl: String,
//   },
// });

// const Item = model("Item", ItemSchema);

// module.exports = Item;
