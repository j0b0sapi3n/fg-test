document.addEventListener('DOMContentLoaded', function () {
  console.log('Begins fg script');
  const form = document.querySelector('form[id^="hsForm_"]');

  if (typeof form !== 'undefined' && form !== null) {
    console.log('Form found:', form);
    form.addEventListener('submit', function (event) {
      event.preventDefault(); // Stop the form from submitting immediately

      // Collect form data
      const formData = new FormData(form);

      // Convert FormData to JSON for spam check
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      // Perform your spam check
      checkForSpam(data).then((isSpam) => {
        if (isSpam) {
          alert('This submission appears to be spam.');
        } else {
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
        }
      });
    });
  }
});

// Placeholder spam check function
function checkForSpam(data) {
  console.log('Checking for spam:', data);
  return new Promise((resolve) => {
    // Implement your spam check logic here
    // For now, we'll randomly decide that 10% of submissions are spam
    const isSpam = Math.random() < 0.1;
    resolve(isSpam);
  });
}
