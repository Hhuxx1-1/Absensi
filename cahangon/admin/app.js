const endpoint = "https://script.google.com/macros/s/AKfycbwSkZ2G1OAJ_PIPg9-4RpRaqPZ1IxACRK_w234KqsBstWxSqPW2KsL-M3--2ZZwhLcw/exec";
const myKey = "CahAngon-demo";

var pageData =  { type : "none"};

const container = document.querySelector("section");

function setCookie(name, value, days) {
    if (name == "tokenCode"){
        // send notify for registering token into notifURL
        const contents = {
            key :  myKey,
            action : "tryLogin",
            token: value
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
            if (data.result == "OK"){
                createNew(container,"h1","Kode Valid");
                const date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Convert days to milliseconds
                const expires = `expires=${date.toUTCString()}`;
                document.cookie = `${name}=${value}; ${expires}; path=/`;
                location.reload(true);
            }else{
                createNew(container,"h1","Kode Invalid");
            }
        })
        .catch((error) => {
            console.error('Error:', error); // Log any error
        });
    }
}

function reloadPage() {
    location.reload(true); // Reloads the page
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

function tryAccess(){
    const contents = {
        key :  myKey,
        action : "getContent",
        token: token_
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

function onStart() {
    let tokenCode = getCookie('tokenCode'); // Check if the token cookie exists
    if (!tokenCode) {
        const formSection = createNew(container,"div","",{style:"width:85%"})
        createNew(formSection,"h1","Silahkan Masukan Kode Akses");
        const formKode = createNew(formSection,"form","",{class:"small-form"});        
        createNew(formKode,"label","Akses Kode :",{for:"tokenInput"});
        const nicknameInput = createNew(formKode,"input","",{type:"text", id:"nicknameInput"});
        createNew(formKode,"button","Konfirmasi",{type:"submit"});
        formKode.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent page reload

        const sendCode = createNew(formSection,"input","",{value:"Kirim Kode",onclick:"RequestCode()",class:"button"});
        
        // Get the input value
        token = nicknameInput.value.trim();

        if (token) {
          // Save the token as a cookie
          setCookie('tokenCode', token, 0.00694444); // Save for 10 minutes
          formSection.remove();
        } else {
          alert('Please enter a valid token.');
        }
      });
    } else {
      token_ = token;
      tryAccess();
    }
  }

window.onload = () => {
    onStart();
};