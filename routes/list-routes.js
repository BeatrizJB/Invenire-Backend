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

//Create a new list

router.post("/list", async (req, res) => {
  const { category, items } = req.body;
  if (!category || !items) {
    res.status(400).json({ message: "missing fields" });

    return;
  }

  try {
    const response = await List.create({
      category,
      items,
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
    res.status(200).json({message: `id ${req.params.id} was deleted`})
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
})



//Update list
router.put("/list/:id", async (req, res) => {
  try {
    const { category, items } = req.body;
    await List.findByIdAndUpdate(req.params.id, {
      category,
      items,
    });
    res.status(200).json(`id ${req.params.id} was updated`);
  } catch (e) {
    res.status(500).json({ message: `error occurred ${e}` });
  }
});

module.exports = router;