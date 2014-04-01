/*
 * Such cool functions
 * used to compare strings
 */
function isTwitter(hostname) {
    return hostname == "twitter.com";
}

function getStatus(pathname) {
    var pattern = /^\/\w+\/status\/(\d+)$/;
    var matches = pathname.match(pattern);
    if (matches) {
        return matches[1];
    } 
    return false;
}

function getUsername(pathname) {
    var pattern = /^\/@?(\w+)$/;
    var matches = pathname.match(pattern);
    if (matches) {
        return matches[1];
    } 
    return false;
}

/*
 * Wow very awesome functions
 * used to parse twitter's urls
 * and open Tweetbot
 */
function createTweetbotURL(basepath, param) {
    return "tweetbot://".concat(basepath.concat(param));
}

function getTweetbotStatusURL(statusId) {
    return createTweetbotURL("/status/", statusId);
}

function getTweetbotProfileURL(username) {
    return createTweetbotURL("/user_profile/", username);
}

function openTweetbot(pathname) {
    var tweetbotURL;
    var pathComponent;

    if ((pathComponent = getStatus(pathname))) {
        tweetbotURL = getTweetbotStatusURL(pathComponent);
    } else if ((pathComponent = getUsername(pathname))) {
        tweetbotURL = getTweetbotProfileURL(pathComponent);
    }

    if (tweetbotURL) {
        window.location = tweetbotURL;
        if (settings.closePage) {
            setTimeout(function() {
                safari.self.tab.dispatchMessage("safarweetbot-actions-closePage")
            }, 500);
        }
    }
}

/*
 * Such a script
 * So awesome
 * (we don't want to run the script unless we got the settings)
 */
function runScript() {
    var location = window.location;
    var hostname = location.host;
    var pathname = location.pathname;

    if (isTwitter(hostname))
        openTweetbot(pathname);
}

function receivedMessage(event) {
    if (event.name === "safarweetbot-settings-response") {
        settings = event.message;
        runScript();
    }
}

var settings;
safari.self.addEventListener("message", receivedMessage, false);
safari.self.tab.dispatchMessage("safarweetbot-settings-request");


