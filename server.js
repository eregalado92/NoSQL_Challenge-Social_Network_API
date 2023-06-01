const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Import the thoughtController module
const thoughtController = require('./controllers/thoughtController');
const ThoughtController = require('./controllers/thoughtController');

// Define routes
app.get('/api/thoughts', thoughtController.getAllThoughts);
app.get('/api/thoughts/:thoughtId', thoughtController.getThoughtById);
app.post('/api/thoughts', thoughtController.addThought);
app.post('/api/thoughts/:thoughtId/reactions', thoughtController.addReaction);
app.post('/api/users/:userId/friends', ThoughtController.addFriend);
app.delete('/api/users/:userId/friends', ThoughtController.removeFriend);
app.delete('/api/users/:userId', ThoughtController.deleteUser);
app.delete('/api/thoughts/:thoughtId', ThoughtController.deleteThought);




mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Social_Network', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected successfully');
}).catch((err) => {
  console.log('MongoDB connection error:', err);
});

// Use this to log mongo queries being executed!
mongoose.set('debug', true);

app.listen(PORT, () => console.log(` You have are successfully Connected on localhost:${PORT}`));
