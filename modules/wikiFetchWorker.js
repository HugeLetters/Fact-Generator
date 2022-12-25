onmessage = async (e) => {
    switch (e.data) {
        case "newWikiFactRequested":
            postMessage(await getRandomWiki());
            break;

        default:
            postMessage("Incorrect request");
            console.log("Incorrect request");
            break;
    }
};

const getRandomWiki = async () => {

    // const response = { status: false, subject: "Please try later :(", description: "Couldn't find anything", link: "" };
    const response = { status: false };

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

    Object.assign(response, {
        status: true, page:
        {
            title: pageTitle,
            article: wikiPage,
            link: `https://en.wikipedia.org/?curid=${pageID}`
        }
    });
    return response;
}

const wikiAPIGetRequest = async (URL) => {
    return await fetch(
        URL,
        { method: "GET", mode: "cors" }
    ).then(x => x.json())
}