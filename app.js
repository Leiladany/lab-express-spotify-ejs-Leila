require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

const app = express()

app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  })
  
  // Retrieve an access token
  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error))

// Our routes go here:

 app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))

 app.get("/", (req, res) => {
    res.render("index")
})
app.get('/artist-search', (req, res) => {
    spotifyApi
        .searchArtists(req.query.artistName)
        .then((data) => {
            console.log(data.body.artists.items);
            res.render('artist-search-results', { artistData: data.body.artists.items })
        })
        .catch((err) =>
            console.log('The error while searching artists occurred: ', err)
        );
});
app.get('/albums/:id', (req, res) => {
    spotifyApi.getArtistAlbums(req.params.id).then(
        (data) => {
            console.log('Artist albums', data.body);
            res.render("albums", { albumsData: data.body.items })
        },
        (err) => {
            console.error(err);
        }
    );
})
app.get('/tracks/:idTrack', (req, res) => {
    spotifyApi.getAlbumTracks(req.params.idTrack)
        .then(function (data) {
            console.log('tracks', data.body.items);
            res.render('tracks', { tracksData: data.body.items })
        }, function (err) {
            console.log('Something went wrong!', err);
        });
})
