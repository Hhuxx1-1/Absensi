const endpoint = "https://script.google.com/macros/s/AKfycbwSkZ2G1OAJ_PIPg9-4RpRaqPZ1IxACRK_w234KqsBstWxSqPW2KsL-M3--2ZZwhLcw/exec";

fetch(endpoint, 
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify({ name: 'John Doe', email: 'john.doe@example.com' }) }) 
    .then(response => response.json()) 
    .then(data => console.log(data)) 
    .catch(error => console.error('Error:', error)
);