const express = require("express");
const router = express.Router();
const List = require("../models/List.model");
const User = require("../models/User.model");

router.get("/myinventories", async (req, res) => {
  try {
    const singleUser = await User.findById(req.session.currentUser._id);
    const createdInventories = await List.find({
      user: singleUser,
    });
    res.status(200).json(createdInventories);
  } catch (e) {
    res.status(500).json({ message: `Error: ${e}` });
  }
});

// router.get(
//   "/myinventories/:invId",
//   /*middleware,*/ async (req, res) => {
//     try {
//       const listSpecs = await List.findById(req.params.invId);
//       res.status(200).json(listSpecs);
//     } catch (e) {
//       res.status(500).json({ message: `error ocurred ${e}` });
//     }
//   }
// );

// router.get("/myinventories/:invId/itemspecs/:itemId", async (req, res) => {
//   try {
//     const listSpecs = await List.findById(req.params.invId);
//     res.status(200).json(listSpecs);
//   } catch (e) {
//     res.status(500).json({ message: `error ocurred ${e}` });
//   }
// });

module.exports = router;
