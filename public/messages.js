//We will need code here to generate the req.body and create messages and conversations

const submitMessage = async (conversation_id) => {
    const message = document.querySelector('#message').value.trim();
    //const receiver_id = ???
    console.log(message)
    console.log('message button pressed')
    const response = await fetch(`/api/conversation/${conversation_id}`, {
        method: 'POST',
        body:JSON.stringify({message, receiver_id}),
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
        console.log('Response OK')
        location.reload();
    } else {
        alert(response.statusText);
    }

}