const router = require('express').Router();
const { Playlist, User } = require('../models');
const withAuth = require('../utils/auth');
const querystring = require('querystring')
const axios = require('axios');
const express = require('express');
const sequelize = require('../config/connection');
//need to create utils folder that contains auth.js and link it here
// projectData will need to be replaced with our model later on
//might need to create helpers and link it here

router.get('/', async (req, res) => {
  try {
    if (req.session.logged_in) {
      res.redirect('/home')
    }
    else {
      res.render('intropage',
        { logged_in: req.session.logged_in });
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

router.get('/home', withAuth, async (req, res) => {
  try {
    const playlistData = await Playlist.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

 
    const playlists = playlistData.map((playlist) => playlist.get({ plain: true }));

    console.log(playlists)
    //Grab user data for the logged in user

    //******************************************* */
    //This randomSongs and randomArtists code should be destructured into a seperate function to be called in the /home route
    var id = req.session.user_id;
    const userData = await User.findByPk(id);
    const user = userData.get({ plain: true });
    console.log(userData);
   

    // Code to get random songs and artists for home page
    //Grab all users
    

    let random_Artists = {};
    let random_Songs = {};
    
    //Check if session variables are empty
    //if empty grab random song and artist data
    if(req.session.randomSongs === false && req.session.randomArtists === false){
       console.log('Setting new session variables for randomSongs and randomArtists')
    
    //Grab all users
    const randomData = await User.findAll()
    if(randomData.length > 0){
    const songData = randomData.map((songData) => songData.get({ plain: true }));
   
    //Create empty arrays for songs and artists
    const randomSongs = [];
    const randomArtists = [];
    //Grab three random songs and artists
    

    //Loop through random users, and grab random songs and artists until both arrays have 3 items
    //Probably should use a while loop here
    for (let i = 0; i < 3; i++) {
      //grab a random user
      const randomUser = songData[getRandomInt(0, songData.length - 1)];
      console.log(randomUser)
      //grab a random song and artist and append to array
     
      //Check if user has any top songs and artists otherwise loop ends and i isnt incremented
      if(randomUser.top_songs != null && randomUser.top_songs != "You don't have any top songs. You should listen to more music! " && randomUser.top_artists != "You don't have any top artists"){
      let top_songs = JSON.parse(randomUser.top_songs)
      let top_artists = JSON.parse(randomUser.top_artists)
      console.log('****************************')
      console.log(randomUser.top_songs)
      console.log(randomUser.top_artists)

      //Add a random song to random songs array and make sure it's not a duplicate
        while(true){
        let randomSong = top_songs[getRandomInt(0, top_songs.length - 1)]
        console.log('****************')
        console.log(randomSong)
        console.log(randomSongs)
        if(!randomSongs.find(el => el[0] ===randomSong[0])){
          randomSongs.push(randomSong); 
          break
        }
      }
        //Add a random artist to random artists array and make sure it's not a duplicate
        while(true){
          let randomArtist = top_artists[getRandomInt(0, top_artists.length - 1)]
          if(!randomArtists.includes(randomArtist)){
            randomArtists.push(randomArtist);
            break
          }
        }
        } else{i--}
      }
      
    if(randomSongs.length > 0 ){
    random_Songs = { random_Songs: randomSongs};
  }
      
    if(randomArtists.length > 0){
    random_Artists = { random_Artists: randomArtists};
  }

    req.session.randomSongs = random_Songs;
    req.session.randomArtists = random_Artists;
    console.log(req.session.randomSongs);
    console.log(req.session.randomArtists)
    }
    
   
    console.log('Session variables after the loop outside')
   // console.log(req.session.randomSongs);
    //console.log(req.session.randomArtists)
  }
    //If random session variables are already set, above loop wont run
    //Sets random_songs and random_artists to the objects held in session variables
    random_Songs = req.session.randomSongs;
    random_Artists =  req.session.randomArtists;

    //When above code is refactored into seperate function it should return random_Songs and random_Artists
    //****************************************************************** */
    
    res.render('homepage', {
      playlists,
      ...user,
      random_Songs,
      random_Artists,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/user/:id', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id, {
      include: [
        {
          model: Playlist,
        },
      ],
    });

    const user = userData.get({ plain: true });

    user.top_songs = JSON.parse(user.top_songs)
    user.top_artists = JSON.parse(user.top_artists)
    // console.log('*********************')
    // console.log(user);
    // console.log('*********************')

    res.render('user', {
      ...user,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/home');
    return;
  }

  res.render('login');
});

//******************************************************************* */
//Spotfy routes should be separated into its own spotifyRoutes.js file
const clientId = '6b9d8ca2f7a34e56b1aef2f870ddc9b5';
const clientSecret = 'd759d5c054d74ab1ad40ee3a3db52010'
// const redirectUri = 'https://calm-tor-47120.herokuapp.com/callback';
const redirectUri = 'http://localhost:3001/callback';
//scopes are the what data we are asking the user to allow us access to
// additional scopes: user-top-read user-library-read playlist-read-private playlist-read-collaborative
const scopes = 'user-read-private user-read-email user-top-read user-library-read playlist-read-collaborative';
const state = 'asdgsdhahj';

//Connects our app to spotify api
//generates a code and returns user to callback URL
router.get('/spotifylogin', function (req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: clientId,
      scope: scopes,
      redirect_uri: redirectUri,
      state: state
    }));
});


//This is the big daddy
//First app.get grabs the code from the above response
// /callback
//Will this '/' get interfere with loading the normal homepage? or can we have this in the api section?
//This should bring the user to their populated homepage
router.get('/callback', async (req, res) => {
  var id = req.session.user_id;
  var code = req.query.code || null;
  console.log(code)
  //axios makes a call to spotify API with that code and recieves an access token
  //access token lasts 1 hour, a refresh token is also provide to refresh that access token
  //We'll need to add another component to refresh the token (Brooke sent me a potential solution) but that is after MVP is working
  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: querystring.stringify({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${new Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
  })
    //Take data and deconstruct it into access_token and token_type variable
    .then(response => {
      if (response.status === 200) {
        //deconstruct
        const { access_token, token_type } = response.data;
        console.log(`Access Token is ${access_token}`)
        //make a call to get user data
        axios.get('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `${token_type} ${access_token}`
          }
        })
          .then(response => {
            console.log(response.data)
            //Save relavent data from this fetch
            var spotify_id = response.data.id;
            var followers = response.data.followers.total;

            // check if user has a profile image and store
            if (response.data.images.length != 0) {
              var profile_picture_url = response.data.images[0].url;
            }

            console.log(spotify_id);
            console.log(followers);


            //call to get users favorite artists
            axios.get('https://api.spotify.com/v1/me/top/artists', {
              headers: {
                Authorization: `${token_type} ${access_token}`
              }
            })

              //Take data from favorite artist call and set it to variable

              .then(response => {
                if (response.data.items.length != 0) {
                  var topArtists = [response.data.items[0].name, response.data.items[1].name, response.data.items[2].name, response.data.items[3].name, response.data.items[4].name];
                }
                //if the user has no top artists, we set a default message to be displayed
                else {
                  var topArtists = ["You don't have any top artists"];
                }
                console.log(topArtists);

                //call to get users playlists

                axios.get(`
              https://api.spotify.com/v1/users/${spotify_id}/playlists/?limit=50`, {
                  headers: {
                    Authorization: `${token_type} ${access_token}`
                  }

                  //response is playlist data  
                }).then(response => {
      
                  
                  //Set up a variable to hold parsed data
                  var parsedPlaylistData = [];
                  var user_id = req.session.user_id;
                  console.log(response.data);


                  for (let i = 0; i < response.data.items.length; i++) {
                    let singlePlaylistData = {
                     
                      name: response.data.items[i].name,
                      playlist_id: response.data.items[i].id,
                      playlist_url: response.data.items[i].external_urls.spotify,
                      image_url: response.data.items[i].images[0].url,
                      user_id: user_id,
                    };
                    //add playlist dat aobject to array
                    parsedPlaylistData.push(singlePlaylistData)
                  }
                  console.log(parsedPlaylistData)

                  //Add all playlists to database
                  const createNewPlaylists = () => Playlist.bulkCreate(parsedPlaylistData, { ignoreDuplicates: true });
                  


                  //call to get top tracks
                  axios.get(`https://api.spotify.com/v1/me/top/tracks`, {
                    headers: {
                      Authorization: `${token_type} ${access_token}`
                    }
                  })
                    //response for top tracks
                    .then(response => {
                      //save topTracks as a variable with track name and artist
                      if (response.data.items.length != 0) {
                        var topTracks = [[response.data.items[0].name, response.data.items[0].artists[0].name], [response.data.items[1].name, response.data.items[1].artists[0].name], [response.data.items[2].name, response.data.items[2].artists[0].name], [response.data.items[3].name, response.data.items[3].artists[0].name], [response.data.items[4].name, response.data.items[4].artists[0].name]];
                      }
                      else {
                        var topTracks = ["You don't have any top songs. You should listen to more music! "]
                      }
                      console.log(topTracks);

                      //Stringify to JSON object for database entry
                      var topArtistsString = JSON.stringify(topArtists);
                      var topTracksString = JSON.stringify(topTracks);

                     

                      console.log(user_id)
                      //Check if a profile picture was pulled from api
                      if (profile_picture_url) {
                        var newUserData = {
                          spotify_id: spotify_id,
                          followers: followers,
                          top_artists: topArtistsString,
                          top_songs: topTracksString,
                          profile_picture_url: profile_picture_url,

                        };
                      }
                      else {
                        var newUserData = {
                          spotify_id: spotify_id,
                          followers: followers,
                          top_artists: topArtistsString,
                          top_songs: topTracksString,
                        };
                      }


                      const updatedUser = () => {
                        User.update(newUserData, {
                          where: {
                            id: user_id
                          },
                        })
                      };
                      // if (!updatedUser) {
                      //   res.status(404).json({message: 'No user with that id found.'})
                      //   return;
                      // }
                      // res.status(200).json(updatedUser)

                      // Run user.update to add tracks to user model


                      //Create function that calls playlist creation function and update User function
                      const updateSpotifyData = async () => {
                        await createNewPlaylists();
                        await updatedUser();
                      }


                      updateSpotifyData();
                      res.redirect(`/user/${id}`);
                    })
                    //catch for top tracks 
                    .catch(error => {
                      res.send(error);
                      console.log(error)
                    })
                })
                  //catch for playlist call
                  .catch(error => {
                    res.send(error);
                    console.log(error)
                  })
              })
              //catch for favorite artists call
              .catch(error => {
                res.send(error);
                console.log(error)
              })
          })
          //catch for basic user data call
          .catch(error => {
            res.send(error);
            console.log(error)
          });
      }
      else {
        res.send(response);
      }

    })
    //catch for token call
    .catch(error => {
      res.send(error);
    });

});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = router;