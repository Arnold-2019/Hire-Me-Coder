(function () {
	"use strict";

	var treeviewMenu = $('.app-menu');

	// Toggle Sidebar
	$('[data-toggle="sidebar"]').click(function (event) {
		event.preventDefault();
		$('.app').toggleClass('sidenav-toggled');
	});

	// Activate sidebar treeview toggle
	$("[data-toggle='treeview']").click(function (event) {
		event.preventDefault();
		if (!$(this).parent().hasClass('is-expanded')) {
			treeviewMenu.find("[data-toggle='treeview']").parent().removeClass('is-expanded');
		}
		$(this).parent().toggleClass('is-expanded');
	});

	// Set initial active toggle
	$("[data-toggle='treeview.'].is-expanded").parent().toggleClass('is-expanded');

	//Activate bootstrip tooltips
	$("[data-toggle='tooltip']").tooltip();

	// Web app's Firebase configuration
	const firebaseConfig = {
		apiKey: "AIzaSyD8s6-0LuLSfNT2Qb80o4icD8ES1pOSR08",
		authDomain: "hireme-coder.firebaseapp.com",
		databaseURL: "https://hireme-coder.firebaseio.com",
		projectId: "hireme-coder",
		storageBucket: "hireme-coder.appspot.com",
		messagingSenderId: "705493928337",
		appId: "1:705493928337:web:e3bd0ceff64cbc5d"
	};
	// Initialize Firebase
	firebase.initializeApp(firebaseConfig);

})();

$('#logout').click(function () {
	console.log('logout bbye');
	firebase.auth().signOut().then(function () {
		location.href = '/login';
	})
});