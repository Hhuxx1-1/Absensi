const endpoint = "https://script.google.com/macros/s/AKfycbwSkZ2G1OAJ_PIPg9-4RpRaqPZ1IxACRK_w234KqsBstWxSqPW2KsL-M3--2ZZwhLcw/exec";

fetch(endpoint, 
    { 
        method: 'POST', 
        mode: 'no-cors', 
        headers: { 'Content-Type':'text/plain'},  
        body: 'name=JohnDoe&email=john.doe@example.com',
        redirect: 'follow'}
    ) .then(response => console.log('Request complete')) .catch(error => console.error('Error:', error));