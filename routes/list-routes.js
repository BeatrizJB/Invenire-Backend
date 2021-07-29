const express = require("express");
const router = express.Router();
const List = require("../models/List.model");
const fileUpload = require("../config/cloudinary");

//MIDDLEWARE BEGIN  ---------------------------------------------------------------------------------------------------------------

function requireLogin(req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.status(500).json({ message: `Please login.` });
  }
}

//MIDDLEWARE ENDS -----------------------------------------------------------------------------------------------------------------

//GET BEGIN -----------------------------------------------------------------------------------------------------------------

//get inventory
router.get(
  "/myinventories/:invId",
  /*middleware,*/ async (req, res) => {
    try {
      const listSpecs = await List.findById(req.params.invId);
      res.status(200).json(listSpecs);
    } catch (e) {
      res.status(500).json({ message: `error ocurred ${e}` });
    }
  }
);

//GET ENDS -----------------------------------------------------------------------------------------------------------------

//POST ----------------------------------------------------------------------------------------------------------------------------

//Create a new inventory
router.post(
  "/newinventory",
  /*middleware,*/ async (req, res) => {
    const { title } = req.body;

    if (!title) {
      res.status(400).json({ message: "missing fields" });

      return;
    }

    try {
      const newInv = await List.create({
        title,
        user: req.session.currentUser,
      });
      res.status(200).json(newInv);
    } catch (e) {
      res.status(500).json({ message: `error ocurred ${e}` });
    }
  }
);

//Upload image on cloudinary
router.post("/upload", fileUpload.single("image"), (req, res) => {
  try {
    res.status(200).json({ fileUrl: req.file.path });
  } catch (e) {
    res.status(500).json({ message: `error occurred ${e}` });
  }
});

//END POST -----------------------------------------------------------------------------------------------------------------

//PUT ----------------------------------------------------------------------------------------------------------------------

//update the title of the list
router.put(
  "/myinventories/editinv/:invId",
  /*middleware,*/ async (req, res) => {
    try {
      const { title } = req.body;
      await List.findByIdAndUpdate(req.params.invId, {
        title,
      });
      res.status(200).json(`id ${req.params.invId} was updated`);
    } catch (e) {
      res.status(500).json({ message: `error occurred ${e}` });
    }
  }
);

//create (1by1) items of the inventory (with update)
router.put(
  "/myinventories/additems/:invId",
  /*middleware,*/ async (req, res) => {
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
  }
);

//update the item designation
router.put(
  "/myinventories/:invId/edititem/:itemId",
  /*middleware,*/
  async (req, res) => {
    try {
      const { designation } = req.body;

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
  }
);

//create + update the items specs
router.put(
  "/myinventories/:invId/additemspecs/:itemId",
  /*middleware,*/
  async (req, res) => {
    try {
      const { category, quantity, description, location, imageUrl } = req.body;

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
      //cloudinary here??

      await List.findByIdAndUpdate(req.params.invId, {
        listItems: listItems,
      });

      res.status(200).json(list);
      return;
    } catch (e) {
      res.status(500).json({ message: `error occurred ${e}` });
    }
  }
);

//delete an item from inventory

// router.put(
//   "/myinventories/removeitem/:invId",
//   /*middleware,*/
//   async (req, res) => {
//     try {
//       const { designation } = req.body;
//       await List.findByIdAndUpdate(req.params.invId, {
//         $pull: {
//           listItems: {
//             designation,
//           },
//         },
//       });
//       res.status(200).json(`id ${req.params.invId} was deleted`);
//     } catch (e) {
//       res.status(500).json({ message: `error occurred ${e}` });
//     }
//   }
// );

//delete item
router.put(
  "/myinventories/removeitem/:invId",
  /*middleware,*/
  async (req, res) => {
    try {
      const list = await List.findById(req.params.invId);
      const listItems = list.listItems;

      const filteredArr = listItems.filter(
        (item) => item._id != req.params.itemId
      );
      await List.findByIdAndUpdate(req.params.invId, {
        listItems: filteredArr,
      });

      res.status(200).json(list);
      return;
    } catch (e) {
      res.status(500).json({ message: `error occurred ${e}` });
    }
  }
);

//END PUT  ---------------------------------------------------------------------------------------------------------------

// DELETE/REMOVE----------------------------------------------------------------------------------------------------------

//Delete an inventory

router.delete(
  "/myinventories/deleteinventory/:invId",
  /*middleware,*/
  async (req, res) => {
    try {
      await List.findByIdAndRemove(req.params.invId);
      res.status(200).json({ message: `id ${req.params.invId} was deleted` });
    } catch (e) {
      res.status(500).json({ message: `error ocurred ${e}` });
    }
  }
);

module.exports = router;
