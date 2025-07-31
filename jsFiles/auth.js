import { supabase } from './supabaseClient.js';

const emailInput = document.getElementById("emailInput");
const pwInput = document.getElementById("passwordInput");
const errorTxt = document.getElementById("errorTxt");

async function login(){
     errorTxt.style.display = "none";
    let emailIn = emailInput.value;
    let pw = pwInput.value;
    
    if(emailIn == "" || pw ==""){
        errorTxt.innerText = "incomplete feilds";
        errorTxt.style.display = "block";
    }
    else{
        const user = await supabase.auth.signInWithPassword({
            email: emailIn,
            password: pw,
        })
        if(user.error == null)
            window.location.href = 'index.html';
        else if(user.error.message === "Invalid login credentials"){
            errorTxt.innerText = "Email or password are incorrect";
            errorTxt.style.display = "block";
        }
        else{
            errorTxt.innerText = "Login failed: " + user.error.message;
            errorTxt.style.display = "block";
        }
    }
}

async function signUp(){
    errorTxt.style.display = "none";
    let emailIn = emailInput.value;
    let pw = pwInput.value;
    let pw2 = document.getElementById("passwordConfirm").value;
    
    if(emailIn == "" || pw =="" || pw2 ==""){
        errorTxt.innerText = "incomplete feilds";
        errorTxt.style.display = "block";
    }
    else if(!emailIn.includes("@") || !emailIn.includes(".")){
        errorTxt.innerText = "must use valid email address";
         errorTxt.style.display = "block";
    }
    else if(pw.length < 6){
        errorTxt.innerText = "password too short, must be at least 6 characters";
         errorTxt.style.display = "block";
    }
    else if(pw != pw2){
        errorTxt.innnerText = "passwords do not match";
        errorTxt.style.display = "block";
    }
    else{
        const user = await supabase.auth.signUp({
            email: emailIn,
            password: pw,
        })
        if(user.error == null)
            window.location.href = 'index.html';
        else{
            errorTxt.innerText = "Could not create account: " + user.error.message;
            errorTxt.style.display = "block";
        }
    }

}

//const user = await supabase.auth.getUser().data;

async function logOut(){
    const error = await supabase.auth.signOut();
    if(error != null){
        console.log("Logout error: ", error.message);
    }
    window.location.href = "auth.html";
}


//seting onclick listeners
if(document.getElementById("loginBtn") != null)
    document.getElementById("loginBtn").onclick = login;
if(document.getElementById("signUpBtn") != null)
    document.getElementById("signUpBtn").onclick = signUp;
if(document.getElementById("logoutBtn") != null)
    document.getElementById("logoutBtn").onclick = logOut;