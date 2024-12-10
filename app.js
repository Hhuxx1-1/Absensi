const endpoint = "https://script.google.com/macros/s/AKfycbwSkZ2G1OAJ_PIPg9-4RpRaqPZ1IxACRK_w234KqsBstWxSqPW2KsL-M3--2ZZwhLcw/exec";

fetch(endpoint, 
    { 
        method: 'POST', 
        headers: { 'Content-Type':'text/plain'},  
        body: 'name=JohnDoe&email=john.doe@example.com',
        redirect: 'follow'}
    ) .then(response => { 
        if   (response.ok) { return response.json();} 
        else { throw new Error('Network response was not ok.');}
    })
    .catch(error => console.error('Error:', error));
    