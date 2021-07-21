const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const ListSchema = new Schema({
  title: String,
  items:{},
});

const List = model("List", ListSchema);

module.exports = List;
