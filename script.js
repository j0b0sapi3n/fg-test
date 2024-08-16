const { checkForSpam } = require('./checkForSpam.js');

document.addEventListener('DOMContentLoaded', function () {
  function waitForForm() {
    return new Promise((resolve) => {
      const checkForm = setInterval(() => {
        const form = document.querySelector('form[id^="hsForm_"]');
        if (form) {
          clearInterval(checkForm);
          resolve(form);
        }
      }, 100); // Check every 100ms
    });
  }

  waitForForm().then((form) => {
    console.log('Form found:', form);

    form.addEventListener('submit', async function (event) {
      event.preventDefault(); // Stop the form from submitting immediately
      event.stopImmediatePropagation(); // Prevent other listeners on submit from submitting

      console.log('Gets inside waitForForm');

      // Collect form data
      const formData = new FormData(form);

      // Convert FormData to JSON for spam check
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      console.log('form data: :', data);

      // Perform your spam check
      try {
        const { isSpam, reasons, score } = await checkForSpam(data);
        console.log('isSpam:  ', isSpam);

        if (isSpam) {
          console.log('Spam detected for the following reasons:', reasons);
          alert('This submission appears to be spam.');
          return; // Exit the function to prevent form submission
        }

        console.log('Begin code below isSpam if condition');
        // If not spam, create an XMLHttpRequest to submit the form data
        const xhr = new XMLHttpRequest();
        xhr.open('POST', form.action, true);
        xhr.setRequestHeader(
          'Content-Type',
          'application/x-www-form-urlencoded'
        );

        // Convert the form data back to URL-encoded string
        const urlEncodedData = new URLSearchParams(formData).toString();

        xhr.onreadystatechange = function () {
          if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            alert('Form submitted successfully!');
            form.reset(); // Optional: reset the form after successful submission
          }
        };

        xhr.send(urlEncodedData);
      } catch (error) {
        console.error('Error during spam check:', error);
      }
    });
  });
});
