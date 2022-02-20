async function signup(event) {
    event.preventDefault();
    const name = document.querySelector('#signUpName');
    const email = document.querySelector('#signUpEmail');
    const password = document.querySelector('#signUpPassword');
    const identity = document.querySelector('#signUpIdentity');

    try{
        const result = await firebase.auth().createUserWithEmailAndPassword(email.value, password.value);
        await result.user.updateProfile({
            displayName: "New Tutorhuntz User",
        });
        createUserCollection(result.user);
        //await result.user.sendEmailVerification();
        alert(`Verification Mail has been sent to the Email. Kindly Check.`);
    console.log(result);
    }catch(err){
        console.log(err);
        alert(err.message);
    }
    email.value="";
    password.value="";
}

async function login(event) {
    event.preventDefault();
    const email = document.querySelector('#loginEmail');
    const password = document.querySelector('#loginPassword');

    try{
    const result = await firebase.auth().signInWithEmailAndPassword(email.value, password.value);
        window.location.replace("dashboard.html");
        alert(`Welcome ${result.user.email}`);
    console.log(result);
    }catch(err){
        console.log(err);
        alert("Wrong Email/Password. Kindly check your Credentials, Kindly Try Again.");
        window.location.reload();
    }
    email.value="";
    password.value="";
}

async function resetpassword(event) {
    event.preventDefault();
    const email = document.querySelector('#resetemail');
    try {
        await firebase.auth().sendPasswordResetEmail(email.value);
        alert("Reset Link Sent to your Email. Kindly check.");
    }  catch(err) {
        console.log(err.message);
    }
}

function signout() {
    try {
        firebase.auth().signOut();
        alert(`Signed Out Successfully`);
        console.log("Signout Success");
        window.location.replace("index.html");
    } catch(error) {
        alert(error.message);
    }
}

const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log(user);
        //getuserinfo(user.uid);
        getuserInfoRealtime(user.uid);
    } else {
        getuserInfoRealtime(null);
        console.log("Signout Success");
    }
}); 

  
async function loginWithGoogle() {

    try {
        var provider = new firebase.auth.GoogleAuthProvider();
        const result = await firebase.auth().signInWithPopup(provider);
        console.log(result);
        window.location.replace("dashboard.html");
    } catch(err) {
        console.log(err);
    }
}


