// All source code Copyright 2013 Cope Consultancy Services. All rights reserved


// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

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
Ti.Facebook.permissions = ['publish_stream']; // Permissions your app needs
Ti.Facebook.addEventListener('login', function(e) {
    if (e.success) {
        alert('Logged In');
    } else if (e.error) {
        alert(e.error);
    } else if (e.cancelled) {
        alert("Canceled");
    }
});

function sendScreenshot(data) {
	alert('sending screen');
	Ti.Facebook.requestWithGraphPath('me/photos', data, 'POST', function(e){
		alert('e'+e);
	    if (e.success) {
	        alert("Success!  From FB: " + e.result);
	    } else {
	        if (e.error) {
	            alert(e.error);
	        } else {
	            alert("Unkown result");
	        }
	    }
	});
}

function captureScreen() {
	var data = Ti.Media.takeScreenshot(function(e)
	{
		// set the media attribute contains the screenshot
		sendScreenshot(e.media);

	});
}

var sendScreen = Ti.UI.createButton({
	top:0, 
	title:'Facebook Screen'
});

sendScreen.addEventListener('click', function(e) {
	//
	captureScreen();
});

win1.add(sendScreen);
win1.open();

Ti.Facebook.authorize();