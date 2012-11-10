function executeMailto(subject, body, cc) {
    // Custom URL's (such as opening mailto in Gmail tab) should have a
    // separate tab to avoid clobbering the page you are on.
    
    var amount = document.querySelector('input[name="amount"]')
    var expiration = document.querySelector('input[name="expiration"]')
  	var default_msg = "I just pledged " + amount + " using Donor's Choose. Reply to me within " + expiration + " or you are a bad person who hates children."
  	var action_url = "mailto:?cc=" + cc + "?subject=" + subject + "&body=" + default_msg + "body"
  	
    //  action_url += "subject=" + encodeURIComponent(subject) + "&";
	action_url += "cc=answermesent" + encodeURIComponent("+" + cc) + "@answerme.mailgun.org";

    chrome.tabs.create({ url: action_url });

}

function saveToParse() {
expirationText = document.querySelector('input[name="expiration"]').value;
if (/sec/i.test(expirationText)) {
	seconds =	parseInt(expirationText.replace(/[^0-9\.]/g, ''));
}

if (/min/i.test(expirationText)) {
	minutes =	parseInt(expirationText.replace(/[^0-9\.]/g, ''));
	seconds = minutes * 60;
}

if (/hour/i.test(expirationText)) {
	hours =	parseInt(expirationText.replace(/[^0-9\.]/g, ''));
	seconds = hours *60*60;
}

if (/day/i.test(expirationText)) {
	days =	parseInt(expirationText.replace(/[^0-9\.]/g, ''));
	seconds = days *60*60*24;
}

amount = document.querySelector('input[name="amount"]').value;
if (!!seconds && !!amount) {
	var AnswerMe = Parse.Object.extend("AnswerMeObject");
	var answerMe = new AnswerMe();
	answerMe.set("lengthToExpiration", seconds)
	answerMe.set("amount", amount)
	answerMe.save(null, {
	  success: function(object) {
	  
	executeMailto('', '', object.id);

	  }
	});
	return true;
} else { return false; }

}


function click(e) {
    var done = saveToParse();
}

function categoryClick(e) {
    
}

document.addEventListener('DOMContentLoaded', function () {
  	var submit = document.querySelector('button');
    submit.addEventListener('click', click);
    var categories = document.querySelectorAll('category');
    for (var i=0; i<categories.length; i++) {
    categories[i].addEventListener('click', categoryClick);
    }

    Parse.initialize("lj3R4RuR6sonniWeBXyVsfTfzxH7votc3KLj3aAH", "NoEteCTSDHd5pa1nYGB8xKuODKmQ9XyWYDOTSyCe");    

});