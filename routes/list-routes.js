const { compare } = require("bcryptjs");
const express = require("express");
const router = express.Router();
const List = require("../models/List.model");

//routes to retrieve info from the api

//ALL GETS -----------------------------------------------------------------------------------------------------------------

//Get all inventories

router.get("/myinventories", async (req, res) => {
  try {
    const allLists = await List.find();
    res.status(200).json(allLists);
  } catch (e) {
    res.status(500).json({ message: `error ocurred ${e}` });
  }
});

//Get list by ID
router.get("/myinventories/:invId", async (req, res) => {
  try {
    const listSpecs = await List.findById(req.params.invId);
    res.status(200).json(listSpecs);
  } catch (e) {
    res.status(500).json({ message: `error ocurred ${e}` });
  }
});

// router.get("/myinventories/:invId/itemspecs/:itemId", async (req, res) => {
//   try {
//     const listSpecs = await List.findById(req.params.invId);
//     res.status(200).json(listSpecs);
//   } catch (e) {
//     res.status(500).json({ message: `error ocurred ${e}` });
//   }
// });


//END GETS -----------------------------------------------------------------------------------------------------------------

//ALL POSTS -----------------------------------------------------------------------------------------------------------------
//Create a new inventory

router.post("/newinventory", async (req, res) => {
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

//END POSTS -----------------------------------------------------------------------------------------------------------------

//ALL PUTS -----------------------------------------------------------------------------------------------------------------

//update the title of the list
router.put("/myinventories/:invId", async (req, res) => {
  try {
    const { title } = req.body;
    await List.findByIdAndUpdate(req.params.invId, {
      title,
    });
    res.status(200).json(`id ${req.params.invId} was updated`);
  } catch (e) {
    res.status(500).json({ message: `error occurred ${e}` });
  }
});

//create (1by1) items of the inventory (with update)
router.put("/myinventories/additems/:invId", async (req, res) => {
  try {
    const { designation } = req.body;
    await List.findByIdAndUpdate(req.params.invId, {
      $push: {
        listItems: {
          designation,
        },
      },
    });
    res.status(200).json(`id ${req.params.invId} was updated`);
  } catch (e) {
    res.status(500).json({ message: `error occurred ${e}` });
  }
});

//update the item designation
router.put("/myinventories/:invId/edititem/:itemId", async (req, res) => {
  try {
    const { designation } =
      req.body;

    const list = await List.findById(req.params.invId);
    const listItems = list.listItems;
    const itemToUpdate = listItems.find(
      (item) => item._id == req.params.itemId
    );

    itemToUpdate.designation = designation;

    await List.findByIdAndUpdate(req.params.invId, {
      listItems: listItems,
    });

    res.status(200).json(list);
    return;
  } catch (e) {
    res.status(500).json({ message: `error occurred ${e}` });
  }
});


//update the items specs
router.put("/myinventories/:invId/additemspecs/:itemId", async (req, res) => {
  try {
    const { category, quantity, description, location, imageUrl } =
      req.body;

    const list = await List.findById(req.params.invId);
    const listItems = list.listItems;
    const itemToUpdate = listItems.find(
      (item) => item._id == req.params.itemId
    );

    itemToUpdate.category = category;
    itemToUpdate.quantity = quantity;
    itemToUpdate.description = description;
    itemToUpdate.location = location;
    itemToUpdate.imageUrl = imageUrl;

    await List.findByIdAndUpdate(req.params.invId, {
      listItems: listItems,
    });

    res.status(200).json(list);
    return;
  } catch (e) {
    res.status(500).json({ message: `error occurred ${e}` });
  }
});


//END PUTS  -----------------------------------------------------------------------------------------------------------------

//ALL DELETE/REMOVE----------------------------------------------------------------------------------------------------------

//Delete an inventory

router.delete("/myinventories/deleteinventory/:invId", async (req, res) => {
  try {
    await List.findByIdAndRemove(req.params.invId);
    res.status(200).json({ message: `id ${req.params.invId} was deleted` });
  } catch (e) {
    res.status(500).json({ message: `error ocurred ${e}` });
  }
});

//delete an item from inventory

  router.put("/myinventories/removeitem/:invId", async (req, res) => {
    try {
      const { designation } = req.body;
      await List.findByIdAndUpdate(req.params.invId, {
        $pull: {
          listItems: {
            designation,
          },
        },
      });
      res.status(200).json(`id ${req.params.invId} was deleted`);
    } catch (e) {
      res.status(500).json({ message: `error occurred ${e}` });
    }
  });

//delete 
  router.put("/myinventories/:invId/removeitemspecs/:itemId", async (req, res) => {
    try {
      const {
        
        category,
        quantity,
        description,
        location,
        imageUrl,
      } = req.body;

      const list = await List.findById(req.params.invId);
      const listItems = list.listItems;
      const itemToDelete = listItems.find(
        (item) => item._id == req.params.itemId
      );

      
      itemToDelete.category = category;
      itemToDelete.quantity = quantity;
      itemToDelete.description = description;
      itemToDelete.location = location;
      itemToDelete.imageUrl = imageUrl;

      await List.findByIdAndUpdate(req.params.invId, {
        listItems: listItems,
      });

      res.status(200).json(list);
      return;
    } catch (e) {
      res.status(500).json({ message: `error occurred ${e}` });
    }
  });


module.exports = router;
