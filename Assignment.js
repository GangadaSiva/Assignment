const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/moviesDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define movie schema
const movieSchema = new mongoose.Schema({
    name: String,
    img: String,
    summary: String
});

const Movie = mongoose.model('Movie', movieSchema);

// CRUD routes
// Create a new movie
app.post('/movies', async (req, res) => {
    try {
        const { name, img, summary } = req.body;
        const movie = new Movie({ name, img, summary });
        await movie.save();
        res.status(201).json(movie);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Read all movies
app.get('/movies', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Read a single movie
app.get('/movies/:movieId', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.movieId);
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json(movie);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a movie
app.put('/movies/:movieId', async (req, res) => {
    try {
        const { name, img, summary } = req.body;
        const movie = await Movie.findByIdAndUpdate(req.params.movieId, { name, img, summary }, { new: true });
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json(movie);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a movie
app.delete('/movies/:movieId', async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.movieId);
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
