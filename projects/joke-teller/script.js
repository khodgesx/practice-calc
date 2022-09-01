
const button = document.getElementById('button');
const audioElement = document.getElementById('audio');

// Disable/Enable Button
const toggleButton=()=>{
    button.disabled = !button.disabled;
}

// Passing Joke to VoiceRSS API 
const tellMe=(joke)=>{
    console.log('tell me:', joke)
    VoiceRSS.speech({
        key: '12f147c4040e4421b6f6da47505a4fca',
        src: joke,
        hl: 'en-us',
        v: 'Linda',
        r: 0, 
        c: 'mp3',
        f: '44khz_16bit_stereo',
        ssml: false
    })
}


// Get Jokes from Joke API
const getJokes = async()=>{
    let joke = ''
    const apiUrl = 'https://sv443.net/jokeapi/v2/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist';
    try{
        const response = await fetch(apiUrl);
        const data = await response.json()
       if(data.setup){//setup only part of twopart jokes
        joke = `${data.setup} ... ${data.delivery}`;
       }else{
        joke = data.joke
       }
       // Text-to-Speech
       tellMe(joke);
       // Disable button
       toggleButton();
    }catch(err){
        //Catch errors here
        console.log('whoops',err)
    }
}

// Event Listeners:
button.addEventListener('click', getJokes);
audioElement.addEventListener('ended', toggleButton);