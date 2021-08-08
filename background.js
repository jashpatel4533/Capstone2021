import {net} from './mltest.js';
const brain = require('brain.js/src');
const fs = require("fs");
const path = require('path');
const csvData= require('./mltest.csv');
const d3 = require('d3-fetch');
const browser = window.chrome || window.msBrowser || window.browser;
function getContentData(){
	browser.tabs.onActivated.addListener(function (tab) {
		browser.tabs.get(tab.tabId, tabInfo => {
			var url = tabInfo.url;
	    //console.log(url);
			const xhr= new XMLHttpRequest();

  			getHttpUrlRequest(xhr,url);



		});    
	}); 
}
getContentData();

function getHttpUrlRequest(xhr,url){
	xhr.open("GET", url,true);

  		xhr.onload = () => {
   			if (xhr.readyState === 4 && xhr.status == 200){
     	 		const httpdata= (xhr.response); 

     	 		console.log(url);
      		console.log(httpdata);
      		var parser = new DOMParser();
					var htmlText = parser.parseFromString(String(httpdata), 'text/html');

      		testML(url,htmlText); 


				 


    		}
    	}
    xhr.send();


}

var requestStatus;

var output;

var req= function (requestDetails) {
  
    	console.log(output);
    
  	chrome.runtime.onMessage.addListener( function(message,sender,sendResponse){

						if(message == "URL sending"){
						sendResponse(requestDetails.url);

					}

  					});


    	if(output >='0.70' && output <= '1.0'){

    					if(!matchEle){
								return{
										redirectUrl: chrome.runtime.getURL('warning.html')+"?="+requestDetails.url
										
									};	
										
    					}
					 
    		}

};


chrome.webRequest.onBeforeRequest.addListener(req,{
        urls: ["<all_urls>"],  types: ['main_frame']
    }, ['blocking']);

//chrome.webRequest.onBeforeRequest.removeListener(req);

//currentActiveURL();


export var st;

function testML(url,htmlText){
 	  
 		var features=[	longUrl(url),
 					hostnameLen(url),
 					ipMatchUrl(url),
 					dotsInDomains(url),
      		hyphenAtBaseUrl(url),
      		atSymbolInUrl(url),
      		questionMarkAtBaseUrl(url),
      		andSymAtBaseUrl(url),
      		orSymAtBaseUrl(url),
      		equalSymAtBaseUrl(url),
      		underscoreAtBaseUrl(url),
      		tildeAtBaseUrl(url),
					percentAtBaseUrl(url),
					slashAtBaseUrl(url),
					starAtBaseUrl(url),
					colonAtBaseUrl(url),
					commaAtBaseUrl(url),
					semicolonAtBaseUrl(url),
					dollarAtBaseUrl(url),
					spaceAtBaseUrl(url),
					wwwKeyAtUrl(url),
					commaAtBaseUrl(url),
					doubleSlashRedirectUrls(url),
					httpTokenAtUrl(url),
					httpsTokenAtUrl(url),
					allHyperlinks(htmlText,url),
					submitEMail(htmlText,url),
					safeAnchor(htmlText,url)];

 				 	console.log(features);

			 		output=net.run(features);
			 		console.log(output);
			 		var ext=url.match('moz-extension://');
					
					if(output >='0.70' && output <= '1.0' && !ext){
							console.log("phishing");
							//return 'PHISHING';
							

							browser.runtime.onMessage.addListener( function(message,sender,sendResponse){

									if(message == 'status'){
										console.log("status sending");
											sendResponse("Phishing");
										}
  						});
							return requestStatus=1;


					}
					else if(output < '0.69' && output >= '0.40'){
							console.log("Possibily phishing");
							
							
						browser.runtime.onMessage.addListener( function(message,sender,sendResponse){

									if(message == 'status'){
											console.log("status sending");

											sendResponse("UNKNOWN/SUSPICIOUS");
										}
  						});


					}
					else{
			 				console.log("Not a phishing website");
						   	browser.runtime.onMessage.addListener( function(message,sender,sendResponse){

									if(message == 'status'){

											sendResponse("SAFE");
										}
  						});

					}
	


 }

/*
function currentActiveURL(){
 	chrome.tabs.onActivated.addListener((activeInfo) => {
 				chrome.tabs.query({'active': true, 'currentWindow': true,'lastFocusedWindow': true}, function (tabs) {
					let url = tabs[0].url;
    			//console.log(url);
    			testML(url);

    						
    			});
	});
 		
}*/
    
  
var subdomain,hostname,count,baseUrl;

//EXTRACT WEB-CONTENT FEATURES-------------------------------------------------------------------

function extractWebDataFields(httpdata){
	/*var count =0;
    while (httpdata.match('URL') && count < 20){
      					
      	count++;
      	console.log(count);
      	if(count>=20){
      		console.log("phishing");
      		break;

      	}
    }*/

     //console.log((httpdata.match("URL")||[]).length);
      //var elements = document.querySelectorAll( 'body *' );
      //var tags=httpdata.match(/<\/?[\w\d]+>/gi);
      //console.log((tags));
}
function allHyperlinks(htmlText,url){
	var allLinks= htmlText.querySelectorAll("[href],[src]").length;
	console.log("All Hyperlinks:", allLinks);
	return allLinks;


}
//incomplete
function submitEMail(htmlText,url){
	//var email=htmlText.querySelectorAll("[href:"mailto"],[href:"mail()"]").length;
	//console.log("Submit Email:",email);
	return 0;

}
function safeAnchor(htmlText,url){
	var safeA=htmlText.querySelectorAll('[href="#"],[href="#content"],[href="#skip"],[href="JavaScript ::void(0)"]').length;
	console.log("Safe Anchor:",safeA);
	return safeA;

}






//URL/DOMAIN ANALYSIS -----------------------------------------------------------------------------------------------------
// 1=Phishing, 0=Suspicious,-1=Not a Phishing site


//Long url
 function longUrl(url){
 	var len =url.length;
 	//console.log(url,len);
 	return parseInt(len);
 }
 //hostname length
 function hostnameLen(url){
 	subdomain =url.replace(url.substring(0,url.indexOf('/')+2),'');
	hostname= subdomain.substring(0,subdomain.indexOf('/'));
	count= hostname.length;
	//console.log(hostname,count);
	return parseInt(count);

 }
 //IP URL
function ipMatchUrl(url){
	let ipRegex= String(url).match(/(^https?:\/\/[12]?[\d]{1,2}\.\d{1,3}\.\d{1,3}\.\d{1,3})|(^https?:\/\/0[xX][0-9a-fA-F]{1,2}\.0[xX][0-9a-fA-F]{1,2}\.0[xX][0-9a-fA-F]{1,2}\.0[xX][0-9a-fA-F]{1,2})/);
	
	if (ipRegex){
		//Phishing
			//console.log(url,"1");

		return 1;
	}
	else{
		//Not Phishing
		//console.log(url,"0");

		return 0;
	}
}

 //Dots in Domain
 function dotsInDomains(url){
 		subdomain =url.replace(url.substring(0,url.indexOf('/')+2),'');
		hostname= subdomain.substring(0,subdomain.indexOf('/'));

    count =(hostname.split(".")).length-1;
    //console.log("Dots in Domain:" ,count);
	 	return parseInt(count);
 }
 //Hyphen at base URL
 function hyphenAtBaseUrl(url){
 	 subdomain =url.replace(url.substring(0,url.indexOf('/')+2),'');
 	 hostname= subdomain.replace(subdomain.substring(0,subdomain.indexOf('/')+1),'');
 	 baseUrl= hostname.substring(0,hostname.indexOf('/'));

 	 if(!baseUrl){
 	 	 	 baseUrl= hostname.substring(0,hostname.length);
 	 	 	 count =(baseUrl.split("-")).length-1;
 	 	 	  	 //console.log(baseUrl,"Hypen:",count);
 	 	 	 return parseInt(count);
 	 }
 	 else{
 	 		 count =(baseUrl.split("-")).length-1;
 	 		  	 //console.log(baseUrl,"Hypen:",count);
 	 		 return parseInt(count);
 	 }

 }

//@ symbol in URL
 function atSymbolInUrl(url){
  var checkAt= String(url).match(/@/);
  if(checkAt){
  		count =Sting(url).split("@").length-1;
  		//console.log("@:",count);
  		return parseInt(count);
  }
  else{
  	  //console.log("@","0");
  		return 0;
  }


 }

//Question Mark at base URL
 function questionMarkAtBaseUrl(url){
 	 subdomain =url.replace(url.substring(0,url.indexOf('/')+2),'');
 	 hostname= subdomain.replace(subdomain.substring(0,subdomain.indexOf('/')+1),'');
 	 baseUrl= hostname.substring(0,hostname.indexOf('/'));

 	 if(!baseUrl){
 	 	 	 baseUrl= hostname.substring(0,hostname.length);
 	 	 	 count =(baseUrl.split("?")).length-1;
 	 	 	  	 //console.log(baseUrl,"?:",count);
 	 	 	 return parseInt(count);
 	 }
 	 else{
 	 		 count =(baseUrl.split("?")).length-1;
 	 		  	 //console.log(baseUrl,"?:",count);
 	 		 return parseInt(count);
 	 }

 }

//AND Symbol at base URL
 function andSymAtBaseUrl(url){
 	 subdomain =url.replace(url.substring(0,url.indexOf('/')+2),'');
 	 hostname= subdomain.replace(subdomain.substring(0,subdomain.indexOf('/')+1),'');
 	 baseUrl= hostname.substring(0,hostname.indexOf('/'));

 	 if(!baseUrl){
 	 	 	 baseUrl= hostname.substring(0,hostname.length);
 	 	 	 count =(baseUrl.split("&")).length-1;
 	 	 	  	 //console.log(baseUrl,"&:",count);
 	 	 	 return parseInt(count);
 	 }
 	 else{
 	 		 count =(baseUrl.split("&")).length-1;
 	 		  	 //console.log(baseUrl,"&:",count);
 	 		 return parseInt(count);
 	 }

 }

//OR symbol at base URL
 function orSymAtBaseUrl(url){
 	 subdomain =url.replace(url.substring(0,url.indexOf('/')+2),'');
 	 hostname= subdomain.replace(subdomain.substring(0,subdomain.indexOf('/')+1),'');
 	 baseUrl= hostname.substring(0,hostname.indexOf('/'));

 	 if(!baseUrl){
 	 	 	 baseUrl= hostname.substring(0,hostname.length);
 	 	 	 count =(baseUrl.split("|")).length-1;
 	 	 	  	 //console.log(baseUrl,"OR:",count);
 	 	 	 return parseInt(count);
 	 }
 	 else{
 	 		 count =(baseUrl.split("|")).length-1;
 	 		  	 //console.log(baseUrl,"OR:",count);
 	 		 return parseInt(count);
 	 }

 }

//Equal Symbol at base URL
 function equalSymAtBaseUrl(url){
 	 subdomain =url.replace(url.substring(0,url.indexOf('/')+2),'');
 	 hostname= subdomain.replace(subdomain.substring(0,subdomain.indexOf('/')+1),'');
 	 baseUrl= hostname.substring(0,hostname.indexOf('/'));

 	 if(!baseUrl){
 	 	 	 baseUrl= hostname.substring(0,hostname.length);
 	 	 	 count =(baseUrl.split("=")).length-1;
 	 	 	  	 //console.log(baseUrl,"= :",count);
 	 	 	 return parseInt(count);
 	 }
 	 else{
 	 		 count =(baseUrl.split("=")).length-1;
 	 		  	 //console.log(baseUrl,"= :",count);
 	 		 return parseInt(count);
 	 }

 }

//Underscore Symbol at base URL
 function underscoreAtBaseUrl(url){
 	 subdomain =url.replace(url.substring(0,url.indexOf('/')+2),'');
 	 hostname= subdomain.replace(subdomain.substring(0,subdomain.indexOf('/')+1),'');
 	 baseUrl= hostname.substring(0,hostname.indexOf('/'));

 	 if(!baseUrl){
 	 	 	 baseUrl= hostname.substring(0,hostname.length);
 	 	 	 count =(baseUrl.split("_")).length-1;
 	 	 	  	 console.log(baseUrl,"_:",count);
 	 	 	 return parseInt(count);
 	 }
 	 else{
 	 		 count =(baseUrl.split("_")).length-1;
 	 		  	 console.log(baseUrl,"_:",count);
 	 		 return parseInt(count);
 	 }

 }

//Tilde Symbol at base URL
 function tildeAtBaseUrl(url){
 	 subdomain =url.replace(url.substring(0,url.indexOf('/')+2),'');
 	 hostname= subdomain.replace(subdomain.substring(0,subdomain.indexOf('/')+1),'');
 	 baseUrl= hostname.substring(0,hostname.indexOf('/'));

 	 if(!baseUrl){
 	 	 	 baseUrl= hostname.substring(0,hostname.length);
 	 	 	 count =(baseUrl.split("~")).length-1;
 	 	 	  	 //console.log(baseUrl,"~:",count);
 	 	 	 return parseInt(count);
 	 }
 	 else{
 	 		 count =(baseUrl.split("~")).length-1;
 	 		  	 //console.log(baseUrl,"~:",count);
 	 		 return parseInt(count);
 	 }

 }


//Percent Symbol at base URL
 function percentAtBaseUrl(url){
 	 subdomain =url.replace(url.substring(0,url.indexOf('/')+2),'');
 	 hostname= subdomain.replace(subdomain.substring(0,subdomain.indexOf('/')+1),'');
 	 baseUrl= hostname.substring(0,hostname.indexOf('/'));

 	 if(!baseUrl){
 	 	 	 baseUrl= hostname.substring(0,hostname.length);
 	 	 	 count =(baseUrl.split("%")).length-1;
 	 	 	  	 //console.log(baseUrl,"%:",count);
 	 	 	 return parseInt(count);
 	 }
 	 else{
 	 		 count =(baseUrl.split("%")).length-1;
 	 		  	 //console.log(baseUrl,"%:",count);
 	 		 return parseInt(count);
 	 }

 }

//Slash Symbol at full URL
 function slashAtBaseUrl(url){
 	 var slashSym= String(url).match(/\//);

 	 if(!slashSym){
 	 	 	 count=0;
 	 	 	 //console.log(url,"Slash:","0");
 	 	 	 return parseInt(count);
 	 }
 	 else{
 	 		 count =(url.split("/")).length-1;
 	 	 	 //console.log(url,"Slash:",count);
 	 		 return parseInt(count);
 	 }

 }

//Star Symbol at base URL
 function starAtBaseUrl(url){
 	 subdomain =url.replace(url.substring(0,url.indexOf('/')+2),'');
 	 hostname= subdomain.replace(subdomain.substring(0,subdomain.indexOf('/')+1),'');
 	 baseUrl= hostname.substring(0,hostname.indexOf('/'));

 	 if(!baseUrl){
 	 	 	 baseUrl= hostname.substring(0,hostname.length);
 	 	 	 count =(baseUrl.split("*")).length-1;
 	 	 	  	 //console.log(baseUrl,"*:",count);
 	 	 	 return parseInt(count);
 	 }
 	 else{
 	 		 count =(baseUrl.split("*")).length-1;
 	 		  	 //console.log(baseUrl,"*:",count);
 	 		 return parseInt(count);
 	 }

 }

//Colon Symbol at base URL
 function colonAtBaseUrl(url){
 	 subdomain =url.replace(url.substring(0,url.indexOf('/')+2),'');
 	 hostname= subdomain.replace(subdomain.substring(0,subdomain.indexOf('/')+1),'');
 	 baseUrl= hostname.substring(0,hostname.indexOf('/'));

 	 if(!baseUrl){
 	 	 	 baseUrl= hostname.substring(0,hostname.length);
 	 	 	 count =(baseUrl.split(":")).length-1;
 	 	 	  	 //console.log(baseUrl,"Colon:",count);
 	 	 	 return parseInt(count);
 	 }
 	 else{
 	 		 count =(baseUrl.split(":")).length-1;
 	 		  	 //console.log(baseUrl,"Colon:",count);
 	 		 return parseInt(count);
 	 }

 }
  //Comma Symbol at base URL
function commaAtBaseUrl(url){
 	 subdomain =url.replace(url.substring(0,url.indexOf('/')+2),'');
 	 hostname= subdomain.replace(subdomain.substring(0,subdomain.indexOf('/')+1),'');
 	 baseUrl= hostname.substring(0,hostname.indexOf('/'));

 	 if(!baseUrl){
 	 	 	 baseUrl= hostname.substring(0,hostname.length);
 	 	 	 count =(baseUrl.split(",")).length-1;
 	 	 	  	 //console.log(baseUrl,"Comma:",count);
 	 	 	 return parseInt(count);
 	 }
 	 else{
 	 		 count =(baseUrl.split(",")).length-1;
 	 		  	 console.log(baseUrl,"Comma:",count);
 	 		 return parseInt(count);
 	 }

 }
 //Semi-Colon Symbol at base URL
  function semicolonAtBaseUrl(url){
 	 subdomain =url.replace(url.substring(0,url.indexOf('/')+2),'');
 	 hostname= subdomain.replace(subdomain.substring(0,subdomain.indexOf('/')+1),'');
 	 baseUrl= hostname.substring(0,hostname.indexOf('/'));

 	 if(!baseUrl){
 	 	 	 baseUrl= hostname.substring(0,hostname.length);
 	 	 	 count =(baseUrl.split(";")).length-1;
 	 	 	  	 //console.log(baseUrl,"Semi-Colon:",count);
 	 	 	 return parseInt(count);
 	 }
 	 else{
 	 		 count =(baseUrl.split(";")).length-1;
 	 		  	 //console.log(baseUrl,"Semi Colon:",count);
 	 		 return parseInt(count);
 	 }

 }
//Dollar Symbol at base URL
 function dollarAtBaseUrl(url){
 	 subdomain =url.replace(url.substring(0,url.indexOf('/')+2),'');
 	 hostname= subdomain.replace(subdomain.substring(0,subdomain.indexOf('/')+1),'');
 	 baseUrl= hostname.substring(0,hostname.indexOf('/'));

 	 if(!baseUrl){
 	 	 	 baseUrl= hostname.substring(0,hostname.length);
 	 	 	 count =(baseUrl.split("$")).length-1;
 	 	 	  	 //console.log(baseUrl,"$:",count);
 	 	 	 return parseInt(count);
 	 }
 	 else{
 	 		 count =(baseUrl.split("$")).length-1;
 	 		  	 //console.log(baseUrl,"$:",count);
 	 		 return parseInt(count);
 	 }

 }

 //Spacing at base URL
 function spaceAtBaseUrl(url){
 	 subdomain =url.replace(url.substring(0,url.indexOf('/')+2),'');
 	 hostname= subdomain.replace(subdomain.substring(0,subdomain.indexOf('/')+1),'');
 	 baseUrl= hostname.substring(0,hostname.indexOf('/'));

 	 if(!baseUrl){
 	 	 	 baseUrl= hostname.substring(0,hostname.length);
 	 	 	 count =(baseUrl.split(" ")).length-1;
 	 	 	  	 //console.log(baseUrl,"Space:",count);
 	 	 	 return parseInt(count);
 	 }
 	 else{
 	 		 count =(baseUrl.split(" ")).length-1;
 	 		  	 //console.log(baseUrl,"Space:",count);
 	 		 return parseInt(count);
 	 }

 }
// Check for 'www' keywords in the  URL
function wwwKeyAtUrl(url){
	var wwwKey=String(url).match(/(www)+/);
	if (wwwKey){
		  count =(url.split("www")).length-1;
		  //console.log("www:",count);
		return parseInt(count);
	}
	else{
		//console.log("www:","0");

		return 0;
	}

}

// Check for 'com' keywords in the  URL

function comKeyAtUrl(url){
	var comKey= String(url).match(/(com)+/);
	if (comKey){
		  count =(url.split("com")).length-1;
		  //console.log("com:",count);
		return parseInt(count);
	}
	else{
		//console.log("com:","0");

		return 0;
	}
}


// double slash in URL
 function doubleSlashRedirectUrls(url){

 	subdomain =url.replace(url.substring(0,url.indexOf('/')+2),'');
 	var dSlash= url.match(/(\/\/).*/);


 	if(dSlash){
 		count =(subdomain.split("//")).length-1;
 		return parseInt(count);

 		//console.log("Double Slash:",count);

 	}
 	else{
 		console.log("Double Slash:","0");

 		return 0;
 	}

 }

 // HTTP token in url
 function httpTokenAtUrl(url){
	var httpToken= String(url).match(/\b(http)+\b/);
 	if (httpToken){
 			count =(url.split("http")).length-1;
 			//console.log("http token:",count);

 		//Phishing
 		return parseInt(count);

 	}
 	else{
 		//console.log("http token:","0");

 		//Not phishing
 		return 0;
 	} 

 }
// HTTPS token in url
 function httpsTokenAtUrl(url){
	var httpsToken= String(url).match(/\b(https)+\b/);
 	if (httpsToken){
 		count =(url.split("http")).length-1;
 		//console.log("https token:",count);
 		//Not Phishing
 		return parseInt(count);

 	}
 	else{
 		//Phishing
 		//console.log("https token:","0");

 		return 0;
 	}

 }
 //Ratio digits in url
 function digitsRatioInUrl(url){
 	var dRatio= ((String(url).replace(/\d*/g,"")).length);
  var len= (url.length-dRatio)/url.length;
  var floatNum= parseFloat(len.toFixed(9));
 	//String(url).length; 
 	//console.log("Digits Ratio in URL: ", floatNum);
 	return floatNum;

 }
 

//Ratio digits in hostname
 function digitsRatioInHostname(url){
 	subdomain =url.replace(url.substring(0,url.indexOf('/')+2),'');
	hostname= subdomain.substring(0,subdomain.indexOf('/'));
	var dRatio,len,floatNum;
	if(hostname){
		dRatio= ((String(hostname).replace(/\d*/g,"")).length);
  	len= (hostname.length-dRatio)/hostname.length;
  	floatNum= parseFloat(len.toFixed(9));
  	//console.log("Digits Ratio in hostname: ", floatNum);

  	return floatNum;
	}
	else{
	  hostname= subdomain.substring(0,subdomain.length);
		dRatio= ((String(hostname).replace(/\d*/g,"")).length);
  	len= (hostname.length-dRatio)/hostname.length;
  	floatNum= parseFloat(len.toFixed(9));
  	//console.log("Digits Ratio in hostname: ", floatNum);

  	return floatNum;
	}


 }