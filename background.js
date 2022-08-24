chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    isValidIssue(tab.url) ? addActiveState(tabId) : removeActiveState(tabId);
});

function addActiveState(tabId) {
    chrome.action.setIcon({ tabId, path: "/icon32-on.png" });
    chrome.action.setTitle({ tabId, title: "Click to convert issue title to branch" });
}

function removeActiveState(tabId) {
    chrome.action.setIcon({ tabId, path: "/icon32-off.png" });
    chrome.action.setTitle({ tabId, title: "Work only with jira issue pages" });
}

function isValidIssue(url) {
    let urlTab = new URL(url);
    let isJiraTaskPage = urlTab.pathname.startsWith("/browse/");
    let selectedIssue = (new URLSearchParams(urlTab.search)).get("selectedIssue");

    return selectedIssue || isJiraTaskPage;
}