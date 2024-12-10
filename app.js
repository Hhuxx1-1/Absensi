const endpoint = "https://script.google.com/macros/s/AKfycbwSkZ2G1OAJ_PIPg9-4RpRaqPZ1IxACRK_w234KqsBstWxSqPW2KsL-M3--2ZZwhLcw/exec";
const myKey = "Hhuxx1-hpq288hqls";
var base64Image_data;
function submitForm() {
    // Access the form data using document.getElementById
    const data = document.getElementById('data').value;
    // Prepare the data to be sent
    const contents = {
        key :  myKey,
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

const cameraInput = document.getElementById('cameraInput');
const statuses = document.getElementById('statuses');

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
    console.log(base64Image); // Base64 string (plain text)
    statuses.textContent = "Image ready to send!";
    base64Image_data = base64Image;
    console.log(base64Image); // Base64 string (plain text)
  };

  reader.onerror = () => {
    console.error("Error reading file.");
    statuses.textContent = "Error reading file.";
  };

  reader.readAsDataURL(file); // Read file as Base64 string
});