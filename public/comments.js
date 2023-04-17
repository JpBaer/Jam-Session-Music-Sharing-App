const commentBtns = document.querySelectorAll('.comment-btn');
const commentPopup = document.querySelector('.comment-popup');
const commentsList = document.querySelector('.comments-list');
const commentForm = document.querySelector('.comment-form')
const closeBtn = document.querySelector('.close');



commentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        commentPopup.style.display = 'block';

        commentsList.innerHTML = '';

        var playlistId = btn.getAttribute("data-playlist-id");
        console.log(playlistId)
        fetch(`/api/playlist/${playlistId}/comments`)
            .then(response => response.json())
            .then(comments => {
                console.log(comments)
                comments.forEach(comment => {
                    const commentDiv = document.createElement('div');
                    commentDiv.textContent = comment.user.username+': ' + comment.content;
                    commentsList.appendChild(commentDiv);
                });
            })
            .catch(error => {
                console.error(error);
            });

    
    
    commentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        submitComment(playlistId)});
    });
});

window.addEventListener('click', event => {
    if (event.target === closeBtn) {
        commentPopup.style.display = 'none';
    }
});

const submitComment = async (playlist_id) => {
    const comment = document.querySelector('#comment').value.trim();
    console.log(comment)
    console.log('comment button pressed')
    const response = await fetch('/api/comment', {
        method: 'POST',
        body:JSON.stringify({comment, playlist_id}),
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
        console.log('Response OK')
        location.reload();
    } else {
        alert(response.statusText);
    }

}