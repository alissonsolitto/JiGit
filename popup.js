window.onload = function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

    let urlTab = new URL(tabs[0].url);

    chrome.runtime.sendMessage({ action: "get-issue-data", url: urlTab }, (issueData) => {
      let branchType = document.getElementById("branch-type");
      branchType.value = issueData.fields.issuetype.name == "Bug" ? "hotfix" : "feature";
      document.getElementById("branch-type-text").innerHTML = branchType.value.concat("/");

      let titleBranch = replaceSpecialChars(issueData.fields.summary).toLowerCase();
      document.getElementById("branch-name").value = issueData.key.concat('-', titleBranch);

      let linkIssue = document.getElementById("link-issue");
      linkIssue.href = `${urlTab.origin}/browse/${issueData.key}`;
      linkIssue.innerHTML = issueData.key;
    });
  });
}

// https://metring.com.br/javascript-substituir-caracteres-especiais
function replaceSpecialChars(text) {
  return text.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/([^\w]+|\s+)/g, '-')
    .replace(/\-\-+/g, '-')
    .replace(/-(d|n)?(a|e|i|o|u)(s?)-/g, '-')
    .replace(/(^-+|-+$)/, '');
}

function copyCommand() {
  let branchType = document.getElementById("branch-type-text");
  let branchFrom = document.getElementById("branch-from");
  let branchName = document.getElementById("branch-name");

  let command = `git checkout ${branchFrom.value}
git pull --rebase
git checkout -b ${branchType.innerHTML.concat(branchName.value)} origin/${branchFrom.value}`

  navigator.clipboard.writeText(command);
}

function copyBranchName() {
  let branchType = document.getElementById("branch-type-text");
  let branchName = document.getElementById("branch-name");

  navigator.clipboard.writeText(branchType.innerHTML.concat(branchName.value));
}

function handleBranchTypeChange(event) {
  document.getElementById("branch-type-text").innerHTML = event.target.value.concat("/");
}

document.getElementById("branch-type").addEventListener("change", handleBranchTypeChange);
document.getElementById("btn-copy-command").addEventListener("click", copyCommand);
document.getElementById("btn-copy-branch-name").addEventListener("click", copyBranchName);