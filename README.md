<h1>Chatting Website</h1>
<p>
  This project is a real-time chat application where users can send written messages to their friends. Users can also use a microphone feature to convert voice to text before sending messages. If any abusive words are detected in the message, it will not be sent to the friend but will be forwarded to the admin for review.
</p>
<h2>📌 Key Features</h2>
    <ul>
        <li>Real-time chat between users using <code>Socket.IO</code></li>
        <li>Mic input using Web Speech API for voice-to-text</li>
        <li>Abusive word Filtering</li>
        <li>Blocked messages are automatically forwarded to the admin</li>
        <li>Modern UI built with React.js</li>
      <li>Sign In After confirmation of OTP</li>
    </ul>
    <h2>🛠️ Technologies Used</h2>
    <ul>
        <li><strong>Frontend:</strong> React.js, Tailwind CSS</li>
        <li><strong>Backend:</strong> Node.js, Express.js</li>
        <li><strong>Real-time Communication:</strong> Socket.IO</li>
        <li><strong>Database:</strong> MongoDB</li>
        <li><strong>Voice Input:</strong> Web Speech API (speech-to-text only)</li>
        <li><strong>Abuse Detection:</strong> Custom filter or <code>abuse-detection</code> npm package</li>
    </ul>
    <h2>⚙️ How It Works</h2>
    <ol>
        <li>User Sign In into the app and selects a friend to chat with.</li>
        <li>They type a message or use the microphone to convert speech to text.</li>
        <li>User can send message to his friend on clicking send button</li>
        <li>If no abusive content is found, the message is sent to the friend via Socket.IO.</li>
        <li>If abuse is detected, the message is not sent and is instead forwarded to the admin panel.</li>
    </ol>
