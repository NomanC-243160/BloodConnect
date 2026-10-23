// ========================================
// BloodConnect Dashboard
// ========================================


// ========================================
// Load Data
// ========================================

// ========================================
// Admin Access Protection
// ========================================

if (!checkAdminAccess()) {
    throw new Error("Unauthorized access");
}

let donors =
    JSON.parse(
        localStorage.getItem("bloodConnectDonors")
    ) || [];


let requests =
    JSON.parse(
        localStorage.getItem("bloodConnectRequests")
    ) || [];



// ========================================
// Save Data
// ========================================

function saveDonors() {

    localStorage.setItem(
        "bloodConnectDonors",
        JSON.stringify(donors)
    );

}


function saveRequests() {

    localStorage.setItem(
        "bloodConnectRequests",
        JSON.stringify(requests)
    );

}



// ========================================
// Statistics
// ========================================

function updateDashboardStats() {

    document.getElementById("dashboardDonors")
        .innerText = donors.length;


    document.getElementById("dashboardAvailable")
    .innerText = donors.filter(
        donor => donor.available !== false
    ).length;


    document.getElementById("dashboardRequests")
        .innerText = requests.length;


    const emergency =
        requests.filter(
            request =>
                request.status === "Pending"
        );


    document.getElementById("dashboardEmergency")
        .innerText = emergency.length;

}



// ========================================
// Blood Groups
// ========================================

function showBloodGroups() {

    const container =
        document.getElementById("bloodGroups");


    const bloodGroups = [
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-"
    ];


    container.innerHTML = "";


    bloodGroups.forEach(group => {

        const count =
            donors.filter(
                donor =>
                    donor.blood === group
            ).length;


        const percentage =
            donors.length > 0
                ? (count / donors.length) * 100
                : 0;


        container.innerHTML += `

            <div>

                <div class="flex justify-between mb-2">

                    <div class="flex items-center gap-3">

                        <span
                            class="bg-red-100 text-red-600
                            font-bold px-3 py-1 rounded-full">

                            ${group}

                        </span>

                        <span class="text-gray-500">

                            ${count} donor${count !== 1 ? "s" : ""}

                        </span>

                    </div>


                    <span class="font-semibold">

                        ${Math.round(percentage)}%

                    </span>

                </div>


                <div class="w-full bg-gray-200
                            rounded-full h-3">

                    <div
                        class="bg-red-500 h-3 rounded-full"
                        style="width:${percentage}%">

                    </div>

                </div>

            </div>

        `;

    });

}



// ========================================
// Recent Donors
// ========================================

function showRecentDonors() {

    const container =
        document.getElementById("recentDonors");


    container.innerHTML = "";


    if (donors.length === 0) {

        container.innerHTML = `

            <div class="text-center py-8">

                <div class="text-4xl">
                    👥
                </div>

                <p class="text-gray-500 mt-3">
                    No donors registered yet.
                </p>

            </div>

        `;

        return;

    }


    const recentDonors =
        [...donors].reverse().slice(0, 5);


    recentDonors.forEach(donor => {

        container.innerHTML += `

            <div
                class="flex items-center justify-between
                p-4 bg-gray-50 rounded-xl">

                <div class="flex items-center gap-4">

                    <div
                        class="w-12 h-12 rounded-full
                        bg-red-100 text-red-600
                        flex items-center justify-center
                        font-bold">

                        ${donor.blood}

                    </div>


                    <div>

                        <h3 class="font-bold">
                            ${donor.name}
                        </h3>

                        <p class="text-sm text-gray-500">
                            📍 ${donor.location}
                        </p>

                    </div>

                </div>


                <a
                    href="tel:${donor.phone}"
                    class="text-red-600 font-semibold">

                    📞

                </a>

            </div>

        `;

    });

}



// ========================================
// Donor Management Table
// ========================================


function showDonorTable(donorList = donors) {

    const table =
        document.getElementById("donorTable");

    if (!table) return;


    // No donors
    if (donorList.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6"
                    class="p-8 text-center text-gray-500">

                    🩸 No donors found.

                </td>
            </tr>
        `;

        return;
    }


    table.innerHTML = donorList.map(donor => {

        const available =
            donor.available !== false;


        return `

            <tr class="border-b hover:bg-gray-50 transition">

                <!-- Name -->
                <td class="p-3 font-semibold">
                    ${donor.name}
                </td>


                <!-- Blood -->
                <td class="p-3">

                    <span class="inline-block
                                 bg-red-100
                                 text-red-700
                                 font-bold
                                 px-3
                                 py-1
                                 rounded-full">

                        ${donor.blood}

                    </span>

                </td>


                <!-- Location -->
                <td class="p-3 text-gray-600">
                    ${donor.location || "Not provided"}
                </td>


                <!-- Phone -->
                <td class="p-3">
                    ${donor.phone || "Not provided"}
                </td>


                <!-- Availability -->
                <td class="p-3">

                    ${
                        available

                        ? `
                            <span class="inline-flex
                                         items-center
                                         gap-1
                                         bg-green-100
                                         text-green-700
                                         px-3
                                         py-1
                                         rounded-full
                                         text-sm
                                         font-semibold">

                                🟢 Available

                            </span>
                          `

                        : `
                            <span class="inline-flex
                                         items-center
                                         gap-1
                                         bg-red-100
                                         text-red-700
                                         px-3
                                         py-1
                                         rounded-full
                                         text-sm
                                         font-semibold">

                                🔴 Unavailable

                            </span>
                          `
                    }

                </td>


                <!-- Actions -->
                <td class="p-3">

                    <div class="flex flex-wrap gap-2">

                        <button
                            onclick="editDonor(${donor.id})"
                            class="bg-blue-100
                                   text-blue-700
                                   px-3
                                   py-2
                                   rounded-lg
                                   hover:bg-blue-200">

                            ✏️ Edit

                        </button>


                        <button
                            onclick="toggleDonorAvailability(${donor.id})"
                            class="${
                                available
                                    ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                                    : "bg-green-100 text-green-700 hover:bg-green-200"
                            }
                            px-3
                            py-2
                            rounded-lg">

                            ${
                                available
                                    ? "🔴 Disable"
                                    : "🟢 Enable"
                            }

                        </button>


                        <button
                            onclick="deleteDonor(${donor.id})"
                            class="bg-red-100
                                   text-red-700
                                   px-3
                                   py-2
                                   rounded-lg
                                   hover:bg-red-200">

                            🗑️ Delete

                        </button>

                    </div>

                </td>

            </tr>

        `;

    }).join("");

}




// ========================================
// Delete Donor
// ========================================


function deleteDonor(id) {

    const donor =
        donors.find(donor => donor.id === id);


    if (!donor) {
        return;
    }


    const confirmed =
        confirm(
            `Are you sure you want to delete ${donor.name} from the donor list?`
        );


    if (!confirmed) {
        return;
    }


    donors =
        donors.filter(
            donor => donor.id !== id
        );


    saveDonors();


    refreshDashboard();


    alert(
        "✅ Donor deleted successfully."
    );

}




// ========================================
// Edit Donor
// ========================================

function editDonor(id) {

    const donor =
        donors.find(
            donor => donor.id === id
        );


    if (!donor) return;


    const newName =
        prompt(
            "Enter donor name:",
            donor.name
        );


    if (newName === null) return;


    const newLocation =
        prompt(
            "Enter location:",
            donor.location
        );


    if (newLocation === null) return;


    const newPhone =
        prompt(
            "Enter phone number:",
            donor.phone
        );


    if (newPhone === null) return;


    donor.name =
        newName.trim();


    donor.location =
        newLocation.trim();


    donor.phone =
        newPhone.trim();


    saveDonors();


    refreshDashboard();


    alert(
        "✅ Donor information updated!"
    );

}



// ========================================
// Emergency Requests
// ========================================

function showRequests() {

    const table =
        document.getElementById("requestTable");


    table.innerHTML = "";


    if (requests.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="text-center py-10 text-gray-500">

                    No emergency requests yet.

                </td>

            </tr>

        `;

        return;

    }


    [...requests].reverse().forEach(request => {

        let statusClass =
            "bg-yellow-100 text-yellow-700";


        if (request.status === "Fulfilled") {

            statusClass =
                "bg-green-100 text-green-700";

        }


        if (request.status === "Cancelled") {

            statusClass =
                "bg-red-100 text-red-700";

        }


        table.innerHTML += `

            <tr class="border-b hover:bg-gray-50">

                <td class="p-3 font-semibold">
                    ${request.patient}
                </td>


                <td class="p-3">

                    <span
                        class="bg-red-100 text-red-600
                        px-3 py-1 rounded-full font-bold">

                        ${request.blood}

                    </span>

                </td>


                <td class="p-3">
                    ${request.hospital}
                </td>


                <td class="p-3">
                    ${request.location}
                </td>


                <td class="p-3">
                    ${request.units}
                </td>


                <td class="p-3">

                    <select
                        onchange="changeRequestStatus(
                            ${request.id},
                            this.value
                        )"
                        class="${statusClass}
                        px-3 py-2 rounded-lg
                        font-semibold outline-none">

                        <option
                            value="Pending"
                            ${request.status === "Pending" ? "selected" : ""}>

                            Pending

                        </option>


                        <option
                            value="Fulfilled"
                            ${request.status === "Fulfilled" ? "selected" : ""}>

                            Fulfilled

                        </option>


                        <option
                            value="Cancelled"
                            ${request.status === "Cancelled" ? "selected" : ""}>

                            Cancelled

                        </option>

                    </select>

                </td>

            </tr>

        `;

    });

}



// ========================================
// Change Request Status
// ========================================

function changeRequestStatus(id, status) {

    const request =
        requests.find(
            request =>
                request.id === id
        );


    if (!request) return;


    request.status = status;


    saveRequests();


    refreshDashboard();

}



// ========================================
// Refresh Everything
// ========================================


function refreshDashboard() {
    updateDashboardStats();
    showBloodGroups();
    showRecentDonors();

    // Keep search and blood filter working after updates
    if (document.getElementById("donorSearch")) {
        filterDonors();
    } else {
        showDonorTable();
    }

    showRequests();
}


// Donor Availability ON/OFF
function toggleDonorAvailability(id) {
    const donor = donors.find(donor => donor.id === id);

    if (!donor) {
        alert("Donor not found.");
        return;
    }

    donor.available = donor.available === false;

    saveDonors();
    refreshDashboard();
}






// ========================================
// Start Dashboard
// ========================================

refreshDashboard();

// ========================================
// Show Admin Name
// ========================================

const currentAdmin = getCurrentUser();

if (currentAdmin) {

    const adminName =
        document.getElementById("adminName");

    if (adminName) {

        adminName.innerText =
            currentAdmin.name;

    }

}

function filterDonors() {

    const searchInput =
        document.getElementById("donorSearch");

    const bloodFilter =
        document.getElementById("bloodFilter");


    const searchText =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";


    const bloodGroup =
        bloodFilter
            ? bloodFilter.value
            : "";


    const filteredDonors =
        donors.filter(donor => {

            const name =
                (donor.name || "").toLowerCase();

            const location =
                (donor.location || "").toLowerCase();

            const phone =
                (donor.phone || "").toLowerCase();


            const matchesSearch =
                name.includes(searchText) ||
                location.includes(searchText) ||
                phone.includes(searchText);


            const matchesBlood =
                !bloodGroup ||
                donor.blood === bloodGroup;


            return matchesSearch && matchesBlood;

        });


    showDonorTable(filteredDonors);

}