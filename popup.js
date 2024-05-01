let scrapeEmails = document.getElementById('scrapeEmails');
let list = document.getElementById('emailList');
// var regex = "r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b' ";

// function result(){
//     print("Ham mails")
// }
// result();

// Handler to receive emails from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    //Get emails
    let emails = request.emails;
    // alert(emails);

    // Display emails on popup
    if (emails == null || emails.length == 0) {
        //No emails
        let li = document.createElement('li');
        li.innerText = "No emails found";
        list.appendChild(li);
        let i = document.createElement('img');
        i.src = '1200px-OOjs_UI_icon_alert_destructive.svg.png';
        list.appendChild(i);
    } else {
        //Display emails
        emails.forEach((email) => {
            let li = document.createElement('li');
            li.innerText = email + "\n Valid Email ";
            list.appendChild(li);
            let i = document.createElement('img');
            i.src = 'https://media.tenor.com/WsmiS-hUZkEAAAAj/verify.gif';
            list.appendChild(i);
        });
    }
});

//Button's click event listener
scrapeEmails.addEventListener("click", async () => {

    // Get current active tab
    let [tab] = await chrome.tabs.query({
        active:
            true, currentWindow: true
    });

    //Execute script to parse emails on page
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: scrapeEmailsFromPage,
    });
})

//Function to scrape emails
function scrapeEmailsFromPage() {

    //RegEx to parse emails from html code
    const emailRegEx = /[\w\.=-]+@[\w\.-]+\.[\w]{2,3}/gim;


    //  **********************************************************************//
    // const spamemailRegEx = /^jwclark.*[@](?!domain\.com).*$/gim;

    // /[\ w\.=-]+@[\ w\.-]+\.[\ w]{2,3}/ email format
    // /^jwclark.*[@](?!domain\.com).*$/ spam email format
    // /^jwclark.*[@](?!domain\.com).*$/gmi spam email format
    // /^jwclark.*[@](?!domain\.com).*$/gmiyusd   

    // ******************************************************************************//

    //Parse emails from the HTML of the page
    let emails = document.body.innerHTML.match(emailRegEx);


    // *********************************************************************************//
    // let spamemails = document.body.innerHTML.match(spamemailRegEx);

    // if(emails && emailRegEx){
    //     alert(emails);
    //     alert("ham");
    // }
    // else if(spamemails && spamemailRegEx){
    //     alert("spam");
    // }

    // **************************************************************************************//
    // alert(emails);


    //Send emails to popup
    chrome.runtime.sendMessage({ emails });

}