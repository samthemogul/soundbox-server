import genres from './constants.js';
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();

// configure cors to accept all origins using the cors package
app.use(cors({
    origin: '*',
    methods: ['GET'],
}));

const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Route to fetch songs by genre
app.get('/songs/genre/:genreId', (req, res) => {
    const genreId = req.params.genreId;
    const genre = genres.find(genre => genre.id == genreId);
    if (!genre) {
        res.status(404).json({ message: `Genre with id ${genreId} not found` });
    } else {
        fetch(`https://api.deezer.com/chart/${genre.id}`)
            .then(res => res.json())
            .then(json => {
                res.json(json.tracks.data);
            });
    }
});

// Route to fetch top songs
app.get('/songs/top', (req, res) => {
    fetch('https://api.deezer.com/chart/0')
        .then(res => res.json())
        .then(json => {
            res.json(json.tracks.data);
        });
});

// Route to fetch top artists
app.get('/artists/top', (req, res) => {
    fetch('https://api.deezer.com/chart/0')
        .then(res => res.json())
        .then(json => {
            res.json(json.artists.data);
        });
});

// Route to fetch song detail by id
app.get('/songs/:id', (req, res) => {
    const id = req.params.id;
    fetch(`https://api.deezer.com/track/${id}`)
        .then(res => res.json())
        .then(json => {
            res.json(json.artists.data);
        });
});

// Route to fetch artist detail by id
app.get('/artists/:id', (req, res) => {
    const id = req.params.id;
    fetch(`https://api.deezer.com/artist/${id}`)
        .then(res => res.json())
        .then(json => {
            res.json(json);
        });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
