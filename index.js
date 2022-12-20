import { newQuote } from './modules/utils.js'

$(() => {

    const timer = {};
    $("#new-quote").click(async () => {
        timer.time = new Date().getTime();
        newQuote(timer);
    });
    $("#new-quote").click();

})
