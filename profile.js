
// ==========================================
// BLOODCONNECT USER PROFILE
// ==========================================

// Get logged-in user
const currentUser = getCurrentUser();


// If user is not logged in
if (!currentUser) {

    alert("🔐 Please login first.");

    window.location.href = "login.html";

}


// ==========================================
// Load Data
// ==========================================

let donors =
    JSON.parse(localStorage.getItem("bloodConnectDonors")) || [];

let requests =
    JSON.parse(localStorage.getItem("bloodConnectRequests")) || [];


// ==========================================
// Find Current User's Donor
// ==========================================

function getMyDonor() {

    if (!currentUser) {
        return null;
    }

    return donors.find(donor =>
        donor.userId === currentUser.id ||
        donor.email === currentUser.email
    ) || null;
}


// ==========================================
// Load Profile
// ==========================================

function loadProfile() {

    if (!currentUser) return;


    // Header
    document.getElementById("profileName").innerText =
        currentUser.name;

    document.getElementById("profileEmail").innerText =
        currentUser.email;


    // Form
    document.getElementById("profileFullName").value =
        currentUser.name || "";

    document.getElementById("profileEmailInput").value =
        currentUser.email || "";


    // Role
    document.getElementById("accountRole").innerText =
        currentUser.role === "admin" ? "Admin" : "User";


    // Load donor
    const myDonor = getMyDonor();


    if (myDonor) {

        document.getElementById("profileBlood").value =
            myDonor.blood || "";

        document.getElementById("profileAge").value =
            myDonor.age || "";

        document.getElementById("profileLocation").value =
            myDonor.location || "";

        document.getElementById("profilePhone").value =
            myDonor.phone || "";

        showDonorInformation(myDonor);

        updateAvailabilityUI(myDonor);

    } else {

        updateAvailabilityUI(null);

    }


    // Count requests
    const myRequests = requests.filter(request =>
        request.userId === currentUser.id ||
        request.email === currentUser.email
    );

    document.getElementById("requestCount").innerText =
        myRequests.length;


    // Donation count
    const donationCount =
        Number(currentUser.donationCount || 0);

    document.getElementById("donationCount").innerText =
        donationCount;


    // Show admin dashboard
    if (currentUser.role === "admin") {

        document
            .getElementById("adminDashboardBtn")
            .classList.remove("hidden");

    }

}


// ==========================================
// Save Profile
// ==========================================

document
    .getElementById("profileForm")
    .addEventListener("submit", function (event) {

        event.preventDefault();


        const name =
            document.getElementById("profileFullName").value.trim();

        const blood =
            document.getElementById("profileBlood").value;

        const age =
            document.getElementById("profileAge").value;

        const location =
            document.getElementById("profileLocation").value.trim();

        const phone =
            document.getElementById("profilePhone").value.trim();


        if (!name) {

            showMessage(
                "❌ Please enter your name.",
                "text-red-600"
            );

            return;

        }


        // ======================================
        // Update User
        // ======================================

        let users =
            JSON.parse(localStorage.getItem("bloodConnectUsers")) || [];


       
const userIndex = users.findIndex(user =>
    (currentUser.id != null &&
        user.id === currentUser.id) ||
    (user.email &&
        currentUser.email &&
        user.email.toLowerCase() ===
            currentUser.email.toLowerCase())
);

if (userIndex !== -1) {
    users[userIndex].name = name;

    localStorage.setItem(
        "bloodConnectUsers",
        JSON.stringify(users)
    );
} else {
    showMessage(
        "❌ Account not found. Please log in again.",
        "text-red-600"
    );
    return;
}



        // Update current user
        currentUser.name = name;

        localStorage.setItem(
            "bloodConnectCurrentUser",
            JSON.stringify(currentUser)
        );


        // ======================================
        // Create / Update Donor
        // ======================================

        let myDonor = getMyDonor();


        if (blood) {

            if (myDonor) {

                myDonor.name = name;
                myDonor.blood = blood;
                myDonor.age = age;
                myDonor.location = location;
                myDonor.phone = phone;

            } else {

                myDonor = {

                    id: Date.now(),

                    userId: currentUser.id,

                    email: currentUser.email,

                    name: name,

                    blood: blood,

                    age: age,

                    location: location,

                    phone: phone,

                    lastDonation: "",

                    available: true

                };

                donors.push(myDonor);

            }


            localStorage.setItem(
                "bloodConnectDonors",
                JSON.stringify(donors)
            );


            showMessage(
                "✅ Profile and donor information saved successfully!",
                "text-green-600"
            );


        } else {

            showMessage(
                "✅ Profile updated successfully. Select a blood group to become a donor.",
                "text-green-600"
            );

        }


        loadProfile();

    });


// ==========================================
// Availability Toggle
// ==========================================

function toggleAvailability() {

    let myDonor = getMyDonor();


    // If donor does not exist
    if (!myDonor) {

        const blood =
            document.getElementById("profileBlood").value;


        if (!blood) {

            alert(
                "🩸 Please select your blood group and save your profile first."
            );

            return;

        }


        const name =
            document.getElementById("profileFullName").value.trim();

        const age =
            document.getElementById("profileAge").value;

        const location =
            document.getElementById("profileLocation").value.trim();

        const phone =
            document.getElementById("profilePhone").value.trim();


        myDonor = {

            id: Date.now(),

            userId: currentUser.id,

            email: currentUser.email,

            name: name,

            blood: blood,

            age: age,

            location: location,

            phone: phone,

            lastDonation: "",

            available: true

        };


        donors.push(myDonor);


        localStorage.setItem(
            "bloodConnectDonors",
            JSON.stringify(donors)
        );


        loadProfile();

        return;

    }


    // Toggle
    myDonor.available =
        myDonor.available === false;


    localStorage.setItem(
        "bloodConnectDonors",
        JSON.stringify(donors)
    );


    updateAvailabilityUI(myDonor);
    showDonorInformation(myDonor);

}


// ==========================================
// Availability UI
// ==========================================

function updateAvailabilityUI(donor) {

    const text =
        document.getElementById("availabilityText");

    const button =
        document.getElementById("availabilityBtn");


    if (!donor) {

        text.innerText = "Not Registered";

        text.className =
            "font-bold text-gray-500";

        button.innerText =
            "🩸 Register as Donor";

        button.className =
            "px-6 py-3 rounded-lg font-bold bg-red-600 text-white hover:bg-red-700 transition";

        return;

    }


    if (donor.available !== false) {

        text.innerText =
            "🟢 Available";

        text.className =
            "font-bold text-green-600";

        button.innerText =
            "🔴 Set Unavailable";

        button.className =
            "px-6 py-3 rounded-lg font-bold bg-gray-900 text-white hover:bg-gray-700 transition";

    } else {

        text.innerText =
            "🔴 Unavailable";

        text.className =
            "font-bold text-red-600";

        button.innerText =
            "🟢 Set Available";

        button.className =
            "px-6 py-3 rounded-lg font-bold bg-green-600 text-white hover:bg-green-700 transition";

    }

}


// ==========================================
// Donor Information
// ==========================================

function showDonorInformation(donor) {

    const container =
        document.getElementById("donorInformation");


    const availability =
        donor.available !== false;


    container.innerHTML = `

        <div class="grid md:grid-cols-2 gap-4">

            <div class="p-4 bg-gray-50 rounded-xl">

                <p class="text-sm text-gray-500">
                    Blood Group
                </p>

                <p class="text-xl font-bold text-red-600">
                    ${donor.blood}
                </p>

            </div>


            <div class="p-4 bg-gray-50 rounded-xl">

                <p class="text-sm text-gray-500">
                    Location
                </p>

                <p class="text-xl font-bold">
                    ${donor.location || "Not provided"}
                </p>

            </div>


            <div class="p-4 bg-gray-50 rounded-xl">

                <p class="text-sm text-gray-500">
                    Phone
                </p>

                <p class="text-xl font-bold">
                    ${donor.phone || "Not provided"}
                </p>

            </div>


            <div class="p-4 bg-gray-50 rounded-xl">

                <p class="text-sm text-gray-500">
                    Availability
                </p>

                <p class="text-xl font-bold ${
                    availability
                        ? "text-green-600"
                        : "text-red-600"
                }">

                    ${
                        availability
                            ? "🟢 Available"
                            : "🔴 Unavailable"
                    }

                </p>

            </div>

        </div>
    `;

}


// ==========================================
// Message
// ==========================================

function showMessage(message, className) {

    const element =
        document.getElementById("profileMessage");

    element.innerText = message;

    element.className =
        "mt-3 font-medium " + className;


    setTimeout(() => {

        element.innerText = "";

    }, 4000);

}


// ==========================================
// Start
// ==========================================

loadProfile();
