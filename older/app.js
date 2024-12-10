const endpoint = "https://script.google.com/macros/s/AKfycbwSkZ2G1OAJ_PIPg9-4RpRaqPZ1IxACRK_w234KqsBstWxSqPW2KsL-M3--2ZZwhLcw/exec";
const myKey = "Hhuxx1-hpq288hqls";
const cameraInput = document.getElementById('cameraInput');
const statuses = document.getElementById('statuses');
const canvasPreview = document.getElementById('canvasPreview');
const ctx = canvasPreview.getContext('2d');
var base64Image_data;

const locationResult = document.getElementById('locationResult');
function getLocation(){
    // Check if Geolocation API is supported
    if (!navigator.geolocation) {
      locationResult.textContent = "Geolocation is not supported by your browser.";
      return;
    }

    // Get the user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        locationResult.textContent = `Latitude: ${latitude}, Longitude: ${longitude}`;
      },
      (error) => {
        locationResult.textContent = `Error: ${error.message}`;
      }
    );
}

function submit(event) {
    // Prevent form submission from reloading the page
    event.preventDefault();
    // Prepare the data to be sent
    const contents = {
        key :  myKey,
        action : "submit",
        data: "test"
    };
    fetch(endpoint, 
    { 
        redirect: "follow",
        method: 'POST', // Sending a POST request
        headers: {
            'Content-Type': 'text/plain;charset=utf-8', // Specify content type as text
        },
        body: JSON.stringify(contents), // Convert data to JSON string
        }
    ) .then(response => response.json()) // Handle the response
    .then(data => {
        console.log('Success:', data); // Log the response from the server
        document.getElementById("output").innerHTML = '<pre id="CopyThis">' + data.data + '</pre>';
        getLocation();
    })
    .catch((error) => {
        console.error('Error:', error); // Log any error
    });
}

// Listen for file selection


function setCookie(name, value, days) {
    if (name == "nickname"){
        // send notify for registering nickname into notifURL
        const contents = {
            key :  myKey,
            action : "newName",
            data: value
        };

        fetch(endpoint, 
        { 
            redirect: "follow",
            method: 'POST', // Sending a POST request
            headers: {
                'Content-Type': 'text/plain;charset=utf-8', // Specify content type as text
            },
            body: JSON.stringify(contents), // Convert data to JSON string
            }
        ) .then(response => response.json()) // Handle the response
        .then(data => {
            console.log('Success: Notif', data); // Log the response from the server
        })
        .catch((error) => {
            console.error('Error:', error); // Log any error
        });
    }
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Convert days to milliseconds
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/`;
}

// Function to get a cookie
function getCookie(name) {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith(nameEQ)) {
        return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null; // Return null if the cookie doesn't exist
}

function handleNickname() {
    const welcomeMessage = document.getElementById('welcomeMessage');
    const nicknameSection = document.getElementById("nicknameSection");
    const nicknameForm = document.getElementById('nicknameForm');
    const nicknameInput = document.getElementById('nicknameInput');

    let nickname = getCookie('nickname'); // Check if the nickname cookie exists

    if (!nickname) {
      // Show the form for entering a nickname
      nicknameForm.style.display = 'block';

      // Prevent form submission from reloading the page
      nicknameForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent page reload

        // Get the input value
        nickname = nicknameInput.value.trim();

        if (nickname) {
          // Save the nickname as a cookie
          setCookie('nickname', nickname, 365); // Save for 1 year
          welcomeMessage.textContent = `Selamat Datang, ${nickname}!`;
          nicknameSection.remove();
        } else {
          alert('Please enter a valid nickname.');
        }
      });
    } else {
      // Use the saved nickname
      welcomeMessage.textContent = `Halo, ${nickname}!`;
      // Destroy nicknameSection
      nicknameSection.remove();
    }
  }

// Run the nickname handler on script load
handleNickname();