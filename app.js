const endpoint = "https://script.google.com/macros/s/AKfycbwSkZ2G1OAJ_PIPg9-4RpRaqPZ1IxACRK_w234KqsBstWxSqPW2KsL-M3--2ZZwhLcw/exec";

function submitForm() {
    // Access the form data using document.getElementById
    const data = document.getElementById('data').value;
    const myKey = document.getElementById('KEY').value;
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