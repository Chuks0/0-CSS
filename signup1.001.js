import {
    getAuth,
    deleteUser,
    onAuthStateChanged,
    sendEmailVerification,
    createUserWithEmailAndPassword,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    EmailAuthProvider,
    linkWithCredential,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

const auth = getAuth();
let coderesult;
const otplist = [...otp.children];

document.getElementById("signUpForm").onkeydown = function (e) {
    if (e.keyCode === 13) {
        signup();
    }
};

const optVerifyWrapper = document.querySelector(".otp-verification-wrapper");
const recaptchaVer = document.querySelector(".recaptcha-container-wrapper");
send.addEventListener("click", phoneAuth);
verify.addEventListener("click", codeverify);
signupButton.addEventListener("click", signup);
signupPasswordConfirm.addEventListener("keyup", passwordCheck);
signupError.style.display = "none";
optVerifyWrapper.style.display = "none";
toggleDisable(signupButton, true);
for (let i in otplist) {
    otplist[i].maxLength = "1";
    otplist[i].addEventListener("click", lastValue);
    otplist[i].addEventListener("keyup", function (event) {
        const key = event.key;
        if (key !== "Backspace" && key !== "Delete") {
            if (otplist[Number(i) + 1]) {
                otplist[Number(i) + 1].focus();
            }
        }
    });
    otplist[i].addEventListener("keydown", function (event) {
        const key = event.key;
        if (key === "Backspace" || key === "Delete") {
            if (i == otplist.length - 1 && otplist[i].value !== "")
                otplist[i].value = "";
            else if (otplist[i - 1]) otplist[i - 1].focus();
        }
    });
}

const URL = (url) =>
    "https://dev-dot-di-api-390914.du.r.appspot.com/api/v1" + url;
//const URL = (url) => "http://localhost:8080/api/v1" + url;

function passwordCheck() {
    let password = signupPassword.value;
    let passwordConfirm = signupPasswordConfirm.value;
    if ((password === "" && passwordConfirm === "") || passwordConfirm === "") {
        return;
        signupPassword.style.borderColor = "#ffffff00";
        signupPasswordConfirm.style.borderColor = "#ffffff00";
    }
    if (password === passwordConfirm) {
        console.log("passwords are the same");
        bluebox.style.backgroundColor = "green";
    } else {
        console.log("passwords are not the same");
        bluebox.style.backgroundColor = "red";
    }
}

function lastValue() {
    for (let i = otplist.length - 1; i >= 0; i--) {
        if (otplist[i].value === "") otplist[i].focus();
    }
}

function signup() {
    let email = signupEmail.value;
    let password = signupPassword.value;
    let passwordConfirm = signupPasswordConfirm.value;
    let username = signupName.value;
    let phone = signupPhone.value;

    if (password === passwordConfirm) {
        console.log("passwords are the same");
    } else {
        let errorMessage = "Passwords are not the same!";
        console.log("Error message: " + errorMessage);
        errorHandle(errorMessage);
        return;
    }

    // make sure phone is varifiewd
    let credential = EmailAuthProvider.credential(email, password);

    linkWithCredential(auth.currentUser, credential)
        .then((usercred) => {
            const user = usercred.user;
            console.log("Account linking success", user);
            const uid = user.uid;
            if (localStorage.getItem("token") != null) {
                let token = localStorage.getItem("token");
                postCreateFirestoreUser(
                    URL(`/users/new/guest`),
                    {
                        uid: uid,
                        email: email,
                        username: username,
                        phone: phone,
                    },
                    token
                ).then((data) => {
                    console.log(data);
                    window.location.replace(
                        "https://www.differencekorea.com/users/dashboard"
                    );
                });
            } else
                user.getIdToken().then((token) => {
                    localStorage.setItem("token", token);
                    postCreateFirestoreUser(
                        URL(`/users/new/guest`),
                        {
                            uid: uid,
                            email: email,
                            username: username,
                            phone: phone,
                        },
                        token
                    ).then((data) => {
                        console.log(data);
                        window.location.replace(
                            "https://www.differencekorea.com/users/dashboard"
                        );
                    });
                });
        })
        .catch((error) => {
            console.log("Account linking error", error);
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log("Error code: " + errorCode);
            console.log("Error message: " + errorMessage);
            errorHandle(error.message);
        });
}

render();

function render() {
    window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {},
        auth
    );
    recaptchaVerifier.render();
}
// function for send message
function phoneAuth() {
    var number = signupPhone.value;
    signInWithPhoneNumber(auth, number, window.recaptchaVerifier)
        .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            coderesult = confirmationResult;
            recaptchaVer.style.display = "none";
            optVerifyWrapper.style.display = "block";
            errorHandle();
        })
        .catch(function (error) {
            errorHandle(error.message);
        });
}
// function for code verify
function codeverify() {
    var code = getCodeValue();
    coderesult
        .confirm(code)
        .then((result) => {
            toggleDisable(signupButton, false);
            optVerifyWrapper.style.display = "none";
            errorHandle();
        })
        .catch((error) => {
            console.log(error.message);
            recaptchaVer.style.display = "block";
            optVerifyWrapper.style.display = "none";
            errorHandle(error.message);
        });
}

function getCodeValue() {
    let code = "";
    for (let i = 0; i < otplist.length; i++) {
        code += otplist[i].value;
    }
    return code;
}

async function postCreateFirestoreUser(url = "", data = {}, token) {
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
    return await response.json();
}

function toggleDisable(e, value) {
    if (value) {
        if (e.classList.contains("disabled")) {
        } else {
            e.classList.add("disabled");
        }
        e.style.pointerEvents = "none";
    } else {
        if (e.classList.contains("disabled")) {
            e.classList.remove("disabled");
        } else {
        }
        e.style.pointerEvents = "auto";
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
    return await response.json();
}

function errorHandle(msg = "") {
    const error = msg === "" ? false : true;
    if (error) console.log(msg);
    signupErrorMessage.innerText = error ? msg : "";
    if (error) signupError.style.display = "flex";
    else signupError.style.display = "none";
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        user.getIdToken()
            .then((token) => {
                localStorage.setItem("token", token);
            })
            .then(() => {
                const uid = user.uid;
                if (user.isAnonymous) {
                    deleteUser(user).then(() => logout());
                } else {
                    let token = localStorage.getItem("token");
                    getUserInfo(URL(`/users/${uid}`), token).then((data) => {
                        if (data.code != "402") {
                            errorHandle(
                                "User Already has an account! Please Log in"
                            );

                            toggleDisable(signupButton, true);
                        }
                    });
                }
            });
    }
});
