// ========================================
// BloodConnect Authentication System
// ========================================


// ========================================
// Users
// ========================================

let users =
    JSON.parse(
        localStorage.getItem("bloodConnectUsers")
    ) || [];


// ========================================
// Save Users
// ========================================

function saveUsers() {

    localStorage.setItem(
        "bloodConnectUsers",
        JSON.stringify(users)
    );

}


// ========================================
// Register
// ========================================

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("registerName")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("registerEmail")
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("registerPassword")
                    .value;


            const role =
                document
                    .getElementById("registerRole")
                    .value;


            const message =
                document.getElementById(
                    "registerMessage"
                );


            // Check existing email

            const existingUser =
                users.find(
                    user =>
                        user.email === email
                );


            if (existingUser) {

                message.innerText =
                    "❌ Email already registered.";

                message.className =
                    "text-center mt-4 text-sm text-red-600";

                return;

            }


            // Create user

            const newUser = {

                id: Date.now(),

                name: name,

                email: email,

                password: password,

                role: role

            };


            users.push(newUser);

            saveUsers();


            message.innerText =
                "✅ Account created successfully!";


            message.className =
                "text-center mt-4 text-sm text-green-600";


            setTimeout(() => {

                window.location.href =
                    "login.html";

            }, 1000);

        }
    );

}



// ========================================
// Login
// ========================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("loginPassword")
                    .value;


            const message =
                document.getElementById(
                    "loginMessage"
                );


            const user =
                users.find(
                    user =>
                        user.email === email &&
                        user.password === password
                );


            if (!user) {

                message.innerText =
                    "❌ Invalid email or password.";

                message.className =
                    "text-center mt-4 text-sm text-red-600";

                return;

            }


            // Save logged-in user

            localStorage.setItem(
                "bloodConnectCurrentUser",
                JSON.stringify(user)
            );


            message.innerText =
                "✅ Login successful!";

            message.className =
                "text-center mt-4 text-sm text-green-600";


            setTimeout(() => {

                if (user.role === "admin") {

                    window.location.href =
                        "dashboard.html";

                } else {

                    window.location.href =
                        "index.html";

                }

            }, 700);

        }
    );

}



// ========================================
// Check Admin Access
// ========================================

function checkAdminAccess() {

    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "bloodConnectCurrentUser"
            )
        );


    if (!currentUser) {

        alert(
            "🔐 Please login as an administrator."
        );

        window.location.href =
            "login.html";

        return false;

    }


    if (currentUser.role !== "admin") {

        alert(
            "⛔ Admin access required."
        );

        window.location.href =
            "index.html";

        return false;

    }


    return true;

}



// ========================================
// Logout
// ========================================

function logoutUser() {

    localStorage.removeItem(
        "bloodConnectCurrentUser"
    );


    window.location.href =
        "login.html";

}



// ========================================
// Show Current User
// ========================================

function getCurrentUser() {

    return JSON.parse(
        localStorage.getItem(
            "bloodConnectCurrentUser"
        )
    );

}