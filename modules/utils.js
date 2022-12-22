export const newArticle = async (state) => {

    $("#fact-text, #author").css({ "opacity": 0 });

    setTimeout(async () => {
        const article = await getRandomWiki();
        $("#text").text(article.description);
        $("#author").text(article.subject);
        $("#tweet-fact").attr("href", tweetIntentURL(`${article.subject} once said: ${article.description}`))
        if (new Date().getTime() - state.timer > 499) {
            $("#fact-text, #author").css({ "opacity": 1 });
            $("#loadingIcon").hide().removeClass("loading");
            $("#new-fact span").show();
            $("#new-fact").prop('disabled', false);
        };
    }, 500)

    state.mainColor = `hsl(${70 + randomInteger(0, 340)}, ${30 + randomInteger(0, 70)}%, ${20 + randomInteger(0, 40)}%)`;
    state.secondaryColor = "white";
    if (state.initial) {
        setColorScheme(state.mainColor, state.secondaryColor);
        state.initial = false;
    } else {
        setColorScheme(state.secondaryColor, state.mainColor);
    };
    
    $("#loadingIcon").show().addClass("loading");
    $("#new-fact span").hide();
    $("#new-fact").prop('disabled', true);
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


    const getRandomPageURL = `https://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&format=json&redirects&origin=*`
    const randomPageMeta = (await wikiAPIGetRequest(getRandomPageURL)).query.pages;
    const pageID = Object.keys(randomPageMeta)[0];

    if (!pageID) return { subject: "Couldn't find anything", description: "Please try later :(" };

    const pageTitle = randomPageMeta[pageID].title;

    const getPageContentURL = `https://en.wikipedia.org/w/api.php?action=parse&pageid=${pageID}&format=json&redirects&origin=*`
    const wikiPage = (await wikiAPIGetRequest(getPageContentURL)).parse.text["*"];

    if (!wikiPage) return { subject: "Couldn't find anything", description: "Please try later :(" };

    const wikiArticle = $($.parseHTML(wikiPage))
        .children("p")
        .filter(
            function () {
                return $(this).text().length > 3
            }
        )
        .filter(":first").text().replace(/\[\d{1,2}\]/, "")


    return { subject: pageTitle, description: wikiArticle };
}

const wikiAPIGetRequest = async (URL) => {
    return await fetch(
        URL,
        { method: "GET", mode: "cors" }
    ).then(x => x.json())
}