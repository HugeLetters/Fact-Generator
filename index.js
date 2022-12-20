import { newQuote, setColorScheme } from './modules/utils.js'

$(() => {

    const timer = {};
    $("#new-quote").click(async () => {
        timer.time = new Date().getTime();
        newQuote(timer);
    });
    $("#new-quote").click();
    console.log(1);

    $("#quote-box").on({
        "mouseenter mouseleave": () => {
            const main = $("#quote-box").css("color");
            const secondary = $("#quote-box").css("background-color");
            setColorScheme(secondary, main);
        },
    })
})
