const commentBtns = document.querySelectorAll('.comment-btn');
const commentPopup = document.querySelector('.comment-popup');
const commentsList = document.querySelector('.comments-list');
const closeBtn = document.querySelector('.close');




commentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        commentPopup.style.display = 'block';

        commentsList.innerHTML = '';

        const playlistId = btn.dataset.playlistId;

        fetch('/api/playlists/${playlistId}/comments')
            .then(response => response.json())
            .then(comments => {

                comments.forEach(comment => {
                    const commentDiv = document.createElement('div');
                    commentDiv.textContent = comment.text;
                    commentsList.appendChild(commentDiv);
                });
            })
            .catch(error => {
                console.error(error);
            });
    });
});

window.addEventListener('click', event => {
    if (event.target === closeBtn) {
        commentPopup.style.display = 'none';
    }
});
