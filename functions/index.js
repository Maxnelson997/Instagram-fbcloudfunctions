const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase)

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});


exports.sendPushNotifications = functions.https.onRequest((req, res) => {
	res.send("Attempting to send push notification..")
	console.log("LOGGER --- Trying to send push message....")

	// This registration token comes from the client FCM SDKs.
	var fcmToken = "fb_YltK0us8:APA91bFrsN1BZ4CshA7UzZsVayOx1bngq_hzdFahovZ6IhTovH3tSWORi9yiGJoENH9lfjX9ERb3rAmOPhR2dv6c7DlCjCuE5XOnwhUx8OAYCofaj8S1iRvlt3TXe3S9genan0kl_U_O";

	// See the "Defining the message payload" section below for details
	// on how to define a message payload.
	var payload = {
	  notification: { 
	  	title: "Push notification TITLE HERE BOI",
	  	body: "Body over here is our message body"
	  },
	  data: {
	    score: "850",
	    time: "2:45"
	  }
	};

	// Send a message to the device corresponding to the provided
	// registration token.
	admin.messaging().sendToDevice(fcmToken, payload)
	  .then(function(response) {
	    // See the MessagingDevicesResponse reference documentation for
	    // the contents of response.
	    console.log("Successfully sent message:", response);
	  })
	  .catch(function(error) {
	    console.log("Error sending message:", error);
	  });
})