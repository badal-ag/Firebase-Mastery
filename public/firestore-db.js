const userDetails = document.querySelector('.userDetails');
const editProfile = document.querySelector('#editProfile');

function createUserCollection(user) {
    firebase.firestore().collection('users')
    .doc(user.uid)
    .set({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        phone: "",
        speciality: "",
        portfolioURL: "",
        createdAt: firebase.firestore.Timestamp.now(),
    })
}

async function getuserinfo(userID) {
    
    if(userID){
        const userInfoSnap = await firebase.firestore()
        .collection("users")
        .doc(userID)
        .get();

        const userInfo = userInfoSnap.data();

        if(userInfo){
            userDetails.innerHTML = `
            <h3>${userInfo.name}</h3>
            <h3>${userInfo.email}</h3>
            <h3>${userInfo.phone}</h3>
            <h3>${userInfo.speciality}</h3>
            <h3>${userInfo.portfolioURL}</h3>
            `;
        }
    } else {
        userDetails.innerHTML = `
            <h3>Please Sign in to Continue</h3>
            <button href="login.html">Sign In</h3>`
    }
}

async function getuserInfoRealtime(userID) {
    
    if(userID){

        const userdocRef = await firebase.firestore()
        .collection("users")
        .doc(userID);

        userdocRef.onSnapshot((doc) => {
            if(doc.exists) {
                const userInfo = doc.data();

                if(userInfo){
                    userDetails.innerHTML = `
                    <h3>${userInfo.name}</h3>
                    <h3>${userInfo.email}</h3>
                    <h3>${userInfo.phone}</h3>
                    <h3>${userInfo.speciality}</h3>
                    <h3>${userInfo.portfolioURL}</h3>
                    <button>Edit Profile</button>
                    `

                    editProfile["name"].value = userInfo.name;
                    editProfile["profileEmail"].value = userInfo.email;
                    editProfile["phone"].value = userInfo.phone; 
                    editProfile["speciality"].value = userInfo.speciality;
                    editProfile["portfolioURL"].value = userInfo.portfolioURL;

                    if(firebase.auth().currentUser.photoURL) {
                        document.querySelector('#noimg').src = firebase.auth().currentUser.photoURL
                    }
                }
            }
        })
    } else {
        userDetails.innerHTML = `
            <h3>Please Sign in to Continue</h3>
            <button href="login.html">Sign In</h3>`
    }
}

function updateUserProfile(event) {
    event.preventDefault();
    const userdocRef = firebase.firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid);

    userdocRef.update({
        name: editProfile["name"].value,
        email: editProfile["profileEmail"].value,
        phone: editProfile["phone"].value,
        speciality: editProfile["speciality"].value,
        portfolioURL: editProfile["portfolioURL"].value,
    })

}

function uploadImage(e) {
    console.log(e.target.files[0]);

    const uid = firebase.auth().currentUser.uid;
    const fileRef = firebase.storage().ref().child(`/users/${uid}/profile`);
    const uploadTask = fileRef.put(e.target.files[0]);

    uploadTask.on('state_changed', 
    (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if(progress=='100') alert('uploaded')
    }, 
    (error) => {
        console.log(error);
    }, 
    () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        console.log('File available at', downloadURL);
        firebase.auth().currentUser.updateProfile({
            photoURL: downloadURL
        });
        });
    }
);
}