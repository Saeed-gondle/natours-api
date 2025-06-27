// Import fetch for Node.js environment (required for Node.js < v18)
import fetch from 'node-fetch';

const apiOptions = {
    "name": "Muhammad Saeed",
    "email": "qasimgondle@gmail.com",
    "cnic": "33102 - 6779357 - 7",
    "gender": "Male",
    "user_province": "Punjab",
    "password": "Saeedjt@56",
    "password_confirmation": "Saeedjt@56"
};
fetch('https://bikes.punjab.gov.pk/register', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(apiOptions)
})
    .then(async response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new TypeError("Response was not JSON");
        }
        return response.json();
    })
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));