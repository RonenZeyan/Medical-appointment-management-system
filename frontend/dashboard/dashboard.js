
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
    fetchLatestUsers();
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
        const response = await fetch("http://localhost:3000/api/appointment?status=existing", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });


        const appointments = await response.json();

        if (appointments.length === 0) {
            console.log("No Appointments found");
            displayAppointments(appointments);
            return;
        }
        console.log(appointments);

        // get date without time
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // sort appointments by date 
        const sortedAppointments = appointments.sort((a, b) =>
            new Date(a.appointmentDate) - new Date(b.appointmentDate)
        );

        //fetch 5 appointments today
        let todayAppointments = sortedAppointments.filter(appointment => {
            const appointmentDate = new Date(appointment.appointment_date);
            return appointmentDate == today;
        });
        // if there is no 5 appointments today then fetch the appointments in future
        if (todayAppointments.length < 5) {
            const futureAppointments = sortedAppointments.filter(appointment =>
                new Date(appointment.appointment_date) > today
            );
            todayAppointments = [...todayAppointments, ...futureAppointments].slice(0, 5);
        }

        // display data in appointments table 
        displayAppointments(todayAppointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
    }
}


// Fetch the 5 latest users
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
    table.innerHTML = "";
    latestUsers.forEach(user => {
        table.innerHTML += `
        <tr>
            <td>${user.full_name}</td>
            <td>${user.role}</td>
            <td>
                <button onclick='displayUserDetails(${JSON.stringify(user)})' style="cursor:pointer; background-color: transparent; border: none;"><svg height="30px" width="30px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 511.573 511.573" xml:space="preserve" fill="#0050d1" stroke="#0050d1"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g transform="translate(1 1)"> <path style="fill:#FFDD09;" d="M433.987,250.52c0,98.987-80.213,179.2-179.2,179.2s-179.2-80.213-179.2-179.2 s80.213-179.2,179.2-179.2S433.987,151.533,433.987,250.52"></path> <path style="fill:#FD9808;" d="M254.787,71.32c-4.267,0-8.533,0-12.8,0.853c93.013,5.973,166.4,83.627,166.4,178.347 S335,422.893,241.987,428.867c4.267,0,8.533,0.853,12.8,0.853c98.987,0,179.2-80.213,179.2-179.2S353.773,71.32,254.787,71.32"></path> <g> <polygon style="fill:#54C9FD;" points="288.92,327.32 288.92,233.453 288.92,199.32 212.12,199.32 212.12,233.453 237.72,233.453 237.72,327.32 203.587,327.32 203.587,361.453 237.72,361.453 288.92,361.453 323.053,361.453 323.053,327.32 "></polygon> <path style="fill:#54C9FD;" d="M280.387,139.587c0,14.507-11.093,25.6-25.6,25.6s-25.6-11.093-25.6-25.6 c0-14.507,11.093-25.6,25.6-25.6S280.387,125.08,280.387,139.587"></path> </g> <g> <path style="fill:#FFDD09;" d="M79.853,446.787c-2.56,0-4.267-0.853-5.973-2.56c-99.84-99.84-99.84-261.973,0-361.813 c3.413-3.413,8.533-3.413,11.947,0c3.413,3.413,3.413,8.533,0,11.947c-93.013,93.013-93.013,244.907,0,337.92 c3.413,3.413,3.413,8.533,0,11.947C84.12,445.933,82.413,446.787,79.853,446.787z"></path> <path style="fill:#FFDD09;" d="M429.72,446.787c-2.56,0-4.267-0.853-5.973-2.56c-3.413-3.413-3.413-8.533,0-11.947 c93.013-93.013,93.013-244.907,0-337.92c-3.413-3.413-3.413-8.533,0-11.947c3.413-3.413,8.533-3.413,11.947,0 c99.84,99.84,99.84,261.973,0,361.813C433.987,445.933,432.28,446.787,429.72,446.787z"></path> </g> <path d="M254.787,438.253c-103.253,0-187.733-84.48-187.733-187.733s84.48-187.733,187.733-187.733S442.52,147.267,442.52,250.52 S358.04,438.253,254.787,438.253z M254.787,79.853c-93.867,0-170.667,76.8-170.667,170.667s76.8,170.667,170.667,170.667 s170.667-76.8,170.667-170.667S348.653,79.853,254.787,79.853z"></path> <path d="M79.853,433.987c-2.56,0-4.267-0.853-5.973-2.56c-99.84-99.84-99.84-261.973,0-361.813c3.413-3.413,8.533-3.413,11.947,0 c3.413,3.413,3.413,8.533,0,11.947c-93.013,93.013-93.013,244.907,0,337.92c3.413,3.413,3.413,8.533,0,11.947 C84.12,433.133,82.413,433.987,79.853,433.987z"></path> <path d="M429.72,433.987c-2.56,0-4.267-0.853-5.973-2.56c-3.413-3.413-3.413-8.533,0-11.947c93.013-93.013,93.013-244.907,0-337.92 c-3.413-3.413-3.413-8.533,0-11.947c3.413-3.413,8.533-3.413,11.947,0c99.84,99.84,99.84,261.973,0,361.813 C433.987,433.133,432.28,433.987,429.72,433.987z"></path> <path d="M323.053,369.987H203.587c-5.12,0-8.533-3.413-8.533-8.533V327.32c0-5.12,3.413-8.533,8.533-8.533h25.6v-76.8H212.12 c-5.12,0-8.533-3.413-8.533-8.533V199.32c0-5.12,3.413-8.533,8.533-8.533h76.8c5.12,0,8.533,3.413,8.533,8.533v119.467h25.6 c5.12,0,8.533,3.413,8.533,8.533v34.133C331.587,366.573,328.173,369.987,323.053,369.987z M212.12,352.92h102.4v-17.067h-25.6 c-5.12,0-8.533-3.413-8.533-8.533V207.853h-59.733v17.067h17.067c5.12,0,8.533,3.413,8.533,8.533v93.867 c0,5.12-3.413,8.533-8.533,8.533h-25.6V352.92z"></path> <path d="M254.787,173.72c-18.773,0-34.133-15.36-34.133-34.133s15.36-34.133,34.133-34.133s34.133,15.36,34.133,34.133 S273.56,173.72,254.787,173.72z M254.787,122.52c-9.387,0-17.067,7.68-17.067,17.067c0,9.387,7.68,17.067,17.067,17.067 c9.387,0,17.067-7.68,17.067-17.067C271.853,130.2,264.173,122.52,254.787,122.52z"></path> </g> </g></svg></button>
            </td>
        </tr>
        `
    });
}

//display user details in modal
function displayUserDetails(user_details) {
    display_user_modal_section.classList.remove("hide");
    user_fullname_modal.textContent = user_details.full_name;
    user_email_modal.textContent = user_details.email;
    user_phone_modal.textContent = user_details.phone;
    user_registerdate_modal.textContent = new Date(user_details.createdAt).toLocaleDateString(); //display just date without time
}

//display appointment details in modal
function displayAppointmentDetails(appointment_details) {
    console.log(appointment_details);

    document.getElementById("display-appointment-modal-section").classList.remove("hide");
    document.getElementById("appointment-fullname-modal").textContent = appointment_details.patient_id.full_name;
    document.getElementById("appointment-email-modal").textContent = appointment_details.clinic_address.name;
    document.getElementById("appointment-phone-modal").textContent = appointment_details.doctor.full_name;
}

//display appointments in latest appointments table
function displayAppointments(latestAppointments) {
    console.log(latestAppointments);

    const table = document.getElementById("appointments-table-body");
    table.innerHTML = "";
    latestAppointments.length === 0 ? table.innerHTML = `<tr><td colspan="4" style="text-align: center; font-weight:bolder; font-size: 20px;">אין תורים להיום או בעתיד</td></tr>`
        :
        latestAppointments.forEach(appointment => {
            table.innerHTML += `
        <tr>
            <td>${appointment.patient_id.full_name}</td>
            <td>${appointment.medical_field.name}</td>
            <td>${appointment.clinic_address.name}</td>
            <td>
                <button onclick='displayAppointmentDetails(${JSON.stringify(appointment)})' style="cursor:pointer; background-color: transparent; border: none;">
                    <svg height="30px" width="30px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 511.573 511.573" xml:space="preserve" fill="#0050d1" stroke="#0050d1">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier"> <g transform="translate(1 1)"> <path style="fill:#FFDD09;" d="M433.987,250.52c0,98.987-80.213,179.2-179.2,179.2s-179.2-80.213-179.2-179.2 s80.213-179.2,179.2-179.2S433.987,151.533,433.987,250.52"></path>
                        <path style="fill:#FD9808;" d="M254.787,71.32c-4.267,0-8.533,0-12.8,0.853c93.013,5.973,166.4,83.627,166.4,178.347 S335,422.893,241.987,428.867c4.267,0,8.533,0.853,12.8,0.853c98.987,0,179.2-80.213,179.2-179.2S353.773,71.32,254.787,71.32"></path>
                        <g> <polygon style="fill:#54C9FD;" points="288.92,327.32 288.92,233.453 288.92,199.32 212.12,199.32 212.12,233.453 237.72,233.453 237.72,327.32 203.587,327.32 203.587,361.453 237.72,361.453 288.92,361.453 323.053,361.453 323.053,327.32 "></polygon>
                        <path style="fill:#54C9FD;" d="M280.387,139.587c0,14.507-11.093,25.6-25.6,25.6s-25.6-11.093-25.6-25.6 c0-14.507,11.093-25.6,25.6-25.6S280.387,125.08,280.387,139.587"></path> </g> <g> <path style="fill:#FFDD09;" d="M79.853,446.787c-2.56,0-4.267-0.853-5.973-2.56c-99.84-99.84-99.84-261.973,0-361.813 c3.413-3.413,8.533-3.413,11.947,0c3.413,3.413,3.413,8.533,0,11.947c-93.013,93.013-93.013,244.907,0,337.92 c3.413,3.413,3.413,8.533,0,11.947C84.12,445.933,82.413,446.787,79.853,446.787z"></path> <path style="fill:#FFDD09;" d="M429.72,446.787c-2.56,0-4.267-0.853-5.973-2.56c-3.413-3.413-3.413-8.533,0-11.947 c93.013-93.013,93.013-244.907,0-337.92c-3.413-3.413-3.413-8.533,0-11.947c3.413-3.413,8.533-3.413,11.947,0 c99.84,99.84,99.84,261.973,0,361.813C433.987,445.933,432.28,446.787,429.72,446.787z"></path> </g>
                        <path d="M254.787,438.253c-103.253,0-187.733-84.48-187.733-187.733s84.48-187.733,187.733-187.733S442.52,147.267,442.52,250.52 S358.04,438.253,254.787,438.253z M254.787,79.853c-93.867,0-170.667,76.8-170.667,170.667s76.8,170.667,170.667,170.667 s170.667-76.8,170.667-170.667S348.653,79.853,254.787,79.853z"></path> <path d="M79.853,433.987c-2.56,0-4.267-0.853-5.973-2.56c-99.84-99.84-99.84-261.973,0-361.813c3.413-3.413,8.533-3.413,11.947,0 c3.413,3.413,3.413,8.533,0,11.947c-93.013,93.013-93.013,244.907,0,337.92c3.413,3.413,3.413,8.533,0,11.947 C84.12,433.133,82.413,433.987,79.853,433.987z"></path> <path d="M429.72,433.987c-2.56,0-4.267-0.853-5.973-2.56c-3.413-3.413-3.413-8.533,0-11.947c93.013-93.013,93.013-244.907,0-337.92 c-3.413-3.413-3.413-8.533,0-11.947c3.413-3.413,8.533-3.413,11.947,0c99.84,99.84,99.84,261.973,0,361.813 C433.987,433.133,432.28,433.987,429.72,433.987z"></path>
                        <path d="M323.053,369.987H203.587c-5.12,0-8.533-3.413-8.533-8.533V327.32c0-5.12,3.413-8.533,8.533-8.533h25.6v-76.8H212.12 c-5.12,0-8.533-3.413-8.533-8.533V199.32c0-5.12,3.413-8.533,8.533-8.533h76.8c5.12,0,8.533,3.413,8.533,8.533v119.467h25.6 c5.12,0,8.533,3.413,8.533,8.533v34.133C331.587,366.573,328.173,369.987,323.053,369.987z M212.12,352.92h102.4v-17.067h-25.6 c-5.12,0-8.533-3.413-8.533-8.533V207.853h-59.733v17.067h17.067c5.12,0,8.533,3.413,8.533,8.533v93.867 c0,5.12-3.413,8.533-8.533,8.533h-25.6V352.92z"></path> <path d="M254.787,173.72c-18.773,0-34.133-15.36-34.133-34.133s15.36-34.133,34.133-34.133s34.133,15.36,34.133,34.133 S273.56,173.72,254.787,173.72z M254.787,122.52c-9.387,0-17.067,7.68-17.067,17.067c0,9.387,7.68,17.067,17.067,17.067 c9.387,0,17.067-7.68,17.067-17.067C271.853,130.2,264.173,122.52,254.787,122.52z"></path> </g> </g>
                    </svg>
                </button>
            </td>
        </tr>
        `
        });
}