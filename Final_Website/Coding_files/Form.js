const contactForm = document.getElementById('surveyForm');
const successDiv = document.getElementById('successMessage');

contactForm.addEventListener('submit', function(event) {
    // Prevent the page from reloading or opening email programs
    event.preventDefault();

    // Get the client's name for a personalized message
    const name = document.getElementById('name').value;
    
    // Simulate a "send" process by fading out the form
    contactForm.style.opacity = '0';
    
    setTimeout(() => {
        contactForm.style.display = 'none';
        successDiv.style.display = 'block';
        
        // Optional: Show in the console that it was "sent" to your email
        console.log("Currently sending data to: cindyvn17@gmail.com");
        console.log("Content: Survey completed by " + name);
    }, 500); // A short delay makes it feel more "real"
});
