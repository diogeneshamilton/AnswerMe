// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function executeMailto(subject, body) {
    // Custom URL's (such as opening mailto in Gmail tab) should have a
    // separate tab to avoid clobbering the page you are on.
  	var action_url = "mailto:?"
  	
    //  action_url += "subject=" + encodeURIComponent(subject) + "&";
	//	action_url += "body=" + encodeURIComponent(body);

    chrome.tabs.create({ url: action_url });

}

chrome.extension.onConnect.addListener(function(port) {
  var tab = port.sender.tab;

  // This will get called by the content script we execute in
  // the tab as a result of the user pressing the browser action.
  port.onMessage.addListener(function(info) {
    var max_length = 1024;
    if (info.selection.length > max_length)
      info.selection = info.selection.substring(0, max_length);
    executeMailto(tab.id, info.title, tab.url, info.selection);
  });
});

// Called when the user clicks on the submit Button.
chrome.browserAction.onClicked.addListener(function(tab) {
  // We can only inject scripts to find the title on pages loaded with http
  // and https so for all other pages, we don't ask for the title.
  if (tab.url.indexOf("http:") != 0 &&
      tab.url.indexOf("https:") != 0) {
    executeMailto(tab.id, "", tab.url, "");
  } else {
    chrome.tabs.executeScript(null, {file: "content_script.js"});
  }
});
