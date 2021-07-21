const express = require("express");
const router = express.Router();
const List = require("../models/List.model");

//routes to retrieve info from the api

//Get all lists

router.get("/list", async (req, res) => {
  try {
    const allLists = await List.find();
    res.status(200).json(allLists);
  } catch (e) {
    res.status(500).json({ message: `error ocurred ${e}` });
  }
});

//Create a new item

router.post("/list", async (req, res) => {
  const { title, item } = req.body;
  if (!title || !item) {
    res.status(400).json({ message: "missing fields" });

    return;
  }

  try {
    const response = await List.create({
      title,
      item,
    });
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: `error ocurred ${e}` });
  }
});

//Delete list

router.delete("/list/:id", async (req, res) => {
  try {
    await List.findByIdAndRemove(req.params.id);
    res.status(200).json({ message: `id ${req.params.id} was deleted` });
  } catch (e) {
    res.status(500).json({ message: `error ocurred ${e}` });
  }
});

//Get list by ID
router.get("/list/:id", async (req, res) => {
  try {
    const listSpecs = await List.findById(req.params.id);
    res.status(200).json(listSpecs);
  } catch (e) {
    res.status(500).json({ message: `error ocurred ${e}` });
  }
});

//Update list
router.put("/list/:id", async (req, res) => {
  try {
    const { title, item } = req.body;
    await List.findByIdAndUpdate(req.params.id, {
      title,
      item,
    });
    res.status(200).json(`id ${req.params.id} was updated`);
  } catch (e) {
    res.status(500).json({ message: `error occurred ${e}` });
  }
});

module.exports = router;
