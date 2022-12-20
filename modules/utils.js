export const newQuote = async (timer) => {

    $("#quote-text, #author").css({ "opacity": 0 });

    setTimeout(async () => {
        const quote = await getRandomQuote();
        document.getElementById("text").innerText = quote.quote;
        document.getElementById("author").innerText = quote.author;
        $("#tweet-quote").attr("href", tweetIntentURL(`${quote.author} once said: ${quote.quote}`))
        if (new Date().getTime() - timer.time > 499) {
            $("#quote-text, #author").css({ "opacity": 1 });
        };
    }, 500)

    const mainColor = `hsl(${70 + randomInteger(0, 340)}, ${30 + randomInteger(0, 70)}%, ${20 + randomInteger(0, 40)}%)`;
    setColorScheme(mainColor, "white");
}

const randomInteger = (min = 0, max = min + 100) => (Math.floor(Math.random() * (max - min + 1) + min));

const getRandomQuote = async () => (
    randomChoiceArray((await fetch(
        "https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json",
        { method: "GET" })
        .then(x => x.json())).quotes)
)

const setColorScheme = (mainColor, secondaryColor) => {
    $(".mainColor").css({ "color": mainColor, "background": secondaryColor });
    $(".secondaryColor").css({ "color": secondaryColor, "background": mainColor });
}

const randomChoiceArray = (arr) => (arr[randomInteger(0, arr.length - 1)]);

const tweetIntentURL = (tweet) => (
    `https://twitter.com/intent/tweet?text=${tweet}`
)