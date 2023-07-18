import {
    getAuth,
    onAuthStateChanged,
    sendEmailVerification,
    createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

const auth = getAuth();
const username = document.getElementById("signupName");
const useremail = document.getElementById("signupEmail");
const userphone = document.getElementById("signupPhone");
const userdob = document.getElementById("signupDob");
const usergender = document.getElementById("signupGender");
const URL = (url) =>
    "https://dev-dot-di-api-390914.du.r.appspot.com/api/v1" + url;
//const URL = (url) => "http://localhost:8080/api/v1" + url;

document.getElementById("signUpForm").onkeydown = function (e) {
    if (e.keyCode === 13) {
        signup();
    }
};

signupButton.addEventListener("click", signup);
signupError.style.display = "none";

username.innerText =
    localStorage.getItem("cmsname") == null
        ? null
        : localStorage.getItem("cmsname");
useremail.innerText =
    localStorage.getItem("cmsemail") == null
        ? null
        : localStorage.getItem("cmsemail");
userphone.innerText =
    localStorage.getItem("cmsphone") == null
        ? null
        : localStorage.getItem("cmsphone");
userdob.innerText =
    localStorage.getItem("cmsdob") == null
        ? null
        : localStorage.getItem("cmsdob");
usergender.innerHTML =
    localStorage.getItem("cmsgender") == null
        ? usergender.innerHTML
        : "<option value='" +
          localStorage.getItem("cmsgender") +
          "'>" +
          localStorage.getItem("cmsgender") +
          "</option>";

async function init(uid) {
    const user = auth.currentUser;
    const data = await getUserInfo(URL(`/users/${uid}`), token);

    console.log(data);
    if (data != null) {
        if (!username) {
            localStorage.setItem("cmsname", data.username);
        }
        if (!useremail) {
            localStorage.setItem("cmsemail", data.email);
        }
        if (!userphone) {
            localStorage.setItem("cmsphone", data.phone);
        }
        if (data.dob != null) {
            localStorage.setItem("cmsdob", data.dob);
            userdob.placeholder = data.dob;
            userdob.disabled = true;
        }
        if (data.gender != null) {
            localStorage.setItem("cmsgender", data.gender);
            usergender.innerHTML =
                "<option value='" +
                data.gender +
                "'>" +
                data.gender +
                "</option>";
            usergender.disabled = true;
        }

        username.placeholder = data.username;
        username.disabled = true;
        useremail.placeholder = data.email;
        useremail.disabled = true;
        userphone.placeholder = data.phone;
        userphone.disabled = true;
    } else {
        console.log("404");
    }
}

async function getUserInfo(url = "", token) {
    const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + token,
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
    });
    return response.json();
}
async function postUpdateUser(url = "", data = {}, token) {
    const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + token,
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data),
    });
    return response.json();
}

async function signup() {
    const user = auth.currentUser;
    if (!user) {
        signupError.style.display = "flex";
        return;
    }

    const dob = signupDob.value;
    const gender = signupGender.value;
    const address = signupAddress.value;
    const purpose = signupPurpose.value;
    const referral = signupReferral.value;

    const result = await postUpdateUser(
        URL(`/users/new/student/${user.uid}`),
        {
            dob: dob,
            gender: gender,
            address: address,
            purpose: purpose,
            referral: referral,
        },
        localStorage.getItem("token")
    );

    if (result.Error) {
        console.log(result.Error); // did not even get to data
    } else {
        console.log(result.code); //200 - 400
        localStorage.setItem("cmsaddress", address);
        localStorage.setItem("cmspurpose", purpose);
        localStorage.setItem("cmsreferral", referral);
    }
}

// When already logged-in user goes to the SIGNUP PAGE, redirect the user to the dashboard
onAuthStateChanged(auth, (user) => {
    if (user) {
        if (user.emailVerified == true) {
            console.log("User is logged in!");
            console.log("Email: " + user.email);
            console.log("UID: " + user.uid);
            user.getIdToken().then((token) => {
                localStorage.setItem("token", token);
                init(user.uid);
            });
        } else {
            console.log("User not verified");
            window.location.replace(
                "https://www.differencekorea.com/auth/pending"
            );
        }
    } else {
        window.location.replace("https://differencekorea.com/auth/login");
    }
});
