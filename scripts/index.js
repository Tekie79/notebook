const apiUrl =
  "https://script.google.com/macros/s/AKfycbypWYG3Dbw1eziCA-kdMw0U1s0YG5NLMp0vbSQKc6Q242msTIhjEmKd_YPIG6K4qNT0rw/exec";

const loginNumber = document.querySelector(".login-phone");
const loginBtn = document.querySelector(".btn-login");
const errorMsg = document.querySelector(".error-msg");

const loginApi = " http://localhost:3000/pass";

const redirectLogin = async (phone) => {
  const response = await fetch(`${apiUrl}?action=read&table=phone`);
  const {data} = await response.json();

  // Check
  if (phone == data[0].phone) {
    console.log("redirect");
    window.location.href = "./main.html";
  } else {
    errorMsg.classList.remove("err-hide");
  }
};

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  redirectLogin(loginNumber.value);
});
