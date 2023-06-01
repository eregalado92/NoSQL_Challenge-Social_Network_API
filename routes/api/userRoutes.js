const router = require('express').Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend
} = require('../../controllers/userController');

// GET /api/users
router.get('/', getAllUsers);

// GET /api/users/:userId
router.get('/:userId', getUserById);

// POST /api/users
router.post('/', createUser);

// PUT /api/users/:userId
router.put('/:userId', updateUser);

// DELETE /api/users/:userId
router.delete('/:userId', deleteUser);

// POST /api/users/:userId/friends/:friendId
router.post('/:userId/friends/:friendId', addFriend);

// DELETE /api/users/:userId/friends/:friendId
router.delete('/:userId/friends/:friendId', removeFriend);

module.exports = router;
