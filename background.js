function isValidIssue(url) {
    let urlTab = new URL(url);
    let isJiraTaskPage = urlTab.pathname.startsWith("/browse/");
    let selectedIssue = (new URLSearchParams(urlTab.search)).get("selectedIssue");

    return selectedIssue || isJiraTaskPage;
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    isValidIssue(tab.url) ? addActiveState(tabId) : removeActiveState(tabId);    
});

function addActiveState(tabId) {
    chrome.browserAction.setIcon({ tabId, path: "icon32-on.png" });
    chrome.browserAction.setTitle({ tabId, title: "Click to convert issue title to branch" });
}

function removeActiveState(tabId) {
    chrome.browserAction.setIcon({ tabId, path: "icon32-off.png" });
    chrome.browserAction.setTitle({ tabId, title: "Work only with jira issue pages" });
}