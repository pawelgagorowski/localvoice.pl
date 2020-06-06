window.addEventListener('load', function() {
  let idToken;
  let accessToken;
  let expiresAt;
  let email;

  var webAuth = new auth0.WebAuth({
    domain: 'dev-6cnet9rr.eu.auth0.com',
    clientID: 'NqFkCbJy7V3RAsqgxqXm0g3mRgsmA6Dq',
    responseType: 'token id_token',
    scope: 'openid email profile',
    redirectUri: window.location.href
  });

  var loginBtn = document.getElementById('btn-login');

  loginBtn.addEventListener('click', function(e) {
    e.preventDefault();
    webAuth.authorize();
  });

   var loginStatus = document.querySelector('.container h4');
   var loginView = document.getElementById('login-view');

   // buttons and event listeners

   var loginBtn = document.getElementById('btn-login');
   var logoutBtn = document.getElementById('btn-logout');



   logoutBtn.addEventListener('click', logout);

   function handleAuthentication() {
     webAuth.parseHash(function(err, authResult) {
       if (authResult && authResult.accessToken && authResult.idToken) {
         console.log(authResult);
         window.location.hash = '';
         localLogin(authResult, function (email, idToken) {
           retrievingResults(email, idToken)
           displayButtons(email);
         });
         loginBtn.style.display = 'none';

       } else if (err) {

         console.log(err);
         alert(
           'Error: ' + err.error + '. Check the console for further details.'
         );
         displayButtons();
       }

     });
   }

   function localLogin (authResult, callback) {
     // Set isLoggedIn flag in localStorage
     localStorage.setItem('isLoggedIn', 'true');

     localStorage.setItem('token', JSON.stringify(authResult));
     // Set the time that the Access Token will expire at
     expiresAt = JSON.stringify(
       authResult.expiresIn * 1000 + new Date().getTime()
     );
     accessToken = authResult.accessToken;
     idToken = authResult.idToken;
     email = authResult.idTokenPayload.email;
     console.log(email)
     callback(email, idToken)
   }

   function renewTokens() {
       const token1 = localStorage.getItem('token');
       console.log(token1);
       const token = JSON.parse(token1);
       if (token && token.accessToken && token.idToken) {
         localLogin(token, function(email, idToken) {
           retrievingResults(email, idToken)
           displayButtons(email);
         });
       } else {
         alert('Could not get a new token');
         logout();
         displayButtons();
       }
   }

   function logout() {
     // Remove isLoggedIn flag from localStorage
     localStorage.removeItem('isLoggedIn');
     localStorage.removeItem('token');
     // Remove tokens and expiry time
     accessToken = '';
     idToken = '';
     expiresAt = 0;
     displayButtons();
   }

   function isAuthenticated() {
     // Check whether the current time is past the
     // Access Token's expiry time
     var expiration = parseInt(expiresAt) || 0;
     return localStorage.getItem('isLoggedIn') === 'true' && new Date().getTime() < expiration;
   }

   function displayButtons(email) {
     if (isAuthenticated()) {
       loginBtn.style.display = 'none';
       logoutBtn.style.display = 'inline-block';
       displayParagraphs(true)
     } else {
       loginBtn.style.display = 'inline-block';
       logoutBtn.style.display = 'none';
       displayParagraphs(false)
     }
   }

 if (localStorage.getItem('isLoggedIn') === 'true') {
  renewTokens();
  displayButtons()
  } else {
  displayButtons()
  handleAuthentication();
  }

});


function displayImage (statusCode) {
  if(statusCode == 403) {
    $('.image').attr("src", "https://english-project.s3.eu-central-1.amazonaws.com/pictures/dev/base+category/introduce+yourself/example-from-20.png")
  } else {
    $('.image').attr("src", "https://english-project.s3.eu-central-1.amazonaws.com/pictures/dev/base+category/introduce+yourself/example-from-20.png")
  }
}


function retrievingResults(email, idToken) {
  const status = location.href.split("=")[1]
  const env = (!status || status == "prod") ? "prod" : "test"
    $.ajax({
      method: 'GET',
      url: `https://api.localvoice.pl/learn/results?env=${env}`,
      // url: `http://localhost:3000/test/results?env=${env}`,
      headers: {
        'Authorization': `${idToken}`,
        'x-user': email,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
    })
    .done(resp => {
      console.log("result")
      // const body = JSON.parse(resp.body)
      sortingFunction(resp, email)
    })
    .catch(err => {
      console.log(err)
    })
}


function displayParagraphs (boolean) {
  if(boolean) {
    $('.container.winners h3').text("Pełna lista uczestników rywalizacji")
    $('.container.winners p').text("Pierwsze 10 osób każdego miesiąca otrzyma bilety do kina. Powodzenia!")
  } else {
    $('.list-group').empty();
    $('.container.winners h3').text("Zaloguj się aby zobaczyć listę uczestników")
    $('.container.winners p').text("")
  }
}

function millisToMinutesAndSeconds(millis) {
  const result = {};
  result.minutes = Math.floor(millis / 60000);
  result.seconds = ((millis % 60000) / 1000).toFixed(0);
  result.minutes + (result.seconds < 10 ? '0' : '') + result.seconds;
  return result;
}

function sortingFunction (response, email) {
  if(response.statusCode) {
    const statusCode = response.statusCode;
    return displayImage(statusCode)
  }
  console.log("sprawdzamy response")
  console.log(response)
  const users = response.results;
  const winners = response.listOfWinners;
  const sortedUsers = users.sort(function (a,b) {
    console.log(typeof a.result)
    return a.result - b.result
  })

const $userList = $('.list-group');
    $userList.empty();
    sortedUsers.forEach(function(item, i) {

      const score = millisToMinutesAndSeconds(item.result);
      if(item.user) {
        let div = document.createElement('div');
        $(div)
        .addClass('list-group-item color')
        .appendTo($userList)

        let place = document.createElement("p")
        $(place)
        .text(`miejsce ${i+1}`)
        .appendTo(div)

        let name = document.createElement("p")
        $(name)
        .addClass('winners-name')
        .text(`${item.given_name}`)
        .appendTo(div)

        let time = document.createElement("p")
        $(time)
        .text(`${score.minutes} min. i ${score.seconds} sek.`)
        .appendTo(div)

        let image = document.createElement("img")
        let j;
        j = i.toString();
        if(i > 9 ) {
          j = j.charAt(1)
        }
        $(image)
        .attr("src", item.picture ? item.picture : `https://d24xp1bilplfor.cloudfront.net/icons/${i}.png`)
        .appendTo(div)

        const boolean = winners.every(function (el) {
          return item._id != el
        })
        if(boolean) {
          let giftImage = document.createElement("img");
          $(giftImage)
          .addClass('gift-image')
          .attr("src", "https://english-project.s3.eu-central-1.amazonaws.com/icons/gift.png")
          .appendTo(div)
        }

      } else {
        console.log("jesteśmy w else")
        let div = document.createElement('div');
        $(div)
        .addClass('list-group-item')
        .appendTo($userList)

        let place = document.createElement("p")
        $(place)
        .text(`miejsce ${i+1}`)
        .appendTo(div)

        let name = document.createElement("p")
        $(name)
        .addClass('winners-name')
        .text(`${item.given_name}`)
        .appendTo(div)

        let time = document.createElement("p")
        $(time)
        .text(`${score.minutes} min. i ${score.seconds} sek.`)
        .appendTo(div)

        let image = document.createElement("img")
        let j;
        j = i.toString();
        if(i > 9 ) {
          j = j.charAt(1)
        }
        $(image)
        .attr("src", `https://d24xp1bilplfor.cloudfront.net/icons/${j}.png`)
        .appendTo(div)

        const boolean = winners.every(function (el) {
          return item._id != el
        })
        if(boolean) {
          let giftImage = document.createElement("img");
          $(giftImage)
          .addClass('gift-image')
          .attr("src", "https://english-project.s3.eu-central-1.amazonaws.com/icons/gift.png")
          .appendTo(div)
        }
      }
    });
    return
}
