const express = require("express");
const router = express.Router();
const List = require("../models/List.model");

//routes to retrieve info from the api

//Get all lists

router.get("/myinventories", async (req, res) => {
  try {
    const allLists = await List.find();
    res.status(200).json(allLists);
  } catch (e) {
    res.status(500).json({ message: `error ocurred ${e}` });
  }
});

//Create a new list title

router.post("/list", async (req, res) => {
  const { title } = req.body;
  
  if (!title) {
    res.status(400).json({ message: "missing fields" });

    return;
  }

  try {
    const newInv = await List.create({
      title,
    });
    res.status(200).json(newInv);
  } catch (e) {
    res.status(500).json({ message: `error ocurred ${e}` });
  }
});


//update the title of the list itself
router.put("/list/edit/:id", async (req, res) => {
  try {
    const { title } = req.body;
    await List.findByIdAndUpdate(req.params.id, {
      title
    });
    res.status(200).json(`id ${req.params.id} was updated`);
  } catch (e) {
    res.status(500).json({ message: `error occurred ${e}` });
  }
});


//create items of the list with list update
router.put("/list/:id", async (req, res) => {
  try {
    const { designation } = req.body;
    await List.findByIdAndUpdate(req.params.id, {
      $push: {
        listItems: {
          designation
        },
      },
    });
    res.status(200).json(`id ${req.params.id} was updated`);
  } catch (e) {
    res.status(500).json({ message: `error occurred ${e}` });
  }
});



//update the items details

router.post("/list/edit/item/:Itemid", async (req, res) => {
  try {
    const { designation, category, quantity, description, location, imageUrl } =
      req.body;
    await List.findByIdAndUpdate(req.params.id, {
      $push: {
        listItems: {
          designation,
          category,
          quantity,
          description,
          location,
          imageUrl,
        },
      },
    });
    res.status(200).json(`id ${req.params.id} was updated`);
  } catch (e) {
    res.status(500).json({ message: `error occurred ${e}` });
  }
});

   //Delete list

   router.delete("/list/delete/:id", async (req, res) => {
     try {
       await List.findByIdAndRemove(req.params.id);
       res.status(200).json({ message: `id ${req.params.id} was deleted` });
     } catch (e) {
       res.status(500).json({ message: `error ocurred ${e}` });
     }
   });

      router.delete("/list/delete/item/:id", async (req, res) => {
        try {
          await List.findByIdAndRemove(req.params.id)
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



module.exports = router;
