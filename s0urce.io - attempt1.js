// The delay, in milliseconds
// 1000 milliseconds = 1 second
var theDelay = 1000 * 1;

function canPwn() {
	if(window.lastPwnTime == null) return true;
	var now = new Date();
	var timeDifference = now - window.lastPwnTime;

	// Ensure we have waited enough time
	return timeDifference > theDelay;
}

function didPwn() {
	// We did a pwn, update the internal time
	window.lastPwnTime = new Date();
}

function checkPwn(force) {
	// Prevent pwning too fast
	if(!canPwn()) return;

    // ensure we have a store for seen values
    window.seenWords = window.seenWords || {};

    // This list seems dead
    //{"10":"handle","11":"part","38":"ping","58":"intel","59":"port","../client/img/word/m/17":"gridwidth","m/20":"accountname","e/60":"emit","m/9":"decryptfile","e/14":"signal","e/61":"loop","m/14":"datatype","e/41":"add","m/36":"getkey","e/15":"point","m/8":"download","e/33":"stat","e/20":"dir","e/59":"port","e/25":"host","e/13":"val","e/46":"type","e/4":"system","e/6":"left","../client/img/words/template.png":"a","h/24":"getxmlprotocol","m/52":"process","m/45":"package","h/39":"setnewproxy","m/13":"newline","h/50":"getpartoffile","m/60":"account","h/49":"getfirewallchannel","m/1":"gridheight","m/47":"server","e/16":"reset","e/35":"ghost","e/22":"write","e/3":"pass","e/12":"delete","e/29":"client","e/58":"intel","e/57":"set","e/37":"remove","e/50":"key","e/38":"ping","e/9":"anon","e/32":"http","h/18":"changeusername","h/45":"emitconfiglist","h/46":"fileexpresslog","h/4":"createfilethread","h/6":"removeoldcookie","h/37":"removenewcookie","h/7":"includedirectory","h/43":"blockthreat","h/15":"batchallfiles","h/16":"systemgridtype","h/10":"respondertimeout","h/3":"changepassword","h/51":"mergesocket","h/5":"disconnectserver","h/23":"sendintelpass","h/33":"channelsetpackage","h/38":"statusofprocess","h/21":"encodenewfolder","h/17":"getmysqldomain","h/28":"unpacktmpfile","h/8":"getdatapassword","h/42":"create2axisvector","h/11":"ghostfilesystem","h/36":"hostnewserver","h/47":"uploaduserstats","e/24":"get","e/21":"poly","e/17":"call","e/51":"right","e/26":"root","e/45":"domain","e/52":"user","e/49":"buffer","h/54":"disconnectchannel","h/2":"exportconfigpackage","h/30":"httpbuffersize","h/48":"bufferpingset","h/31":"patcheventlog","h/26":"rootcookieset","h/20":"create3axisvector","h/53":"checkhttptype","e/1":"join","e/31":"file","e/34":"list","e/43":"com","e/27":"url","e/19":"count","e/40":"upload","e/53":"info","e/23":"num","e/30":"log","e/54":"net","e/2":"data","e/48":"load","e/0":"cookies","e/8":"global","e/55":"init","e/39":"size","h/44":"dodecahedron","h/22":"eventlistdir","h/34":"destroybatch","h/29":"generatecodepack","h/27":"createnewpackage","h/32":"encryptunpackedbatch","h/12":"systemportkey","h/14":"sizeofhexagon","e/42":"bytes","e/28":"send","m/50":"writefile","e/11":"part","m/51":"listconfig","m/63":"decrypt","m/22":"password","m/33":"username","m/0":"command","h/41":"callmodule","h/0":"loadaltevent","h/35":"deleteallids","h/1":"wordcounter","h/40":"loadloggedpassword","h/25":"joinnetworkclient","h/9":"loadregisterlist","h/13":"createnewsocket"};

    // grab the string number of this
    var stringNumber = $('.tool-type-img').attr('src').replace('../client/img/word/','');

    // Prevent incorrect spamming
    var lastWordChoice = window.lastWordChoice;
    if(lastWordChoice == stringNumber && !force) return;
    window.lastWordChoice = stringNumber;

    // see if we've seen this before
    var possibleWord = window.seenWords[stringNumber];

    // Did we find the word?
    if(possibleWord != null) {
    	console.log('Found word ' + possibleWord);

        window.shouldntSubmit = true;
        $('#tool-type-word').val(possibleWord);

        $('#tool-type-form').submit();

        // We did a pwn
        didPwn()

        setTimeout(function() {
            $('#tool-type-word').val('');
            window.shouldntSubmit = false;
        }, 1);
    }
}

$('#tool-type-word').on('keyup keypress keydown', function(e) {
    if(window.shouldntSubmit) {
        e.preventDefault();
        return false;
    }

    if(e.which != 13) {
        return;
    }

    // Grab what we typed
    var currentEntry = $('#tool-type-word').val();

    // Did we type anything?
    if(currentEntry.length <= 0) {
        // Check if we should pwn
        checkPwn(true);

        e.preventDefault();
        return false;
    }

    // grab the string number of this
    var stringNumber = $('.tool-type-img').attr('src').replace('../client/img/word/','');

    // Store the answer
    window.seenWords[stringNumber] = currentEntry;

    // We did a pwn
    didPwn();
});

function exportBotMemory() {
	var theMemory = JSON.stringify(window.seenWords);

	console.log('To load bot memory, paste the following into the console:');
	console.log('window.seenWords = ' + theMemory + ';');
}

// Set an interval to check if we can pwn
setInterval(checkPwn, 100);

// Tell the user how to use it
console.log('Start typing words, eventually the bot will take over. You can type "exportBotMemory()" into the console without quotes to save your bot\'s current state.');
