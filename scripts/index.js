const loginNumber = document.querySelector(".login-phone");
const loginBtn = document.querySelector(".btn-login");
const errorMsg = document.querySelector(".error-msg");

const loginApi = " http://localhost:3000/pass";

const redirectLogin = async (phone) => {
  const response = await fetch(loginApi);
  const data = await response.json();

  // Check
  if (phone == data.phone) {
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
