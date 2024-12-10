const endpoint = "https://script.google.com/macros/s/AKfycbwSkZ2G1OAJ_PIPg9-4RpRaqPZ1IxACRK_w234KqsBstWxSqPW2KsL-M3--2ZZwhLcw/exec";
const myKey = "Hhuxx1";

const container = document.querySelector("section");

function createNew(parent , elementType, content, attributes = {}) {
    if (!parent) {
      console.error(`Parent element with ID "${parentId}" not found.`);
      return null; // Return null if parent doesn't exist
    }
  
    // Create a new element
    const newElement = document.createElement(elementType);
    newElement.textContent = content;
  
    // Set attributes if provided
    for (const [key, value] of Object.entries(attributes)) {
      newElement.setAttribute(key, value);
    }
  
    // Append the new element to the parent container
    parent.appendChild(newElement);
  
    // Return the created element
    return newElement;
}
  
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

function loadAbsensi(nickname){
    console.log("user is Active");
    createNew(container,"p","Mohon Tunggu Sebentar Developer Sedang Memasak");
};

function userIsInactive(nickname){
    console.log("user is inactive");
    createNew(container,"p","Sepertinya Nama Kamu Belum di Aktifkan Oleh Admin");
}

function loadUser(nickname) {
    const contents = {
        key :  myKey,
        action : "checkName",
        data: nickname
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
        console.log('Success: ', data); // Log the response from the server
        if (data.result == "OK"){
            loadAbsensi(nickname)
        }else{
            userIsInactive(nickname)
        }
    })
    .catch((error) => {
        console.error('Error:', error); // Log any error
    });
}

function onStart() {
    let nickname = getCookie('nickname'); // Check if the nickname cookie exists
    const nicknameSection = createNew(container,"div","");
    if (!nickname) {
        const welcomeMessage = createNew(nicknameSection,"h1","Sepertinya Anda Baru!");
        const nicknameForm = createNew(nicknameSection,"form","",{class:"small-form"});        
        createNew(nicknameForm,"label","Masukan Nama Lengkap :",{for:"nicknameInput"});
        const nicknameInput = createNew(nicknameForm,"input","",{type:"text", id:"nicknameInput",placeholder:"Nama Lengkap"});
        createNew(nicknameForm,"button","Konfirmasi",{type:"submit"});
        nicknameForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent page reload

        // Get the input value
        nickname = nicknameInput.value.trim();

        if (nickname) {
          // Save the nickname as a cookie
          setCookie('nickname', nickname, 365); // Save for 1 year
          welcomeMessage.textContent = `Selamat Datang, ${nickname}!`;
          nicknameSection.remove();
          location.reload(true);
        } else {
          alert('Please enter a valid nickname.');
        }
      });
    } else {
      // Use the saved nickname
      createNew(container,"h1",`Halo, ${nickname}!`);
      loadUser(nickname)
    }
  }

window.onload = () => {
    onStart();
};