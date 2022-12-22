export const newArticle = async (state) => {

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

    setTimeout(async () => {

        const article = await getRandomWiki();

        $("#factBox").css({ "max-height": "300vh", "min-height": "0vh" });

        if (article.description.length > 550) {
            $("main").css({ "max-width": "93.75rem" })
        }
        else if (article.description.length > 350) {
            $("main").css({ "max-width": "56.25rem" })
        }
        else {
            $("main").css({ "max-width": "37.5rem" })
        }

        $("#factDescriptionText").text(article.description);
        $("#factSubjectText").text(article.subject);

        $("#tweet").attr("href", tweetIntentURL(`${article.subject} once said: ${article.description}`));
        $("#factSubjectLink").attr("href", article.link);

        $("#factArticle").css({ "opacity": 1 });
        $("#loadingIcon").hide().removeClass("loading");
        $("#newFact span").show();
        $("#newFact").prop('disabled', false).css("cursor", "pointer");
    }, 100)

}

export const setColorScheme = (mainColor, secondaryColor) => {
    $(".mainColor").css({ "color": mainColor, "background": secondaryColor });
    $(".secondaryColor").css({ "color": secondaryColor, "background": mainColor });
}

const randomInteger = (min = 0, max = min + 100) => (Math.floor(Math.random() * (max - min + 1) + min));

const randomChoiceArray = (arr) => (arr[randomInteger(0, arr.length - 1)]);

const tweetIntentURL = (tweet) => (
    `https://twitter.com/intent/tweet?text=${tweet}`
)

const getRandomWiki = async () => {

    const response = { subject: "Please try later :(", description: "Couldn't find anything", link: "" };

    const getRandomPageURL = `https://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&format=json&redirects&origin=*`
    const randomPageMeta = (await wikiAPIGetRequest(getRandomPageURL)).query.pages;
    const pageID = Object.keys(randomPageMeta)[0];
    // const pageID = "62994558";

    if (!pageID) return response;

    const pageTitle = randomPageMeta[pageID].title;
    // const pageTitle = "test";

    const getPageContentURL = `https://en.wikipedia.org/w/api.php?action=parse&pageid=${pageID}&format=json&redirects&origin=*`
    const wikiPage = (await wikiAPIGetRequest(getPageContentURL)).parse.text["*"];

    if (!wikiPage) return response;

    const wikiArticle = $($.parseHTML(wikiPage))
        .children("p")
        .filter(
            function () {
                const text = $(this).text();
                return text.length > 3 & !(/mw-parser-output/.test(text))
            }
        )
        .filter(":first").text().replace(/\[\d{1,2}\]/g, "")

    if (/.+ may refer to:/i.test(wikiArticle) || wikiArticle == '') { return await getRandomWiki() }

    Object.assign(response, { subject: pageTitle, description: wikiArticle, link: `https://en.wikipedia.org/?curid=${pageID}` });
    return response;
}

const wikiAPIGetRequest = async (URL) => {
    return await fetch(
        URL,
        { method: "GET", mode: "cors" }
    ).then(x => x.json())
}