const likeButton = async (playlist_id) => {

    console.log('like button pressed')
    console.log('playlist_id')
    const response = await fetch('/api/playlist/like', {
        method: 'PUT',
        body:JSON.stringify({playlist_id}),
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
        console.log('Response OK')
        location.reload();
    } else {
        alert(response.statusText);
    }

}

var likeButtons = document.querySelectorAll(".like-btn");

for(let i = 0; i < likeButtons.length; i++){
    if(document.addEventListener){
    likeButtons[i].addEventListener('click', function(){
    var playlist_id = this.getAttribute("data-playlist-id");
    //console.log(element);
    console.log(playlist_id);
    likeButton(playlist_id);
    location.reload();
});
}}