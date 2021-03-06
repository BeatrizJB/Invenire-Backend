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
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const List = model("List", ListSchema);

module.exports = List;

