const endpoint = "https://script.google.com/macros/s/AKfycbwSkZ2G1OAJ_PIPg9-4RpRaqPZ1IxACRK_w234KqsBstWxSqPW2KsL-M3--2ZZwhLcw/exec";
const myKey = "Hhuxx1-hpq288hqls";
const cameraInput = document.getElementById('cameraInput');
const statuses = document.getElementById('statuses');
const canvasPreview = document.getElementById('canvasPreview');
const ctx = canvasPreview.getContext('2d');

var base64Image_data;
function submit() {
    event.preventDefault();
    // Access the form data using document.getElementById
    const data = document.getElementById('data').value;
    // Prepare the data to be sent
    const contents = {
        key :  myKey,
        action : "submit",
        data: data
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
        document.getElementById("output").innerHTML = '<pre id="CopyThis">' + data.data + '</pre>'
    })
    .catch((error) => {
        console.error('Error:', error); // Log any error
    });
}

// Listen for file selection
cameraInput.addEventListener('change', (event) => {
  const file = event.target.files[0];

  if (!file) {
    statuses.textContent = "No file selected.";
    return;
  }

  // Ensure the file is an image
  if (!file.type.startsWith('image/')) {
    statuses.textContent = "Selected file is not an image.";
    return;
  }

  // Use FileReader to read the image as Base64
  const reader = new FileReader();
  reader.onload = () => {
    const base64Image = reader.result.split(',')[1]; // Remove "data:image/*;base64," prefix
    // console.log(base64Image); // Base64 string (plain text)
    base64Image_data = base64Image;
    
    const img = new Image();
    img.onload = () => {
        // Resize the image
        const MAX_WIDTH = 800;
        const scaleFactor = MAX_WIDTH / img.width;

        canvasPreview.width = MAX_WIDTH;
        canvasPreview.height = img.height * scaleFactor;

        // Draw the resized image on canvas
        ctx.drawImage(img, 0, 0, canvasPreview.width, canvasPreview.height);

        // Update status
        statuses.textContent = "Image displayed successfully!";
    };

    img.onerror = () => {
       statuses.textContent = "Error loading image.";
    };

    img.src = reader.result; // Set the image source
  };


  reader.onerror = () => {
    console.error("Error reading file.");
    statuses.textContent = "Error reading file.";
  };

  reader.readAsDataURL(file); // Read file as Base64 string
});

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
          welcomeMessage.textContent = `Welcome, ${nickname}!`;
          nicknameForm.style.display = 'none'; // Hide the form
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