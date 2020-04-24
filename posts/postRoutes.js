const express = require("express");
const router = express.Router();

const Posts = require("../data/db");

// POST @ /api/posts
router.post("/", (req, res) => {
  const createdPost = req.body;

  Posts.insert(createdPost)
    .then((post) => {
      console.log(createdPost)
      if (createdPost.title || createdPost.contents == undefined) {
        res
          .status(400)
          .json({
            errorMessage: "Please provide title and contents for the post.",
          });
      } else {
        res.status(201).json(post);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "There was an error while saving the post to the database",
      });
    });
});

router.post("/:id/comments", (req, res) => {
  Posts.insertComment(req.body)
    .then((comment) => {
      res.status(201).json(comment);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "There was an error while saving the comment to the database",
      });
    });
});

//GET @ /api/posts
router.get("/", (req, res) => {
  Posts.find(req.query)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  Posts.findById(id)
    .then((post) => {
      if (post[0]) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

router.get("/:id/comments", (req, res) => {
  const { id } = req.params;

  Posts.findPostComments(id)
    .then((comments) => {
      if (comments[0]) {
        res.status(200).json(comments);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    });
  //?
});

// DELETE @ /api/posts/:id
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  Posts.remove(id)
    .then((post) => {
      if (post[0]) {
        res.status(204).json(post);
      } else {
        res.status(404).json({
          message:
            "The post with the specified ID does not exist or has been deleted.",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "The post could not be removed" });
    });
});

//PUT @ /api/posts/:id
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const postUpdate = { ...req.body, id: req.params.id };

  Posts.update(id, req.body)
    .then((post) => {
      console.log(req.body);
      console.log(postUpdate.id);
      if (postUpdate.id !== id || post == 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else if (postUpdate.title && postUpdate.contents == undefined) {
        res.status(400).json({
          errorMessage: "Please provide title and contents for the post.",
        });
      } else {
        res.status(200).json(post);
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ error: "The post information could not be modified." });
    });
});

module.exports = router;
