const browser = window.chrome || window.msBrowser || window.browser;

function redirectUrl(){
	document.getElementById("ignoreRisk").addEventListener("click", function() {
		

	chrome.runtime.sendMessage('URL sending',function (response) {

	console.log('URL sending',response);
	console.log('recieved');


	window.location.replace(response);

        });


	
});
}

function redirectToSafety(){
	document.getElementById("backtosafety").addEventListener("click", function() {

	window.location.replace("https://www.google.ca");

    });
}
redirectToSafety();
redirectUrl();
