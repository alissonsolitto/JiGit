chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    
    if (message.action === "get-issue-data") {
                
        let urlApi = createGetIssueUrl(message.url);

        if (urlApi) {
            // Get data
            fetch(urlApi)
                .then(function (response) {
                    response.json().then(function (issueData) {
                        sendResponse(issueData);
                    });
                })
                .catch(function (error) {
                    console.log('There has been a problem with your get data issue operation: ' + error.message);
                });
        }

        return true; //https://riptutorial.com/google-chrome-extension/example/7152/send-a-response-asynchronously
    }
});

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

function createGetIssueUrl(url) {
    let urlTab = new URL(url);
    let isJiraTaskPage = urlTab.pathname.startsWith("/browse/");
    let selectedIssue = (new URLSearchParams(urlTab.search)).get("selectedIssue");

    if (selectedIssue) {
        return `${urlTab.origin}/rest/api/2/issue/${selectedIssue}`;
    }
    else if (isJiraTaskPage) {
        let issueKey = urlTab.pathname.split("/")[2];
        return `${urlTab.origin}/rest/api/2/issue/${issueKey}`;
    }
}