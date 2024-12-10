const endpoint = "https://script.google.com/macros/s/AKfycbwSkZ2G1OAJ_PIPg9-4RpRaqPZ1IxACRK_w234KqsBstWxSqPW2KsL-M3--2ZZwhLcw/exec";
const myKey = "Hhuxx1";
var base64Image_data;
var divSubmit;
var submitBtn;
var S_Latitude;
var S_Longitude;
var ctx;
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
            if (data.result == "CreatedNew"){
                createNew(container,"notif","<h1>Successfully Created</h1>");
            }
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Convert days to milliseconds
            const expires = `expires=${date.toUTCString()}`;
            document.cookie = `${name}=${value}; ${expires}; path=/`;
            location.reload(true);
        })
        .catch((error) => {
            console.error('Error:', error); // Log any error
        });
    }
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


function getLocation(){
    // Check if Geolocation API is supported
    if (!navigator.geolocation) {
      createNew(container,"h6","Mohon Hidupkan Lokasi Anda",{class:"notif"});
      return;
    }
    const locationResult = createNew(container,"h6","",{class:"notif"});
    // Get the user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        locationResult.textContent = `Latitude: ${latitude}, Longitude: ${longitude}`;
        S_Latitude = latitude;
        S_Longitude = longitude;
      },
      (error) => {
        locationResult.textContent = `Error: ${error.message}`;
      }
    );
}

function cameraCaptureListener(cameraInput,form,statuses){
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

                if (!divSubmit) {
                    divSubmit = createNew(form, "div", "", {id: "divSubmit"});
                }
                if (!submitBtn) {
                    submitBtn = createNew(divSubmit, "input", "", {value: "submit", type: "submit"});
                    getLocation();
                }
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
}

function loadP(nickname) {
    console.log("Tampilkan Halaman Presensi");
    const previewImage   = createNew(container,"div","",{id:"previewImage"});
    const canvas         = createNew(previewImage,"canvas","",{id:"canvasPreview",style:"max-width: 100%;"})
    const form           = createNew(container,"form","");
    const statuses       = createNew(form,"p","",{class:"info"});
    const wrapperCapture = createNew(form,"div","");
    const cameraInput    = createNew(wrapperCapture,"input","",{ type:"file" , id:"cameraInput" ,  accept:"image/*" , capture:"environment"});
    const labelCapture   = createNew(wrapperCapture,"label","Ambil Foto",{for:"cameraInput"});
    ctx = canvas.getContext('2d');
    cameraCaptureListener(cameraInput,form,statuses);
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent page reload
        const contents = {
            key :  myKey,
            action : "submit",
            data: nickname,
            image: base64Image_data,
            lat : S_Latitude,
            long: S_Longitude
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
        })
        .catch((error) => {
            console.error('Error:', error); // Log any error
        });
    });
}

function loadNP(nickname) {
    console.log("Tampilkan Halaman Sudah Melakukan Presensi Hari Ini");
    createNew(container,"h2","Anda Sudah Melakukan Presensi");
}

function loadAbsensi(nickname){
    console.log("user is Active");
    const loader = createNew(container,"p","Mohon Tunggu Sebentar",{class:"loader"});

    const contents = {
        key :  myKey,
        action : "cekPresence",
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
        loader.remove();
        if (data.result == "OK"){
            loadNP(nickname)
        }else{
            loadP(nickname)
        }
    })
    .catch((error) => {
        console.error('Error:', error); // Log any error
    });

};

function userIsInactive(nickname){
    console.log("user is inactive");
    createNew(container,"p","Sepertinya Nama Kamu Belum di Aktifkan Oleh Admin");
}

function loadUser(nickname) {

    // validate input nickname 
    if (typeof nickname !== 'string') {
        throw new Error('Nickname must be a string');
    }

    // Ensure the nickname is not empty and has a length between 3 and 20 characters
    if (nickname.trim().length === 0) {
        throw new Error('Nickname cannot be empty');
    }

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