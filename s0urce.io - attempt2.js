(function() {
    // Check if we've already started the hook
    if(window.ash47_pwnHook == null) {
        // Reset the images we've seen
        window.ash47_seenImages = window.ash47_seenImages || {};

        // Hook the image loading
        $('.tool-type-img').get()[0].onload = function() {
            window.ash47_pwnHook();
        }

        // Hook the form submission
        $('#tool-type-form').submit(function() {
            // We did a submission
            window.ash47_didSubmit();

            // Attempt to store the word
            window.ash47_storeWord();
        });

        // Anything we type automatically takes priority
        $('#tool-type-word').keyup(function() {
            window.ash47_storeWord();
        });

        // Add librarys
        window.addLibrary = function(loc) {
            var newScript = document.createElement('script');
            newScript.setAttribute('src', loc);
            document.head.appendChild(newScript);
        };

        // Library for image recognition
        window.addLibrary('https://cdn.rawgit.com/naptha/tesseract.js/1.0.10/dist/tesseract.js');
    }

    // The fastest we can push answers
    window.ash47_maxSubmitTime = 1000 * 1;
    window.ash47_bonusDelay = 100;

    // Export brain
    window.exportBrain = function() {
        console.log('window.importBrain(\'' + JSON.stringify(window.ash47_seenImages) + '\');');
    };

    // Import brain
    window.importBrain = function(newBrain) {
        try {
            window.ash47_seenImages = JSON.parse(newBrain);
            console.log('Brain successfullyy imported!');
        } catch(e) {
            console.log('Error importing brain!');
        }
    };

    // Add a line of info
    window.ash47_addline = function(txt) {
        var con = $('#cdm-text-container');
        
        con.append($('<div>', {
            text: txt
        }));

        con.scrollTop(con.prop('scrollHeight'));
    };

    // Attempt to store the word
    window.ash47_storeWord = function() {
        var currentValue = $('#tool-type-word').val();
        var stringNumber = $('.tool-type-img').attr('src');

        if(currentValue.length > 0) {
            window.ash47_seenImages[stringNumber] = currentValue;
        }
    };

    // Checks if we are allowed to submit
    window.ash47_canSubmit = function() {
        if(window.ash47_lastSubmission == null) return true;
        var now = new Date();
        var timeDifference = now - window.ash47_lastSubmission;

        // Ensure we have waited enough time
        return timeDifference > window.ash47_maxSubmitTime;
    };

    // Returns how long left until we can do the next submit
    window.ash47_howLongLeft = function() {
        if(window.ash47_lastSubmission == null) return 0;
        var now = new Date();
        var timeDifference = now - window.ash47_lastSubmission;

        if(timeDifference > window.ash47_maxSubmitTime) {
            return window.ash47_bonusDelay;
        } else {
            return timeDifference + window.ash47_bonusDelay;
        }
    };

    // Do a submission, IF WE ARE ALLOWED
    window.ash47_doSubmit = function() {
        // Are we allowed to submit?
        if(window.ash47_canSubmit()) {
            // Do the submit
            $('#tool-type-form').submit();

            // Ensure we actually mark us as recently submitted
            window.ash47_didSubmit();
        } else {
            // Sleep until we are allowed to submit
            setTimeout(function() {
                // Do the submit
                window.ash47_doSubmit();
            }, window.ash47_howLongLeft());
        }
    };

    // Marks that we just did a submission
    window.ash47_didSubmit = function() {
        window.ash47_lastSubmission = new Date();
    };

    // Define our pwnage hook
    window.ash47_pwnHook = function() {
        var stringNumber = $('.tool-type-img').attr('src');
        if(window.ash47_seenImages[stringNumber]) {
            // Store the value
            $('#tool-type-word').val(window.ash47_seenImages[stringNumber]);

            // Wait for the delay
            window.ash47_doSubmit();
            return;
        }

        // Yep, we got one! Grab it
        var ourImage = $('.tool-type-img').get()[0];

        // Try to read it
        Tesseract.recognize($('.tool-type-img').get()[0], {
            // Only allow lowercase and underscore
            tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyz_23'
        })
            .then(function(result) {
                // Grab the text
                var res = result.text.trim().replace(/ /g, '');

                // Did we find something?
                if(res.length > 0) {
                    // Log what we see
                    window.ash47_addline('I see: ' + res);

                    // Store the value
                    $('#tool-type-word').val(res);

                    // Store the word
                    window.ash47_storeWord();

                    // Try to submit it
                    window.ash47_doSubmit();
                }
            });
    };
})();