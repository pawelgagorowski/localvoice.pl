
$(document).ready(function() {
  let expiresAt;

  var webAuth = new auth0.WebAuth({
    domain: 'dev-6cnet9rr.eu.auth0.com',
    clientID: 'NqFkCbJy7V3RAsqgxqXm0g3mRgsmA6Dq',
    responseType: 'token id_token',
    scope: 'openid email profile'
  });


  if (localStorage.getItem('isLoggedIn') === 'true') {
     renewTokens();
   } else {
   handleAuthentication();
   }


   function handleAuthentication() {
     webAuth.parseHash(function(err, authResult) {
       if (authResult && authResult.accessToken && authResult.idToken) {
         localLogin(authResult, function () {
           location.replace("https://localvoice.pl/confirmation.html");
         });
       } else {
         console.log(err);
         // displayButtons();
       }
     });
   }

   function localLogin(authResult, callback) {
     // Set isLoggedIn flag in localStorage
     localStorage.setItem('isLoggedIn', 'true');
     localStorage.setItem('token', JSON.stringify(authResult));
     // Set the time that the Access Token will expire at
     expiresAt = JSON.stringify(
       authResult.expiresIn * 1000 + new Date().getTime()
     );
     callback();
   }

   function renewTokens() {
       const token1 = localStorage.getItem('token');
       const token = JSON.parse(token1);
       if (token && token.accessToken && token.idToken) {
         localLogin(token, function() {
           location.replace("https://localvoice.pl/confirmation.html");
         });
       } else {
         alert('Could not get a new token');
         logout();
      }
   }

   function isAuthenticated() {
     // Check whether the current time is past the
     // Access Token's expiry time
     var expiration = parseInt(expiresAt) || 0;
     return localStorage.getItem('isLoggedIn') === 'true' && new Date().getTime() < expiration;
   }

});
