function executeMailto(subject, body, pledge_id, amount, time_limit) {

    // Custom URL's (such as opening mailto in Gmail tab) should have a
    // separate tab to avoid clobbering the page you are on.
    var amount = document.querySelector('input[name="amount"]').value
    var expiration = document.querySelector('input[name="expiration"]').value
  	var default_msg = "I just pledged $" + amount + " using Donor's Choose. Reply to me within " + time_limit + " or you are a bad person who hates children."
  	var action_url = "mailto:?cc=pledge-" + pledge_id + "@donorschoose.alecturnbull.com?subject=" + subject + "&body=" + default_msg + "body"

    chrome.tabs.create({ url: action_url });
}

function click(e) {
	time_limit = document.querySelector('input[name="expiration"]').value;
	amount = document.querySelector('input[name="amount"]').value;
	project_id = document.querySelector('input[name="proposalID"]').value;
	
	$.ajax({
		type: 'POST',
		url: 'http://donorschoose.alecturnbull.com/pledges.json',
		data: { 'pledge' : { 'amount' : amount, 
		'time_limit' : time_limit,
		'project_id' : project_id
		} },
		success: function(data) {
			var response = $.parseJSON(data);
			if (response.saved) {
				executeMailto('', '', response.pledge_id, amount, time_limit)
			}
		}
	});  
	
}

function donorChoice(e) {
	document.querySelector('input[name="proposalID"]').value = e.target.id;
	$('li').removeClass('selected');
	$('#' + e.target.id).addClass('selected');
	
}

function categoryClick(e) {
	$('ul').html('');
	$('#projects').prepend('<a id="home-link" href="" ><<< Categories</a>');
	$('ul').prepend('<center><img id="loading" src="ajax-loader.gif" /></center>');
	
	$.ajax({
  		url: e.target.href,
  		success: function(data) {
    		$('ul').html('');
    		var proposals = $.parseJSON(data).proposals;
    		$.each(proposals, function(index) {
    			$('ul').append('<img class="thumb" src="' + this.imageURL + '"/><li class="touch-blurb" id="' + this.id + '"><h3>' + this.title + '</h3>' + this.shortDescription + 
    			'<br/><strong>$' + this.costToComplete + ' to go </strong> in ' + this.city + ', ' + this.state + '</li>');
				});
		
				var blurbs = document.querySelectorAll('li.touch-blurb')
				$.each(blurbs, function() { this.addEventListener('click', donorChoice); });
  		}
	});  
}

document.addEventListener('DOMContentLoaded', function () {
  	var submit = document.querySelector('button');
    submit.addEventListener('click', click);
    var categories = document.querySelectorAll('.category');
    for (var i=0; i<categories.length; i++) {
    	categories[i].addEventListener('click', categoryClick);
    }
});