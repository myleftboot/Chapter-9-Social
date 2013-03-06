// All source code Copyright 2013 Cope Consultancy Services. All rights reserved

// create base root window
//
var win1 = Titanium.UI.createWindow({  
    backgroundColor:'#fff'
});

// get the width and top once, so we only cross over the bridge once
var height = Ti.Platform.displayCaps.platformHeight,
	width = Ti.Platform.displayCaps.platformWidth;

// add some random boxes on the screen, reuse the vews from stopprogress
for (var i=0; i<5; i++) {
	var randomPosView = Ti.UI.createView({
	width:'10%',
	height:'10%',
	backgroundColor:'green',
	borderColor:'black',
	left: Math.random() * width,
	top:Math.random() * height
	});

	win1.add(randomPosView);
}

// now lets add some buttons to send the screen to facebook
Ti.Facebook.appid = '469401486460863';
Ti.Facebook.permissions = ['publish_stream'];
Ti.Facebook.addEventListener('login', function(e) {
    if (e.error) {
        alert(e.error);
    } else if (e.cancelled) {
        alert("Cancelled");
    }
});

function facebookScreenshot(data) {
	// construct the photo object
	var thePhoto = {
    		message: 'My randomly placed squares',
    		picture: data
	};
	Ti.Facebook.requestWithGraphPath('me/photos', thePhoto, 'POST', function(e){
	    if (e.success) {
	        alert("Success!  From FB: " + e.result);
	    } else {
	        if (e.error) {
	            alert(e.error);
	        } else {
	            alert("Unknown result");
	        }
	    }
	});
}

function captureScreenForFacebook() {
	Ti.Media.takeScreenshot(function(e)
	{
		// The media property of the object passed in contains the screenshot
		facebookScreenshot(e.media);

	});
}

var facebookBtn = Ti.UI.createButton({
	title:'Facebook Screen'
});

facebookBtn.addEventListener('click', function(e) {
	//
	captureScreenForFacebook();
});


function tweetUpdate(_args) {

	var social = require('social');

	var twitter = social.create({
	    consumerSecret : '<<YOUR CONSUMER SECRET>>',
	    consumerKey : '<<YOUR CONSUMER KEY>>'
	});

    twitter.share({
        message : "More random blocks",
        success : function() {
            alert('Tweeted!');
        },
        error : function(e) {
            alert('ERROR'+e);
        }
    });
}


var twitterBtn = Ti.UI.createButton({
	title:'Send Tweet'
});

twitterBtn.addEventListener('click', function(e) {
	//
	tweetUpdate();
});

var socialVw = Ti.UI.createView({
	top:0,
	height:Ti.UI.SIZE,
	layout:'horizontal'
})
socialVw.add(facebookBtn);
socialVw.add(twitterBtn);
win1.add(socialVw);
win1.open();

Ti.Facebook.authorize();
