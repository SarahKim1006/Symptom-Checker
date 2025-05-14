// script.js

const chatInput =
    document.querySelector('.chat-input textarea');
const sendChatBtn =
    document.querySelector('.chat-input button');
const chatbox = document.querySelector(".chatbox");

let userMessage;


//OpenAI Free APIKey

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent =
        className === "chat-outgoing" ? `<p>${message}</p>` : `<p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi;
}
const generateResponse = (incomingChatLi) => {
    const messageElement = incomingChatLi.querySelector("p");
    fetch("https://symptom-checker-47ts.onrender.com/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: userMessage + " respond in format of name of illness, descriptions, and solutions. Question should be related to medical field and if not, then respond that you can only answer medical side of concerns."
        })
    })
    .then(res => res.json())
    .then(data => {
        messageElement.innerHTML = parseMarkdown(data.reply);
    })
    .catch((error) => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again!";
    })
    .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};


const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) {
        return;
    }
    chatInput.value = "";
    chatbox
    .appendChild(createChatLi(userMessage, "chat-outgoing"));
    chatbox
    .scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "chat-incoming")
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

sendChatBtn.addEventListener("click", handleChat);
chatInput.addEventListener("keydown", function(e) {
    if(e.code === "Enter") {
        handleChat();
    }
 });

function cancel() {
    let chatbotcomplete = document.querySelector(".chatBot");
    if (chatbotcomplete.style.display != 'none') {
        chatbotcomplete.style.display = "none";
        let lastMsg = document.createElement("p");
        lastMsg.textContent = 'Thanks for using our Chatbot!';
        lastMsg.classList.add('lastMessage');
        document.body.appendChild(lastMsg)
    }
}

function parseMarkdown(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")  // Bold **text**
        .replace(/\*(.*?)\*/g, "<i>$1</i>")      // Italic *text*
        .replace(/__(.*?)__/g, "<b>$1</b>")      // Bold __text__
        .replace(/_(.*?)_/g, "<i>$1</i>")        // Italic _text_
        .replace(/```([\s\S]*?)```/g, "<pre>$1</pre>") // Code block ```
        .replace(/`([^`]+)`/g, "<code>$1</code>") // Inline code `code`
        .replace(/^### (.*$)/gm, "<h3>$1</h3>")  // H3 ###
        .replace(/^## (.*$)/gm, "<h2>$1</h2>")   // H2 ##
        .replace(/^# (.*$)/gm, "<h1>$1</h1>")    // H1 #
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>') // Links [text](url)
        .replace(/\n/g, "<br>"); // New lines
}

function reportClicked() {
    const reason = prompt("What would you like to report?");
    if (reason) {
        console.log("Reported issue:", reason);
        alert("Thanks for your feedback! We'll look into it.");
    }
}

const shareData = {
    title: "Check out this chatbot!",
    text: "I found this helpful medical chatbot!",
    url: window.location.href
  };

function shareClicked() {
    if (false){//(navigator.share) {
        try {
          // Use the Web Share API to trigger the native sharing dialog
          navigator.share(shareData)
    
          console.log('Shared successfully');
        } catch (error) {
          console.error('Error sharing:', error.message);
        }
    } else {
        try {
            navigator.clipboard.writeText(shareData.url);
            alert("Link copied to clipboard!");
          } catch (err) {
            console.error("Clipboard copy failed:", err);
            alert("Oops! Couldn't copy the link.");      
        }
    }
}
