$(document).ready(function() {
  let expiresAt;


  $(".my-box").hide();
  const $welcomeText = $('.my-top p');
  const token = JSON.parse(localStorage.getItem("token"))
  const name = token.idTokenPayload.given_name;
  $welcomeText.text(`Dzięki ${name}!`);
  $(".my-box").show(1000);

  function sendingData() {
    const status = location.href.split("#")[1]
    if(status) {
      return
    }

    const richData = localStorage.getItem('token');
    // localStorage.clear()
    const allData = JSON.parse(richData);
    let data = {}
    data.email = allData.idTokenPayload.email;
    data.name = allData.idTokenPayload.given_name;
    data.surname = allData.idTokenPayload.family_name;
    $.ajax({
      // url: 'http://localhost:3000/registration',
      url: 'https://api.localvoice.pl/v1/registration',
      method: 'POST',
      data: JSON.stringify(data),
      headers: {
        'Authorization': `${allData.idToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .done(function (data) {
      console.log(data)
    })
  }

sendingData()


})
