import { newQuote } from './modules/utils.js'

$(() => {

    const timer = {};
    $("#new-quote").click(async () => {
        timer.time = new Date().getTime();
        newQuote(timer);
    });
    $("#new-quote").click();

    $("#quote-text, #author").css({
        "transition-property": "opacity",
        "transition-duration": "0.5s",
    });

    $(".mainColor,.secondaryColor").css({
        "transition-property": "color, background",
        "transition-duration": "1s",
    });
})
