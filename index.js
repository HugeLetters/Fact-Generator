import { getNewFact, parseWikiResponse, setColorScheme, setNewFact } from './modules/utils.js'

$(() => {

    // LISTENERS
    $("#newFact").click(() => {
        getNewFact(state);
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
        initial: true,
        transitionTime: 1000,
        wikiWorker: null,
        link: "",
        description: "",
        subject: ""
    }

    if (!window.Worker) {
        state.description = "It seems your browser doesn't support Web Workers";
        state.subject = "Sorry";
        setNewFact(state);
        return null;
    }
    state.wikiWorker = new Worker("./modules/wikiFetchWorker.js", { type: "module" });
    state.wikiWorker.onmessage = (e) => {

        if (!e.data?.status) {
            Object.assign(state, {
                subject: "Please try again",
                description: "Couldn't find anything 😵‍💫"
            });
        } else {
            Object.assign(state, {
                description: parseWikiResponse(e.data.page.article),
                subject: e.data.page.title,
                link: e.data.page.link,
            })
        };

        if (/.+ may refer to:/i.test(state.description) || state.description == '') {
            console.log("Triggered");
            console.log(state.description);
            state.wikiWorker.postMessage("newWikiFactRequested");
            return null;
        }

        setNewFact(state);
    };

    // INITIAL PAGE SETUP
    $("main, #factBox, #factArticle, .mainColor, .secondaryColor").css("transition-duration", `${state.transitionTime / 1000}s`);
    $("#loadingIcon").hide();
    $("#newFact").click();
})
