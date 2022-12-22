import { newArticle, setColorScheme } from './modules/utils.js'

$(() => {

    // LISTENERS
    $("#newFact").click(async () => {
        newArticle(state);
    });

    $("#factBox").on({
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
    $("#newFact").click();
})
