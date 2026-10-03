
let accounts = JSON.parse(localStorage.getItem("accounts")) || [];

function showLogin() {

    document.getElementById("loginPage").classList.remove("hidden");
    document.getElementById("signupPage").classList.add("hidden");

}

function showSignup() {

    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("signupPage").classList.remove("hidden");

}

function signup(event) {

    event.preventDefault();

    const name =
        document.getElementById("signupName").value.trim();

    const username =
        document.getElementById("signupUsername").value.trim();

    const email =
        document.getElementById("signupEmail").value.trim();

    const password =
        document.getElementById("signupPassword").value;

    const confirmPassword =
        document.getElementById("signupConfirmPassword").value;

    const role =
        document.getElementById("signupRole").value;

    if (password !== confirmPassword) {

        alert("Passwords do not match!");

        return;
    }
    const usernameExists = accounts.some(
        account =>
            account.username.toLowerCase() === username.toLowerCase()
    );

    if (usernameExists) {

        alert("Username already exists!");

        return;
    }

    const emailExists = accounts.some(
        account =>
            account.email.toLowerCase() === email.toLowerCase()
    );

    if (emailExists) {

        alert("Email already registered!");

        return;
    }

    const newAccount = {

        id: Date.now(),

        name: name,

        username: username,

        email: email,

        password: password,

        role: role

    };


    accounts.push(newAccount);

    localStorage.setItem(
        "accounts",
        JSON.stringify(accounts)
    );


    alert("Account created successfully! Please login.");

    document.getElementById("signupName").value = "";
    document.getElementById("signupUsername").value = "";
    document.getElementById("signupEmail").value = "";
    document.getElementById("signupPassword").value = "";
    document.getElementById("signupConfirmPassword").value = "";
    document.getElementById("signupRole").value = "";


    showLogin();

    document.getElementById("loginUsername").value = username;

}

function login(event) {

    event.preventDefault();


    const username =
        document.getElementById("loginUsername").value.trim();

    const password =
        document.getElementById("loginPassword").value;

    const account = accounts.find(
        user =>
            user.username.toLowerCase() === username.toLowerCase()
            &&
            user.password === password
    );


    if (!account) {

        alert("Invalid username or password!");

        return;
    }

    localStorage.setItem(
        "currentUser",
        JSON.stringify(account)
    );

    if (account.role === "user") {

        window.location.href = "user.html";

    }

    else if (account.role === "admin") {

        window.location.href = "admin.html";

    }

    else {

        alert("Invalid account role!");

    }

}