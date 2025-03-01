
//get widgets + and create consts
let token;
const user_fullname_modal = document.getElementById("user-fullname-modal");
const user_phone_modal = document.getElementById("user-phone-modal");
const user_email_modal = document.getElementById("user-email-modal");
const user_registerdate_modal = document.getElementById("user-registerdate-modal");
const display_user_modal_section = document.getElementById("display-user-modal-section");

//get card widgets
const users_card = document.getElementById("users-number");
const doctors_card = document.getElementById("doctors-number");
const clinics_card = document.getElementById("clinics-number");
const medicalFields_card = document.getElementById("medicalfield-number");

//onload
window.addEventListener("load", () => {
    //authorized if admin access and not patient or dactor
    if (localStorage.getItem("role") !== "admin") {
        window.location.href = "../authorization/authorized.html"
    }
    token = window.localStorage.getItem("token");
    fetchLatestAppointments();
    // fetchLatestUsers();
    fetchData();
})

//functions 
async function fetchData() {
    try {
        let res = await fetch("http://localhost:3000/api/dashboard/general-num", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if (!res.ok) {
            if (res.status === 403) {
                window.location.href = "../authorization/authorized.html"
            }

            throw new Error("Failed to fetch numbers");
        }
        let nums = await res.json();
        console.log(nums);
        users_card.textContent = nums.users;
        doctors_card.textContent = nums.doctors;
        clinics_card.textContent = nums.clinics;
        medicalFields_card.textContent = nums.medical_fields;
    } catch (err) {
        console.error(err);
    }

}
async function fetchLatestAppointments() {
    try {
        const response = await fetch("http://localhost:3000/api/appointment/future-appointments", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        const appointments = await response.json();
        console.log(appointments); // צפה בנתונים שהתקבלו

        if (appointments.length === 0) {
            console.log("No Appointments found");
            return;
        }

        // get date without time
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // sort appointments by date
        const sortedAppointments = appointments.sort((a, b) =>
            new Date(a.appointmentDate) - new Date(b.appointmentDate)
        );

        // fetch 5 appointments for today
        let todayAppointments = sortedAppointments.filter(appointment => {
            const appointmentDate = new Date(appointment.appointmentDate);
            return appointmentDate >= today;
        });

        // if there are fewer than 5 appointments for today, fetch the upcoming appointments
        if (todayAppointments.length < 5) {
            const futureAppointments = sortedAppointments.filter(appointment =>
                new Date(appointment.appointmentDate) > today
            );

            // Combine the appointments for today and the future ones
            todayAppointments = [...todayAppointments, ...futureAppointments].slice(0, 5);
        }

        // display data in the appointments table
        displayAppointments(todayAppointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
    }
}

//display appointments in latest appointments table
    function displayAppointments(appointments) {
        const tableBody = document.getElementById("appointments-table-body");
        tableBody.innerHTML = ''; // מנקה את תוכן הטבלה לפני הצגת התורים

        appointments.length === 0 ? tableBody.innerHTML="<tr><td colspan='3' style = 'text-align: center; font-weight:bold' > No Appointments Found</td ></tr > ":
        appointments.forEach(appointment => {
            const row = document.createElement("tr");

            // יצירת תאים עבור שם המטופל, שם הרופא ותאריך הפגישה
            const patientCell = document.createElement("td");
            patientCell.textContent = appointment.patient_id
        const doctorCell = document.createElement("td");
        doctorCell.textContent = appointment.doctor; // מציג תעודת זהות של הרופא
        
        const dateCell = document.createElement("td");
        dateCell.textContent = new Date(appointment.appointmentDate).toLocaleDateString();

        // הוספת התאים לשורה
        row.appendChild(patientCell);
        row.appendChild(doctorCell);
        row.appendChild(dateCell);

        // הוספת השורה לגוף הטבלה
        tableBody.appendChild(row);
    });
}


// // Fetch the 5 latest users
 async function fetchLatestUsers() {
     try {
        const response = await fetch("http://localhost:3000/api/user", {
            method: "GET",
           headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        const users = await response.json();

        if (users.length === 0) {
            console.log("No users found");
            return;
        }

        // Sort users by registration date (we have a 'createdAt' field in Our User Collection)
        const latestUsers = users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

        // Create table dynamically
        displayUsers(latestUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

//display users in latest users table
function displayUsers(latestUsers) {
    const table = document.getElementById("users-table-body");
    latestUsers.forEach(user => {
        table.innerHTML += `
        <tr>
            <td>${user.full_name}</td>
            <td>${user.role}</td>
            <td>
            </td>
        </tr>`
    });
}

       
function logout() {
    localStorage.clear();
    sessionStorage.clear();

    window.location.href = "/frontend/login/login.html";
  }
    
    function updateDateTime() {
        const now = new Date();
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        
        const day = days[now.getDay()];
        const date = now.getDate();
        const month = months[now.getMonth()];
        const year = now.getFullYear();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');

        const formattedDateTime = `${day}, ${date} ${month} ${year} - ${hours}:${minutes}:${seconds}`;
        
        document.getElementById('current-date').innerText = formattedDateTime;
    }

    setInterval(updateDateTime, 1000); // Update every second
   

//display user details in modal
function displayUserDetails(user_details) {
    display_user_modal_section.classList.remove("hide");
    user_fullname_modal.textContent = user_details.full_name;
    user_email_modal.textContent = user_details.email;
    user_phone_modal.textContent = user_details.phone;
    user_registerdate_modal.textContent = new Date(user_details.createdAt).toLocaleDateString(); //display just date without time
}

//display appointments in latest appointments table
// function displayAppointments(appointments) {
//     const tableBody = document.getElementById("appointments-table-body");
//     tableBody.innerHTML = ''; // מנקה את תוכן הטבלה לפני הצגת התורים

//     appointments.forEach(appointment => {
//         const row = document.createElement("tr");
        
//         // יצירת תאים עבור שם המטופל, שם הרופא ותאריך הפגישה
//         const patientCell = document.createElement("td");
//         patientCell.textContent = appointment.patient_id;
        
//         const doctorCell = document.createElement("td");
//         doctorCell.textContent = appointment.doctor;
        
//         const dateCell = document.createElement("td");
//         dateCell.textContent = new Date(appointment.appointmentDate).toLocaleDateString();

//         // הוספת התאים לשורה
//         row.appendChild(patientCell);
//         row.appendChild(doctorCell);
//         row.appendChild(dateCell);

//         // הוספת השורה לגוף הטבלה
//         tableBody.appendChild(row);
//     });
// }

