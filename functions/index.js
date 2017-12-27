const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase)

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

//listen for following events and then trigger a push notification
exports.observeFollowing = functions.database.ref('/following/{uid}/{followingId}')
	.onCreate(event => {
		//lets log out some messages
		var uid = event.params.uid
		var followingId = event.params.followingId
		console.log('User: ' + uid + ' is following: ' + followingId)

		//snatch fcmToken to send a pushnoti
		return admin.database().ref('/users/' + followingId).once('value', snapshot => {
			var userWeIsFollowing = snapshot.val()

			return admin.database().ref('/users/' + uid).once('value', snapshot => {
				var userDoingTheFollowing = snapshot.val()

				var payload = {
					notification: { 
						title: 'new homie!',
						body: userDoingTheFollowing.username + ' is now following u fam!'
					}
				}

				admin.messaging().sendToDevice(userWeIsFollowing.fcmToken, payload)
					.then(function(response) {
						console.log("Successfully sent message:", response);
					})
					.catch(function(error) {
						console.log("Error sending message:", error);
					});
			})
		})
	})



exports.sendPushNotifications = functions.https.onRequest((req, res) => {
	res.send("Attempting to send push notification..")
	console.log("LOGGER --- Trying to send push message....")

	var uid = '7qWdwZKyWFUCo6qtKUJVV0wNv0z2'

	return admin.database().ref('/users/' + uid).once('value', snapshot => {
		var user = snapshot.val()
		console.log('User username: ' + user.username + 'fcmToken: ' + user.fcmToken)

		var payload = {
			notification: { 
				title: "Push notification TITLE HERE BOI",
				body: "Body over here is our message body"
			}
		};
	
		// Send a message to the device corresponding to the provided
		// registration token.
		admin.messaging().sendToDevice(user.fcmToken, payload)
			.then(function(response) {
				// See the MessagingDevicesResponse reference documentation for
				// the contents of response.
				console.log("Successfully sent message:", response);
			})
			.catch(function(error) {
				console.log("Error sending message:", error);
			});
	});
});