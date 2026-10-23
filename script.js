// ========================================
// BloodConnect - LocalStorage System
// ========================================


// ========================================
// 1. Load Donors from LocalStorage
// ========================================

let donors = JSON.parse(localStorage.getItem("bloodConnectDonors")) || [

    {
        id: Date.now() + 1,
        name: "Rahim Ahmed",
        blood: "A+",
        location: "Chittagong",
        phone: "01700000000"
    },

    {
        id: Date.now() + 2,
        name: "Karim Hasan",
        blood: "O+",
        location: "Dhaka",
        phone: "01800000000"
    },

    {
        id: Date.now() + 3,
        name: "Noman Khan",
        blood: "B+",
        location: "Chittagong",
        phone: "01900000000"
    }

];


// ========================================
// 2. Save Donors
// ========================================

function saveDonors() {

    localStorage.setItem(
        "bloodConnectDonors",
        JSON.stringify(donors)
    );

}


// ========================================
// 3. Mobile Menu
// ========================================

function toggleMobileMenu() {

    const menu =
        document.getElementById("mobileMenu");

    menu.classList.toggle("hidden");

}


// ========================================
// 4. Search Donors
// ========================================

function searchDonors() {

    const bloodGroup =
        document.getElementById("bloodGroup").value;

    const location =
        document.getElementById("location").value
        .trim()
        .toLowerCase();

    const results =
        document.getElementById("donorResults");


    const filteredDonors = donors.filter(donor => {

               if (donor.available === false) {
              return false;
            } 

   

        const bloodMatch =
            bloodGroup === "" ||
            donor.blood === bloodGroup;

        const locationMatch =
            location === "" ||
            donor.location.toLowerCase().includes(location);

        return bloodMatch && locationMatch;

    });


    results.innerHTML = "";


    // No donor found
    if (filteredDonors.length === 0) {

        results.innerHTML = `

            <div class="col-span-full text-center py-12">

                <div class="text-5xl mb-4">
                    🔍
                </div>

                <h3 class="text-xl font-bold">
                    No Donor Found
                </h3>

                <p class="text-gray-500 mt-2">
                    Try another blood group or location.
                </p>

            </div>

        `;

        return;
    }


    // Display donors
    filteredDonors.forEach(donor => {

        results.innerHTML += `

            <div class="donor-card">

                <div class="flex justify-between items-center">

                    <div>

                        <h3 class="text-xl font-bold">
                            ${donor.name}
                        </h3>

                        <p class="text-gray-500 mt-1">
                            📍 ${donor.location}
                        </p>

                    </div>


                    <div
                        class="bg-red-100 text-red-600
                        w-14 h-14 rounded-full
                        flex items-center justify-center
                        font-bold text-lg">

                        ${donor.blood}

                    </div>

                </div>


                <div class="mt-5">

                    <p class="text-gray-600">
                        📞 ${donor.phone}
                    </p>

                </div>


                <button
                    onclick="contactDonor('${donor.phone}')"
                    class="w-full mt-5 bg-red-600
                    text-white py-2 rounded-lg
                    hover:bg-red-700 transition">

                    📞 Contact Donor

                </button>

            </div>

        `;

    });

}


// ========================================
// 5. Contact Donor
// ========================================

function contactDonor(phone) {

    window.location.href =
        "tel:" + phone;

}


// ========================================
// 6. Donor Registration
// ========================================

document
    .getElementById("donorForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const name =
            document.getElementById("donorName").value.trim();

        const blood =
            document.getElementById("donorBlood").value;

        const age =
            document.getElementById("donorAge").value;

        const location =
            document.getElementById("donorLocation").value.trim();

        const phone =
            document.getElementById("donorPhone").value.trim();

        const lastDonation =
            document.getElementById("lastDonation").value;


       // Get currently logged-in user
const currentUser =
    JSON.parse(localStorage.getItem("bloodConnectCurrentUser"));

// Create donor
const newDonor = {

    id: Date.now(),

    // Connect donor with logged-in user
    userId: currentUser ? currentUser.id : null,

    email: currentUser ? currentUser.email : null,

    name: name,

    blood: blood,

    age: age,

    location: location,

    phone: phone,

    lastDonation: "",

    // New donor is available by default
    available: true
};


        // Add donor
        donors.push(newDonor);


        // Save to LocalStorage
        saveDonors();


        // Update statistics
        updateStatistics();


        // Clear form
        this.reset();


        // Success message
        alert(
            "🎉 Successfully registered as a blood donor!"
        );


        // Scroll to Find Blood
        document
            .getElementById("find-blood")
            .scrollIntoView({
                behavior: "smooth"
            });

    });


// ========================================
// 7. Emergency Requests
// ========================================

let requests =
    JSON.parse(
        localStorage.getItem("bloodConnectRequests")
    ) || [];


// Save requests
function saveRequests() {

    localStorage.setItem(
        "bloodConnectRequests",
        JSON.stringify(requests)
    );

}


// Emergency request form
document
    .getElementById("requestForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const patient =
            document.getElementById("patientName").value.trim();

        const blood =
            document.getElementById("requestBlood").value;

        const hospital =
            document.getElementById("hospital").value.trim();

        const location =
            document.getElementById("requestLocation").value.trim();

        const units =
            document.getElementById("units").value;

        const contact =
            document.getElementById("contact").value.trim();


        
const currentUser = JSON.parse(
    localStorage.getItem("bloodConnectCurrentUser")
);

const newRequest = {
    id: Date.now(),

    userId: currentUser ? currentUser.id : null,
    email: currentUser ? currentUser.email : null,

    patient: patient,
    blood: blood,
    hospital: hospital,
    location: location,
    units: Number(units),
    contact: contact,

    status: "Pending",
    date: new Date().toISOString()
};



        // Add request
        requests.push(newRequest);


        // Save request
        saveRequests();


        // Update statistics
        updateStatistics();


        // Clear form
        this.reset();


        alert(
            "🚨 Emergency blood request submitted successfully!"
        );

    });


// ========================================
// 8. Statistics
// ========================================

function updateStatistics() {

    const totalDonors =
        document.getElementById("totalDonors");

    const availableDonors =
        document.getElementById("availableDonors");

    const totalRequests =
        document.getElementById("totalRequests");

    const emergencyRequests =
        document.getElementById("emergencyRequests");


    if (totalDonors) {

        totalDonors.innerText =
            donors.length;

    }


    if (availableDonors) {
    availableDonors.innerText =
        donors.filter(
            donor => donor.available !== false
        ).length;
}


    if (totalRequests) {

        totalRequests.innerText =
            requests.length;

    }


    if (emergencyRequests) {

        emergencyRequests.innerText =
            requests.filter(
                request =>
                    request.status === "Pending"
            ).length;

    }

}


// ========================================
// 9. Initialize
// ========================================

updateStatistics();