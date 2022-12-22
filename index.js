import {  newArticle, setColorScheme } from './modules/utils.js'

$(() => {

    const state = {
        timer: 0,
        mainColor: "gray",
        secondaryColor: "white",
        initial: true
    }
    $("#loadingIcon").hide();
    
    $("#new-fact").click(async () => {
        state.timer = new Date().getTime();
        newArticle(state);
    });

    $("#new-fact").click();

    $("#fact-box").on({
        "mouseenter": () => {
            setColorScheme(state.secondaryColor, state.mainColor);
        },
        "mouseleave": () => {
            setColorScheme(state.mainColor, state.secondaryColor);
        },
    })
})
