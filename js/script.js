/*
  File: script.js
  Author: CS100 Team
  Date Created: 23 July 2023
  Copyright: CSTU
  Description: JS code of CSTU Passport that validate with JS
*/

const config = {
  backendUrl: "http://localhost:8000/", // Default backend URL
};
const port = 8000;

function show() {

  // Get form elements by their IDs
  var fullName = document.getElementById("fullname").value;
  var studentID = document.getElementById("studentID").value;
  var email = document.getElementById("email").value;
  var workTitle = document.getElementById("workTitle").value;
  var activityType = document.getElementById("activityType").options[document.getElementById("activityType").selectedIndex].text; // Get selected option text
  var academicYear = document.getElementById("academicYear").value;
  var semester = document.getElementById("semester").value;
  var startDate = document.getElementById("startDate").value;
  var endDate = document.getElementById("endDate").value;
  var location = document.getElementById("location").value;
  var picture = document.getElementById("picture").files[0]; // Get the file object
  var description = document.getElementById("description").value;

  // Create a string with the gathered information
  var output = "<strong><span style='color: black;'>Full Name:</span></strong> " + fullName +
    "<br><strong><span style='color: black;'>Student ID:</span></strong> " + studentID +
    "<br><strong><span style='color: black;'>Email:</span></strong> " + email +
    "<br><strong><span style='color: black;'>Work/Activity Title:</span></strong> " + workTitle +
    "<br><strong><span style='color: black;'>Type of Work/Activity:</span></strong> " + activityType +
    "<br><strong><span style='color: black;'>Academic Year:</span></strong> " + academicYear +
    "<br><strong><span style='color: black;'>Semester:</span></strong> " + semester +
    "<br><strong><span style='color: black;'>Start Date/Time:</span></strong> " + startDate +
    "<br><strong><span style='color: black;'>End Date/Time:</span></strong> " + endDate +
    "<br><strong><span style='color: black;'>Location:</span></strong> " + location +
    "<br><strong><span style='color: black;'>Description:</span></strong> " + description;

  // Display the image on the page
  displayImage(picture);

  document.getElementById("demo").innerHTML = output;


}

function displayImage(imageFile) {
  var displayedImage = document.getElementById("displayedImage");
  if (imageFile) {
    var reader = new FileReader();
    reader.onload = function (e) {
      displayedImage.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
  } else {
    displayedImage.src = ""; // Clear the image if no file selected
  }
}


function colorr(x) {
  document.getElementById(x).style.background = "silver";
}
function upper() {
  let x = document.getElementById("fullname");
  x.value = x.value.toUpperCase();
}

// Function to validate Firstname and Lastname
function validateName() {
  const fullnameInput = document.getElementById("fullname");
  const names = fullnameInput.value.trim().split(" ");
  const errorElement = document.getElementById("fullnameError");

  if (names.length !== 2) {
    errorElement.textContent = "Please enter both your Firstname and Lastname.";
    return false;
  } else {
    errorElement.textContent = ""; // Clear the error message when valid
  }
  return true;
}

// Function to validate Student ID
function validateStudentID() {
  const studentIDInput = document.getElementById("studentID");
  const studentIDPattern = /^\d{10}$/;
  const errorElement = document.getElementById("studentIDError");

  if (!studentIDPattern.test(studentIDInput.value)) {
    errorElement.textContent = "Please enter a 10-digit Student ID.";
    return false;
  } else {
    errorElement.textContent = ""; // Clear the error message when valid
  }
  return true;
}

// Function to validate University Email
function validateEmail() {
  const emailInput = document.getElementById("email");
  const emailPattern = /^.+@dome\.tu\.ac\.th$/;
  const errorElement = document.getElementById("emailError");

  if (!emailPattern.test(emailInput.value)) {
    errorElement.textContent =
      "Please provide a valid university email in the format 'xxx.yyy@dome.tu.ac.th'.";
    return false;
  } else {
    errorElement.textContent = ""; // Clear the error message when valid
  }
  return true;
}

// Function to validate form inputs on user input
function validateFormOnInput() {
  validateName();
  validateStudentID();
  validateEmail();
}

// Function to fetch activity types from the backend
async function fetchActivityTypes() {
  try {
    const response = await fetch(`http://${window.location.hostname}:${port}/getActivityType`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Failed to fetch activity types.");
      return [];
    }
  } catch (error) {
    console.error("An error occurred while fetching activity types:", error);
    return [];
  }
}

// Function to populate activity types in the select element
function populateActivityTypes(activityTypes) {
  const activityTypeSelect = document.getElementById("activityType");

  for (const type of activityTypes) {
    const option = document.createElement("option");
    option.value = type.id;
    option.textContent = type.value;
    activityTypeSelect.appendChild(option);
  }
}

// Event listener when the page content has finished loading
document.addEventListener("DOMContentLoaded", async () => {
  const activityTypes = await fetchActivityTypes();
  populateActivityTypes(activityTypes);
});

// Function to submit the form
// Function to submit the form
async function submitForm(event) {
  event.preventDefault();

  // Validate form inputs before submission
  if (!validateName() || !validateStudentID() || !validateEmail()) {
    return;
  }

  const startDateInput = document.getElementById("startDate").value;
  const endDateInput = document.getElementById("endDate").value;
  const startDate = new Date(startDateInput);
  const endDate = new Date(endDateInput);

  if (endDate <= startDate) {
    alert("End datetime should be after the start datetime.");
    return;
  }

  // Create the data object to send to the backend
  const formData = new FormData(event.target);
  const data = {
    first_name: formData.get("fullname").split(" ")[0],
    last_name: formData.get("fullname").split(" ")[1],
    student_id: parseInt(formData.get("studentID")),
    email: formData.get("email"),
    title: formData.get("workTitle"),
    type_of_work_id: parseInt(formData.get("activityType")),
    academic_year: parseInt(formData.get("academicYear")) - 543,
    semester: parseInt(formData.get("semester")),
    start_date: formData.get("startDate"),
    end_date: formData.get("endDate"),
    location: formData.get("location"),
    description: formData.get("description")
  };

  console.log(data);

  try {
    // Send data to the backend using POST request
    const response = await fetch(`http://${window.location.hostname}:${port}/record`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log("Form data submitted successfully!");

      // Format JSON data for display
      const formattedData = Object.entries(responseData.data)
        .map(([key, value]) => `"${key}": "${value}"`)
        .join("\n");

      // Display success message with formatted data
      alert(responseData.message + "\n" + formattedData);

      document.getElementById("myForm").reset();

    } else {
      console.error("Failed to submit form data.");

      // Display error message
      alert("Failed to submit form data. Please try again.");
    }
  } catch (error) {
    console.error("An error occurred while submitting form data:", error);
  }
  function myFunction(x) {
    document.getElementById(x).style.background = "yellow";
  }
}

// Event listener for form submission
document.getElementById("myForm").addEventListener("submit", submitForm);

// Event listeners for input validation on user input
document.getElementById("fullname").addEventListener("input", validateName);
document
  .getElementById("studentID")
  .addEventListener("input", validateStudentID);
document.getElementById("email").addEventListener("input", validateEmail);

