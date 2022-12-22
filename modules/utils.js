export const newFact = async (state) => {

    $("#quote-text, #author").css({ "opacity": 0 });

    setTimeout(async () => {
        const quote = await getRandomWiki();
        $("#text").text(quote.quote);
        $("#author").text(quote.author);
        $("#tweet-quote").attr("href", tweetIntentURL(`${quote.author} once said: ${quote.quote}`))
        if (new Date().getTime() - state.timer > 499) {
            $("#quote-text, #author").css({ "opacity": 1 });
            $("#loadingIcon").hide().removeClass("loading");
            $("#new-quote span").show();
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
    $("#new-quote span").hide();
}

export const randomInteger = (min = 0, max = min + 100) => (Math.floor(Math.random() * (max - min + 1) + min));

export const setColorScheme = (mainColor, secondaryColor) => {
    $(".mainColor").css({ "color": mainColor, "background": secondaryColor });
    $(".secondaryColor").css({ "color": secondaryColor, "background": mainColor });
}

const randomChoiceArray = (arr) => (arr[randomInteger(0, arr.length - 1)]);

const tweetIntentURL = (tweet) => (
    `https://twitter.com/intent/tweet?text=${tweet}`
)

export const getRandomWiki = async () => {

    
    const getRandomPageURL = `https://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&format=json&redirects&origin=*`
    const randomPageMeta = (await wikiAPIGetRequest(getRandomPageURL)).query.pages;
    const pageID = Object.keys(randomPageMeta)[0];
    console.log(`Wikipedia page ID is ${pageID}`);

    if (!pageID) return null;

    const pageTitle = randomPageMeta[pageID].title;
    console.log(`Wikipedia page title is ${pageTitle}`);
    
    const getPageContentURL = `https://en.wikipedia.org/w/api.php?action=parse&pageid=${pageID}&format=json&redirects&origin=*`
    const wikiPage = (await wikiAPIGetRequest(getPageContentURL)).parse.text["*"];

    const wikiArticle = $($.parseHTML(wikiPage))
        .children("p")
        .filter(
            function () {
                return $(this).text().length > 3
            }
        )
        .filter(":first").text().replace(/\[\d{1,2}\]/, "")

    console.log(`Wikipedia page articles is \n${wikiArticle}`);
}

const wikiAPIGetRequest = async (URL) => {
    return await fetch(
        URL,
        { method: "GET", mode: "cors" }
    ).then(x => x.json())
}