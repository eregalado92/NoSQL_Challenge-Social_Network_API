const { Thought, User, Types } = require('../models');

const ThoughtController = {
  getAllThoughts(req, res) {
    Thought.find({})
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  getThoughtById({ params }, res) {
    console.log("params sent", params);
    Thought.findOne({ _id: params.thoughtId })
      .select("-__v")
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'Could not find thoughts with this id!' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  addThought({ params, body }, res) {
    console.log("INCOMING BODY", body);
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'Could not find user with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then((deletedThought) => {
        if (!deletedThought) {
          return res.status(404).json({ message: 'No thought with this id!' });
        }
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { thoughts: params.thoughtId } },
          { new: true }
        )
        .then((dbUserData) => {
          if (!dbUserData) {
            return res.status(404).json({ message: 'Could not find user with this id!' });
          }
          res.json(dbUserData);
        });
      })
      .catch((err) => res.status(400).json(err));
  },  
  addReaction({ params, body }, res) {
    console.log("INCOMING BODY", body);
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'Could not find user with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.json(err));
  },
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.thoughtId }, body, { new: true })
      .then((updatedThought) => {
        if (!updatedThought) {
          res.status(404).json({ message: 'Could not find thoughts with this id!' });
          return;
        }
        res.json(updatedThought);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  addFriend({ params, body }, res) {
    const { userId } = params;
    const { friendId } = body;

    User.findOneAndUpdate(
      { _id: userId },
      { $push: { friends: friendId } },
      { new: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'Could not find user with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },
  removeFriend({ params }, res) {
    const { userId, friendId } = params;

    User.findOneAndUpdate(
      { _id: userId },
      { $pull: { friends: friendId } },
      { new: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'Could not find user with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },
  deleteUser({ params }, res) {
    const { userId } = params;
  
    User.findOneAndDelete({ _id: userId })
      .then((deletedUser) => {
        if (!deletedUser) {
          return res.status(404).json({ message: 'Could not find user with this id!' });
        }
        // Remove the user's thoughts
        return Thought.deleteMany({ username: deletedUser.username });
      })
      .then(() => {
        res.json({ message: 'User associated with thoughts has been successfully deleted!' });
      })
      .catch((err) => res.status(400).json(err));
  }
  

};

module.exports = ThoughtController;