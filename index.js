import { newArticle, setColorScheme } from './modules/utils.js'

$(() => {

    // LISTENERS
    $("#new-fact").click(async () => {
        newArticle(state);
    });

    $("#fact-box").on({
        "mouseenter": () => {
            setColorScheme(state.secondaryColor, state.mainColor);
        },
        "mouseleave": () => {
            setColorScheme(state.mainColor, state.secondaryColor);
        },
    })

    // INITIALIZATION
    const state = {
        mainColor: "gray",
        secondaryColor: "white",
        initial: true
    }
    $("#loadingIcon").hide();
    $("#new-fact").click();
})
