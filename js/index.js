/**
 * Created with IntelliJ IDEA.
 * User: meirib
 * Date: 09/10/13
 * Time: 01:04
 * To change this template use File | Settings | File Templates.
 */

function MainController($scope){
    $scope.alert = function(){
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                // the user is logged in and has authenticated your
                // app, and response.authResponse supplies
                // the user's ID, a valid access token, a signed
                // request, and the time the access token
                // and signed request each expire
                var uid = response.authResponse.userID;
                var accessToken = response.authResponse.accessToken;
                alert("horrah \n" + response.authResponse.accessToken )
            } else if (response.status === 'not_authorized') {
                // the user is logged in to Facebook,
                // but has not authenticated your app
                alert("user did not authorize  in")
            } else {
                // the user isn't logged in to Facebook.
                alert("user not logged in")
            }
        });
        FB.login(function(response) {
            if (response.authResponse) {
                alert("cool");
            } else {
                alert("not cool");
            }
        });
    };

    var errorHappend = function(err){
        alert("error!" + err);
    }

    var handleTheLinkRequest = function(str){
        FB.api("/" + str + "?fields=comments.limit(5000).fields(user_likes,from),likes.limit(5000)",function(response) {
            console.log(response.comments.data.length);
            console.log(response.likes.data.length);
        });
    }

    $scope.findBestLikes = function(){
//        alert($scope.linkAddress);
        var noFacebook =  $scope.linkAddress.split("www.facebook.com/").pop();
        if (noFacebook === undefined){
            alert("error on link");
            return;
        }
        if (noFacebook.indexOf("photo.php") == 0){
            var photoId = noFacebook.substring("photo.php?fbid=".length);
            if (photoId.indexOf("&") !== -1){
                photoId = photoId.split("&")[0];
            }
            handleTheLinkRequest(photoId);
            return;
        }
        var linkArray = noFacebook.split("/");
        if (linkArray[1] !== "posts" || noFacebook.length < 3){
            alert("not posts");
            return;
        }
        var postNumber = null;
        if (linkArray[2].indexOf("?") !== -1 ){
            postNumber = linkArray[2].split("?")[0];
        } else{
            postNumber = linkArray[2];
        }

        FB.api("/" + linkArray[0] + "?fields=id",function(response) {
            handleTheLinkRequest(response.id + "_" + postNumber);
        });

    }
}




window.fbAsyncInit = function() {
    // init the FB JS SDK
    FB.init({
        appId      : '222129187952689',                        // App ID from the app dashboard
//        channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html', // Channel file for x-domain comms
        status     : true,                                 // Check Facebook Login status
        xfbml      : true                                  // Look for social plugins on the page
    });

    // Additional initialization code such as adding Event Listeners goes here

    FB.Event.subscribe('auth.authResponseChange', function(response) {
        // Here we specify what we do with the response anytime this event occurs.
        if (response.status === 'connected') {

            //alert("connect and auth")
        } else if (response.status === 'not_authorized') {
            // In this case, the person is logged into Facebook, but not into the app, so we call
            // FB.login() to prompt them to do so.
            // In real-life usage, you wouldn't want to immediately prompt someone to login
            // like this, for two reasons:
            // (1) JavaScript created popup windows are blocked by most browsers unless they
            // result from direct interaction from people using the app (such as a mouse click)
            // (2) it is a bad experience to be continually prompted to login upon page load.
            alert("connect but not auth")
            FB.login();
        } else {
            // In this case, the person is not logged into Facebook, so we call the login()
            // function to prompt them to do so. Note that at this stage there is no indication
            // of whether they are logged into the app. If they aren't then they'll see the Login
            // dialog right after they log in to Facebook.
            // The same caveats as above apply to the FB.login() call here.
            FB.login();
        }
    });





};

// Load the SDK asynchronously
(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/all.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));