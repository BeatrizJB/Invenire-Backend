const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const ItemSchema = new Schema({
  item:
    {
      designation: String,
      category: String,
      nOfParts: {
        type: Number,
        min: 1,
        max: 10000,
      },
      description: String,
      location: String,
      imageUrl: String,
    } 
});

const List = model("Item", ItemSchema);

module.exports = Item;
