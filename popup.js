const browser = window.chrome || window.msBrowser || window.browser;



document.getElementById("decision").addEventListener("click", function() {
    

  browser.runtime.sendMessage('status',function (response) {

  console.log('status',response);
  console.log('recieved')
  document.getElementById("message").innerHTML = response;


  });
});

//appendDecision();
console.log("hello");
//console.log(output);
//document.getElementById("urls").innerHTML = "YES";

