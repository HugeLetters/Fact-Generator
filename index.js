import { getRandomWiki, newQuote, setColorScheme } from './modules/utils.js'

$(() => {

    const state = {
        timer: 0,
        mainColor: "gray",
        secondaryColor: "white",
        initial: true
    }
    $("#loadingIcon").hide();
    
    $("#new-quote").click(async () => {
        state.timer = new Date().getTime();
        newFact(state);
    });

    $("#new-quote").click();

    $("#quote-box").on({
        "mouseenter": () => {
            setColorScheme(state.secondaryColor, state.mainColor);
        },
        "mouseleave": () => {
            setColorScheme(state.mainColor, state.secondaryColor);
        },
    })
})
