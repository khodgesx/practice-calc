// Get Quotes From API

const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');

let apiQuotes = []

//Show New Quote
const newQuote=()=>{
    //random number between 0 and 1 and multiply that by length of array
    //combine with math floor = return the largest whole number less than or qual to given number

    // Pick a random quote from apiQuotes array:
    const quote = apiQuotes[Math.floor(Math.random() * apiQuotes.length)]

    //if quote is long, add long quote class
    quote.text.length > 50 ? quoteText.classList.add('long-quote') : quoteText.classList.remove('long-quote');
    quoteText.innerText = quote.text;

    //check if author field is blank and replace with unknown
    quote.author ? authorText.innerText = quote.author : authorText.innerText = 'Unknown'
    
}
//Using Local Quotes file if API crashes or doesn't work
// const localQuoteGet =()=>{
//     const quote2 = localQuotes[Math.floor(Math.random() * apiQuotes.length)]
//     console.log(quote2)
// }
const getQuotes = async()=>{
    const apiUrl = 'https://jacintodesign.github.io/quotes-api/data/quotes.json';
    try{
        const response = await fetch(apiUrl);
        apiQuotes = await response.json() //turning this into a JSON object
        newQuote();        
    }catch(err){
        //catch error info and do something
        alert(err)
    } 
}    

//Tweet Quote
const tweetQuote = ()=>{
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quoteText.textContent} - ${authorText.textContent}`;
    window.open(twitterUrl, '_blank')
}

// Event Listeners:
newQuoteBtn.addEventListener('click', newQuote)
twitterBtn.addEventListener('click', tweetQuote)

// On Load
getQuotes();
