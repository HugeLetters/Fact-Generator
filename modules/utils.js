export const getNewFact = (state) => {
    state.wikiWorker.postMessage("newWikiFactRequested");
    factStyling(state, true);
}

export const setNewFact = (state) => {

    $("#factSubjectText").text(state.subject);
    $("#factDescriptionText").text(state.description);
    $("#factSubjectLink").attr("href", state.link);

    $("#tweet").attr("href", tweetIntentURL(`${state.subject} wiki article says: ${state.description}`));

    factStyling(state, false);
};

export const setColorScheme = (mainColor, secondaryColor) => {
    $(".mainColor").css({ "color": mainColor, "background": secondaryColor });
    $(".secondaryColor").css({ "color": secondaryColor, "background": mainColor });
}

export const parseWikiResponse = (wiki) => ($($.parseHTML(wiki))
    .children("p")
    .filter(
        function () {
            const text = $(this).text();
            return text.length > 3 & !(/mw-parser-output/.test(text))
        }
    )
    .filter(":first").text().replace(/\[\d{1,2}\]/g, ""))

const factStyling = (state, start = true) => {

    if (start) {
        $("#factArticle").css({ "opacity": 0 });
        $("#loadingIcon").show().addClass("loading");
        $("#newFact span").hide();
        $("#newFact").prop('disabled', true).css("cursor", "progress");

        state.mainColor = `hsl(${70 + randomInteger(0, 340)}, ${30 + randomInteger(0, 70)}%, ${20 + randomInteger(0, 40)}%)`;
        state.secondaryColor = "white";
        if (state.initial) {
            setColorScheme(state.mainColor, state.secondaryColor);
            state.initial = false;
        } else {
            setColorScheme(state.secondaryColor, state.mainColor);
        };

        const height = $("#factBox").outerHeight(true);
        $("#factBox").css("transition-duration", `0s`);
        $("#factBox").css({ "max-height": `${height}px`, "min-height": `${height}px` });
        $("#factBox").css("transition-duration", `${state.transitionTime / 1000}s`);
    } else {
        $("#factArticle").css({ "opacity": 1 });
        $("#loadingIcon").hide().removeClass("loading");
        $("#newFact span").show();
        $("#newFact").prop('disabled', false).css("cursor", "pointer");

        $("#factBox").css({ "max-height": "1000vh", "min-height": "0vh" });

        if (state.description.length > 550) {
            $("main").css({ "max-width": "95vw" })
        }
        else if (state.description.length > 350) {
            $("main").css({ "max-width": "60vw" })
        }
        else {
            $("main").css({ "max-width": "40vw" })
        }
    }
};

const randomInteger = (min = 0, max = min + 100) => (Math.floor(Math.random() * (max - min + 1) + min));

const tweetIntentURL = (tweet) => (
    `https://twitter.com/intent/tweet?text=${tweet}`
)