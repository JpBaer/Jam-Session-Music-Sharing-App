const path = require('path');
const express = require('express');
//const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const querystring = require('querystring')
const axios = require('axios');


//Spotify set up
//const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

const clientId = '6b9d8ca2f7a34e56b1aef2f870ddc9b5';
const clientSecret = 'd759d5c054d74ab1ad40ee3a3db52010'
const redirectUri = 'http://localhost:3001';
//scopes are the what data we are asking the user to allow us access to
// additional scopes: user-top-read user-library-read playlist-read-private playlist-read-collaborative
const scopes = 'user-read-private user-read-email user-top-read user-library-read playlist-read-private playlist-read-collaborative';
const state = 'asdgsdhahj';

//Connects our app to spotify api
    //generates a code and returns user to callback URL
app.get('/spotifylogin', function(req,res){
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
app.get('/', function(req, res) {
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
            const {access_token, token_type} = response.data;
            console.log(`Access Token is ${access_token}`)
            //make a call to get user data
            axios.get('https://api.spotify.com/v1/me',{
                headers:{
                    Authorization: `${token_type} ${access_token}`
                }
            })
          .then(response => {
            //Save relavent data from this fetch
            var spotify_id = response.data.id;
            var followers = response.data.followers.total;
            console.log(spotify_id);
            console.log(followers);

            //we want to grab most listened to playlists, followers, top artists, top 5 songs
                        //including playlist images
           

            //call to get users favorite artists
            axios.get('https://api.spotify.com/v1/me/top/artists',{
              headers:{
                Authorization: `${token_type} ${access_token}`
              }
            })

            //Take data from favorite artist call break it into variable
              //to add to user info in database we'll have to do an update request
            .then(response => {
              var topArtists = [response.data.items[0].name, response.data.items[1].name, response.data.items[2].name, response.data.items[3].name, response.data.items[4].name];
              console.log(topArtists);

              //call to get users playlists
        
              axios.get(`
              https://api.spotify.com/v1/users/${spotify_id}/playlists`, {
                headers:{
                  Authorization: `${token_type} ${access_token}`
                }

              //response is playlist data  
              }).then(response => {
                
                //Set up a variable to hold parsed data
                var parsedPlaylistData = [];
                for(i = 0; i<10; i++){
                  let singlePlaylistData = [{
                    //User_id: User_id (not sure how to grab this)
                    name: response.data.items[i].name,
                    playlist_id: response.data.items[i].id,
                    Playlist_url: response.data.items[i].external_urls.spotify,
                    Image_url: response.data.items[i].images[0].url
                  }
                  ];
              
                  parsedPlaylistData.push(singlePlaylistData)
                }
                  console.log(parsedPlaylistData)

                //create a loop that runs Playlist.Create with associated user-id to generate all playlists
                

                //call to get top tracks
                axios.get(`https://api.spotify.com/v1/me/top/tracks`,{
                  headers:{
                    Authorization: `${token_type} ${access_token}`
                  }
                })
                //response for top tracks
                .then(response => {
                  //save topTracks as a variable
                  var topTracks = [response.data.items[0].name,response.data.items[1].name,response.data.items[2].name,response.data.items[3].name,response.data.items[4].name];
                  console.log(topTracks);

                  
                  var topArtistsString = JSON.stringify(topArtists);
                  var topTracksString = JSON.stringify(topTracks);

                  //create id variable to be used in the user update
                  //var user_id = req.session.user_id;

                  var newUserData = {
                    spotify_id: spotify_id,
                    followers: followers,
                    top_Artists: topArtistsString,
                    top_Tracks: topTracksString,
                  
                  };

                  //Run user.update to add tracks to user model


                  res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
                })

                //catch for top tracks 
                .catch(error=>{
                  res.send(error);
                  console.log(error)
                })
              })
              //catch for playlist call
              .catch(error=>{
                res.send(error);
                console.log(error)
              })
            })
            //catch for favorite artists call
            .catch(error=>{
              res.send(error);
              console.log(error)
            })
          })
          //catch for basic user data call
          .catch(error=>{
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

//console.log(accessToken);

//const hbs = exphbs.create({ helpers });


// const sess = {
//   secret: 'adgadfajsgjdgfj',
//   cookie: {},
//   resave: false,
//   saveUninitialized: true,
//   store: new SequelizeStore({
//     db: sequelize
//   })
// };


// this line sets the session middleware to the application
//app.use(session(sess));

// app.engine('handlebars', hbs.engine);
// app.set('view engine', 'handlebars');

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));

// app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});
