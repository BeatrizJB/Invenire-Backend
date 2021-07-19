const express = require("express");
const router = express.Router();
const Inventory = require("../models/Items.model");
const fileUpload = require("../config/cloudinary");

//if you want to use the middleware is same as bef
function requireLogin(req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.status(401).json({ message: "unauthorized" });
  }
}

//upload image cloudinary
router.post("/upload", fileUpload.single("image"), (req, res) => {
  try {
    res.status(200).json({ fileUrl: req.file.path });
  } catch (e) {
    res.status(500).json({ message: `error occurred ${e}` });
  }
});

//routes to retrieve info from the api

/*--------------------CRUD-----------------------*/

//Get all items

router.get("/inventory", async (req, res) => {
  try {
    const allInventories = await Inventory.find();
    res.status(200).json(allInventories);
  } catch (e) {
    res.status(500).json({ message: `error ocurred ${e}` });
  }
});

//Create item

router.post("/inventory", async (req, res) => {
  const { designation, type } = req.body;
  if (!designation || !type) {
    res.status(400).json({ message: "missing fields" });

    return;
  }

  try {
    const response = await Inventory.create({
      designation,
      type,
    });
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: `error ocurred ${e}` });
  }
});

//Update inventory

router.put("/inventory/:id", async (req, res) => {
  try {
    const { designation, type } = req.body;
    await Inventory.findByIdAndUpdate(req.params.id, {
      designation,
      type,
    });
    res.status(200).json(`id ${req.params.id} was updated`);
  } catch (e) {
    res.status(500).json({ message: `error occurred ${e}` });
  }
});

//Get project by ID

router.get("/inventory/:id", async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    res.status(200).json(inventory);
  } catch (e) {
    res.status(500).json({ message: `error ocurred ${e}` });
  }
});

//Delete object

router.delete("/inventory/:id", async (req, res) => {
  try {
    await Inventory.findByIdAndRemove(req.params.id);
    res.status(200).json({ message: `id ${req.params.id} was deleted` });
  } catch (e) {
    res.status(500).json({ message: `error ocurred ${e}` });
  }
});


module.exports = router;
