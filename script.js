
const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const usernameInput = document.getElementById('username');
const submitUsernameButton = document.getElementById('submit-username');
const chatContainer = document.getElementById('chat-container');
const usernameForm = document.getElementById('username-form');


let username;

function createMessageElement(username, message) {
    const messageElement = document.createElement('li')
    const usernameElement = document.createElement('span')
    usernameElement.classList.add('username-message') // Add a class for styling
    usernameElement.textContent = username + ":"

    // Create a span element for the message content
    const messageContentElement = document.createElement('span')
    messageContentElement.classList.add('message-content') // Add a class for styling
    messageContentElement.textContent = message

    // Append username and message content to the message element
    messageElement.appendChild(usernameElement)
    messageElement.appendChild(messageContentElement)

    return messageElement;
}

function showChat() {
    chatContainer.style.display = ""
    usernameForm.style.display = "none"
}

function displayMessages(content) {
    console.log('this is arr',content)
    content.forEach((data) => {
        // Create a new message element to display the message content
        const messageElement = createMessageElement(data.username, data.content)
        messages.appendChild(messageElement)
    })
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', { content: input.value, username: username });
        input.value = '';
    }
});

submitUsernameButton.addEventListener('click', (e) => {
    username = usernameInput.value.trim()
    if (username) {
        showChat()
        socket.emit('add user', username)
        socket.on('add user response', (data)=>{
            if(data.existingMessages){
                displayMessages(data.existingMessages)
                window.scrollTo(0, document.body.scrollHeight) // Scroll to bottom after rendering
            }
        })
    } else {
        return console.log("Enter a valid Username")
    }
})

socket.on('chat message', (data) => {
    const messageElement = createMessageElement(data.username, data.content)
    messages.appendChild(messageElement)
    window.scrollTo(0, document.body.scrollHeight)
});

socket.on('reconnect', () => {
    console.log('reconneting..')
})

socket.on('disconnect', () => {
    log('you have been disconnected');
});




