window.addEventListener('load', function() {
  let idToken;
  let accessToken;
  let expiresAt;
  let email;

  let $firstPositionButton = $('#firstPosition');
  let $secondPositionButton = $('#secondPosition');
  let $month = $('.month');

  const english_month_array = ["january", "february", "march", "april", "may", "june", "july", "august", 'september', 'october', 'november', 'december']
  const polish_month_array = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", 'Wrzesień', 'Październik', 'Listopad', 'Grudzień']

  function changeLanguageMonth(month) {
    switch(month) {
  case "january":
    return "styczeń"
    break;
  case "february":
    return "luty"
    break;
  case "march":
    return "marzec"
    break;
  case "april":
    return "kwiecień"
    break;
  case "may":
    return "maj"
    break;
  case "june":
    return "czerwiec"
  break;
  case "july":
    return "lipiec"
    break;
  case "august":
    return "sierpień"
    break;
  case "september":
    return "wrzesień"
    break;
  case "october":
    return "październik"
  break;
  case "november":
    return "listopad"
    break;
  case "december":
    return "grudzień"
    break;
  default:
    return month
}
  }




  $firstPositionButton.on('click', function () {
    console.log("$firstPositionButton")
    const tempToken = localStorage.getItem('token');
    const token = JSON.parse(tempToken);
    if (token && token.accessToken && token.idToken) {
      localLogin(token, function(email, idToken) {
        const month = getCurrentMonth("english")
        retrievingResults(email, month, idToken);
      });
    }
  })

  $secondPositionButton.on('click', function () {
    console.log("$secondPositionButton")
    const tempToken = localStorage.getItem('token');
    const token = JSON.parse(tempToken);
    if (token && token.accessToken && token.idToken) {
      localLogin(token, function(email, idToken) {
        const month = getPreviousMonth("english")
        retrievingResults(email, month, idToken);
      });
    }
  })


  function getCurrentMonth(language) {
    const array = (language == "polish") ? polish_month_array : english_month_array;
    const d = new Date();
    const n = d.getMonth();

    return array[n]
  }

  function getPreviousMonth(language) {
    const array = (language == "polish") ? polish_month_array : english_month_array;
    const d = new Date();
    let n = d.getMonth();
    if(n == 0) {
      n = 11
      return array[n]
    } else {
      return array[n-1]
    }
  }


  function identifyMonth() {
    const currentMonth = getCurrentMonth("polish");
    const previousMonth = getPreviousMonth("polish")
    $("#firstPosition").text(currentMonth);
    $("#secondPosition").text(previousMonth);
  }


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
           const month = getCurrentMonth("english")
           retrievingResults(email, month, idToken)
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
           const month = getCurrentMonth("english")
           retrievingResults(email, month, idToken)
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
     console.log("displayButtons")
     if (isAuthenticated()) {
       loginBtn.style.display = 'none';
       logoutBtn.style.display = 'inline-block';
       identifyMonth();
       $month.css("display", "inline-block")
       displayParagraphs(true)
     } else {
       console.log("else")
       loginBtn.style.display = 'inline-block';
       logoutBtn.style.display = 'none';
       $month.css("display", "none");
       cleaning();
       displayImageByLogin();
       displayParagraphs(false);
     }
   }

 if (localStorage.getItem('isLoggedIn') === 'true') {
  renewTokens();
  displayButtons();
  } else {
  displayButtons();
  handleAuthentication();
  }

  function displayImageByLogin() {
    const media = window.matchMedia("(max-width: 800px)")
    setImageByLogin(media)
  }

  function setImageByLogin(media) {
    if (media.matches) {
      $('.image').attr("src", "https://english-project.s3.eu-central-1.amazonaws.com/forntEndInformartions/login-on-site-first-mobile.png")
    } else {
      $('.image').attr("src", "https://english-project.s3.eu-central-1.amazonaws.com/forntEndInformartions/login-on-site-first.png")
    }
  }

  function displayImage (statusCode) {
    console.log("displayImage")
    const media = window.matchMedia("(max-width: 800px)")
    setImage(media, statusCode)
  }
// https://english-project.s3.eu-central-1.amazonaws.com/forntEndInformartions/error-mobile.png
  function setImage(media, statusCode) {
    if (media.matches) {
      if(statusCode == 406) {
        $('.image').attr("src", "https://english-project.s3.eu-central-1.amazonaws.com/forntEndInformartions/no-one-on-list-mobile.png")
      } else if(statusCode == 403) {
        $('.image').attr("src", "https://english-project.s3.eu-central-1.amazonaws.com/forntEndInformartions/login-first-mobile.png")
      } else {
        $('.image').attr("src", "https://english-project.s3.eu-central-1.amazonaws.com/forntEndInformartions/error-mobile.png")
      }
    } else {
      if(statusCode == 406) {
        $('.image').attr("src", "https://english-project.s3.eu-central-1.amazonaws.com/forntEndInformartions/no-one-on-list.png")
      } else if(statusCode == 403) {
        $('.image').attr("src", "https://english-project.s3.eu-central-1.amazonaws.com/forntEndInformartions/login-first.png")
      } else {
        $('.image').attr("src", "https://english-project.s3.eu-central-1.amazonaws.com/forntEndInformartions/error.png")
      }
    }
  }


  function retrievingResults(email, month, idToken) {
    const url_string = window.location.href;
    const url = new URL(url_string);
    const env = url.searchParams.get("env") ? url.searchParams.get("env") : "test";
    console.log(env);
    const business = url.searchParams.get("business") ? url.searchParams.get("business") : "";
    console.log(business);
    const course = url.searchParams.get("course") ? url.searchParams.get("course") : "";
    console.log(course);
    console.log("month", month)
    cleaning();
    console.log("email", email);
    $.ajax({
      method: 'GET',
      // url: `https://api.localvoice.pl/learn/results?env=${env}&month=${month}&business=${business}`,
      url: `http://localhost:3000/test/results?env=${env}&month=${month}&business=${business}&course=${course}`,
      headers: {
        'Authorization': `${idToken}`,
        'X-User': email,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
    })
    .done(resp => {
      console.log("result");
      console.log(resp);
      sortingFunction(resp, month, email);
    })
    .catch(err => {
      $userList.empty();
      sortingFunction(resp, month, email);
    })
  }

  function cleaning() {
    $('.image').attr("src","")
    const $userList = $('.list-group');
    $userList.empty();
  }

  function displayParagraphs (boolean) {
    if(boolean) {
      $('.container.winners h3').text("Pełna lista uczestników rywalizacji")
      $('.container.winners p').text("Pierwsze 20% osób każdego miesiąca otrzyma bilety do kina. Pamiętaj, że laureaci poprzedniego miesiąca nie są tym razem brani pod uwagę przy rozdzielaniu nagród. Dajmy szansę innym :) Powodzenia!")
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

  function sortingFunction (response, month, email) {
    try {
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

        console.log("$userList")
        $userList.empty();
        const h3 = document.createElement('h3');
        let properMonth = changeLanguageMonth(month)
        $(h3)
        .text(`Pełna lista uczestników rywalizacji dla miesiąca ${properMonth}`)
        .appendTo($userList)

        const p = document.createElement('p');
        $(p)
        .addClass('p-content')
        .html("Pierwsze <span class='big-letters'> 20% </span> osób każdego miesiąca otrzyma  <span class='big-letters'> bilety do kina/pizzę</span>. Pamiętaj, że laureaci poprzedniego miesiąca nie są tym razem brani pod uwagę przy rozdzielaniu nagród. Dajmy szansę innym :) Powodzenia!")
        .appendTo($userList)

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
              .attr("src", "https://english-project.s3.eu-central-1.amazonaws.com/icons/universal/gift.png")
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
            .attr("src", (item.picture && item.picture.indexOf('photo.jpg') < 0) ? item.picture : `https://d24xp1bilplfor.cloudfront.net/icons/${j}.png`)
            .appendTo(div)

            const boolean = winners.every(function (el) {
              return item._id != el
            })
            if(boolean) {
              let giftImage = document.createElement("img");
              $(giftImage)
              .addClass('gift-image')
              .attr("src", "https://english-project.s3.eu-central-1.amazonaws.com/icons/universal/gift.png")
              .appendTo(div)
            }
          }
        });
        return
    } catch(e) {
      console.log(e)
    }
  }


  function removeIcon(x) {
  if (x.matches) { // If media query matches
    $("#span-login").addClass("glyphicon-user");
    $("#span-logout").addClass("glyphicon-log-in");
  } else {
    $("#span-login").removeClass("glyphicon-user");
    $("#span-logout").removeClass("glyphicon-log-in");
    }
  }

  var x = window.matchMedia("(min-width: 800px)")
  removeIcon(x) // Call listener function at run time
  x.addListener(removeIcon) // Attach listener function on state changes


});
