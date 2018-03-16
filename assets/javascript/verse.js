// Initialize Firebase
var config = {
apiKey: "AIzaSyBx9Yt8xafU7Zz3zuAczc1RfoW-EktImyI",
authDomain: "verse-7f3f4.firebaseapp.com",
databaseURL: "https://verse-7f3f4.firebaseio.com",
projectId: "verse-7f3f4",
storageBucket: "",
messagingSenderId: "374838587919"
};
firebase.initializeApp(config);
var database = firebase.database();
  
game = {
    variables : {
        username : "",
        userLine : "",
        hypeChoice : "",
        word : "",
        sentence : ""
    },
    pic : {
        arr: [],
        go: true,
        imageObjectForArray: {}
    },

    functions : {
        generateGame : function(){
            database.ref().set({
                players : {
                    one : {
                        username : "",
                        userLine : "",
                        userChar : "",
                        
                    },
                    two : {
                        username : "",
                        userLine : "",
                        userChar : "",
                    }
                }
            });
        },
        checkPlayers : function(){
            
            database.ref().once("value", function(snapshot){
                console.log(snapshot.val().players.one.username);
                if (snapshot.val().players.one.username === ""){
                    database.ref('players/one').update({
                        username : game.variables.username
                    })
                } else if (snapshot.val().players.two.username === "") {
                    database.ref('players/two').update({
                        username : game.variables.username
                    })
                }
            });
        },
        getRandomWord : function(){
            var minCorpusCount = 50000;
            var exclude1 = "proper-noun";
            var exclude2 = "abbreviation";
            var exclude3 = "article";
        
            var randomWordQueryURL = "http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&exclude"+ exclude1 + "&exclude" + exclude2 + "&exclude" + exclude3 + "&minCorpusCount="+minCorpusCount+"&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=4&maxLength=12&limit=1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";
        
            var word;
        
            $.ajax({
                url: randomWordQueryURL,
                method: "GET"
            }).then(function(response){
                word = response[0].word;
                // displayword(word);
                setTimeout(getRandomSentence(word),5000);
            })
            var exampleSentenceURL = "https://wordsapiv1.p.mashape.com/words/" + word;

            game.variables.word = word;
        
        },
        getRandomSentence : function(word){
            console.log(word);
        
            var randomSentenceQueryURL = "http://api.wordnik.com:80/v4/word.json/"+ word + "/examples?includeDuplicates=false&useCanonical=false&skip=0&limit=50&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5"
        
            $.ajax({
                url: randomSentenceQueryURL,
                method: "GET"
            }).then(function(response){
                console.log(word);
        
                selectRapSentence(word, response,0);
            })
        },
        selectRapSentence : function(word, response, num){
            console.log(response.examples.length)
            var word = word;
            var response = response;
            var rapSentence;
        
            for(i = 0; i<response.examples.length; i++){
                var sentence = response.examples[i].text;
                var splitSentence = sentence.split(word);
                var snippet = splitSentence[num] + word;
                console.log(snippet);
        
                var wordCount = 1;
                for(j = 0; j<snippet.length; j++){
                    if(snippet[j] === " "){
                        wordCount++;
                    }
                }
                var charCount = 0;
                for(k = 0; k<snippet.length; k++){
                    charCount++;
                }
                console.log(wordCount);
                console.log(charCount);
                if(wordCount <= 11 && wordCount > 6 && charCount < 40){
                    rapSentence = snippet;
                    console.log(wordCount);
                    console.log(charCount);
                    console.log(rapSentence);
                    return
                }
            }
            console.log(rapSentence)
        
            // Need to add code if this doesn't return a sentence
        },
        rhymeHelp : function(word){

            var rhymeQueryURL = "https://wordsapiv1.p.mashape.com/words/"+word+"/rhymes";
        
            $.ajax({
                url: rhymeQueryURL,
                method: "GET",
                headers: {
                    "X-Mashape-Key": "ddjCflwLbmmshpr46LyV2dsijG5vp18NGwsjsnlNwVMkagEa6k",
                    "X-Mashape-Host": "wordsapiv1.p.mashape.com"
                }
        
            }).then(function(response){
                console.log(response);
                console.log(response.rhymes.all[0])
        
                var rand = Math.floor(Math.random()*(response.rhymes.all.length));
                if(response.rhymes.all[rand] === word){
                    var rand2 = Math.floor(Math.random()*(response.rhymes.all.length));
                    console.log(response.rhymes.all[rand2])
                    console.log("had to recalculate")
                }
                else{
                    console.log(response.rhymes.all[rand]);
                }
                
            })
        },
        getGifs : function(word, sentence, randomSentence) {

            $.ajax({
                url:"http://api.giphy.com/v1/gifs/search?q=" + word + "&rating=pg&limit=1&api_key=CTQB8RbrPA6QANI0K2AHuM915bo0avta",
                method: "GET"
            }).then(function(response){
        
                game.pic.imageObjectForArray = {
                    image: response.data[0].images.fixed_height.url,
                    randomSentence: word,
                    userSentence: sentence
                };
        
                game.pic.arr.push(game.pic.imageObjectForArray);
        
        
                database.ref('arrayContainer').set({
                    array: game.pic.arr
                });
                
        
                var memeContainer = $('<div>').addClass('meme-container');
                var memeWord = $('<h2>').text(randomSentence);
                var memeSentence = $('<p>').text(sentence);
                var memePicture = $('<img>').attr('src', response.data[0].images.fixed_height.url);
        
                memeContainer.append(memeWord).append(memePicture).append(memeSentence);
                $('.battle').append(memeContainer);
                
                });
        
        },
        giphyFirebase: function() {
            database.ref('arrayContainer/trigger').set({
                trigger: 'yes'
            })
            
            database.ref().once('value', function(snapshot){
                if(snapshot.child('arrayContainer/array').exists()){

                    console.log(snapshot.child('arrayContainer/array').val());

                    game.pic.arr = snapshot.child('arrayContainer/array').val();
                    game.pic.go = true;
            
                } else {
                    game.pic.go = true
                } if(game.pic.go) {
                    game.functions.getGifs('green', 'panther');
                }
            });   
        },

        countdownTimer: function(){
            var timeLeft = 30;
            $('#time-box').text(timeLeft);
            setInterval(function(){
                timeLeft--;
                $('#time-box').text(timeLeft);
                if(timeLeft === 0){
                   game.variables.userLine = $('#user-line').val().trim();
                   getGifs(game.variables.word, game.variables.userLine, game.variables.sentence)
                   $('html, body').animate({
                    scrollTop: $(".battle").offset().top
                }, 400); 
                $('.build-rap').fadeOut();  
                }
            }, 1000)
        }
        
    onClicks : {
        getUserName : function(){
            // This function gets the name that the user inputs on the title page and saves it as the username to be used throughout the game. 
            $('#user-name-submit').on('click', function(){
                var input = $('#user-name').val().trim();
                if (input !== ""){
                    game.variables.username = input;
                    console.log(game.variables.username)

                    // Scrolls page to next section
                    $('html, body').animate({
                        scrollTop: $(".info-character").offset().top
                    }, 400); 
                    $('.header').fadeOut();  
                    game.functions.checkPlayers()
                };
                             
            });
            $(document).bind('keypress', function(event) {
                if(event.keyCode==13){
                     $('#user-name-submit').trigger('click');
                 }
            });
            
        },
        chooseChar : function(){
            $('.user-chars').on('click',function(){
                var choice = $(this);
                console.log(choice.attr('id'));
                // Scrolls page to next section
                
                $('html, body').animate({
                    scrollTop: $(".hype-chars").offset().top
                }, 400);  
                $('.info-character').fadeOut();
                
                
            });
        },
        chooseHype : function(){
            $('.hype-char-img').on('click',function(){
                var choice = $(this).data('name')
                game.variables.hypeChoice = choice;
                var hypeMan = $(this).clone();
                hypeMan.addClass('hype-choice-api');
                $('.hype-chosen').append(hypeMan);
                game.functions.getRandomWord();
                game.functions.getRandomSentence(game.variables.word);
                game.functions.countdownTimer();
                $('html, body').animate({
                    scrollTop: $(".build-rap").offset().top
                }, 400); 
                $('.hype-chars').fadeOut();
                
                
            });
        },
        getUserLine : function(){
            // This function eventually needs to be a timeout instead of an onclick. It grabs the input that the user filled out and uses it to make their final rap image. If they don't enter anything, they fail. 
            $('#user-line-submit').on('click',function(){
                var input = $('#user-line').val().trim();
                if (input !== ""){
                    game.variables.userLine = input;
                    console.log(game.variables.userLine)
                } else {
                    alert("You failed bro.")
                }
            });
        },
        hypeHelp : function(){
            $('.rhyme-box').hide();
            
            $('.hype-chosen').hover(function(){
                $('.rhyme-box').fadeIn();  
                if(game.variables.hypeChoice == "eminem"){
                    $('.rhyme-text').text("Mom\'s Spaghetti?");
                } else{
                    $('.rhyme-text').text('Need rhymes?')
                }
            }, function(){
                $('.rhyme-box').fadeOut();
            });
            $('.hype-chosen').on('click', function(){
                game.functions.rhymeHelp(game.variables.word);
                console.log('het')

            })
        }
    }
}
}

$(document).ready(function(){
    game.functions.generateGame();
    game.onClicks.getUserName();
    game.onClicks.chooseChar();
    game.onClicks.chooseHype();  
    game.onClicks.hypeHelp();  
    game.onClicks.getUserLine();
    AOS.init();
});