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
        username1 : "",
        userChar1 : "",
        userLine1 : "",
        hypeChoice1 : "",
        word1 : "",
        sentence1 : "",
        username2 : "",
        userChar2 : "",
        userLine2 : "",
        hypeChoice2 : "",
        word2 : "",
        sentence2 : ""
    },
    pic : {
        arr: [],
        go: true,
        imageObjectForArray: {},
        indexNum: ""
    },

    functions : {
        generateGame : function(){

            // database.ref().once("value", function(snapshot){
            //     if (snapshot.val().players.one.username)
            // });
            // database.ref().set({
            //     players : {
            //         one : {
            //             username : "",
            //             userLine : "",
            //             userChar : "",
                        
            //         },
            //         two : {
            //             username : "",
            //             userLine : "",
            //             userChar : "",
            //         }
            //     },
            //     step : 1,
            // });
        },
        checkPlayers : function(){
            
            // database.ref().on("value", function(snapshot){
            //     // console.log(snapshot.val().players.one.username);
            //     // if (snapshot.val().step === 1){
                    
            //     //     console.log('test')
            //     // } else if (snapshot.val().step === 2) {
            //     //     database.ref('players/two').update({
            //     //         username : game.variables.username2
            //     //     })
            //     //     database.ref().update({
            //     //         step : 3
            //     //     })
            //     // }
            //     // if (snapshot.val().step === 3){
            //     //     database.ref('players/one').update({
            //     //         userChar : game.variables.userChar1
            //     //     })
            //     //     database.ref().update({
            //     //         step : 4
            //     //     })
            //     // } else if (snapshot.val().step === 4) {
            //     //     database.ref('players/two').update({
            //     //         userChar : game.variables.userChar2
            //     //     })
            //     //     database.ref().update({
            //     //         step : 5
            //     //     })
            //     // }
            //     // if (snapshot.val().step === 5){
            //     //     database.ref('players/one').update({
            //     //         userLine : game.variables.userLine1
            //     //     })
            //     //     database.ref().update({
            //     //         step : 6
            //     //     })
            //     // } else if (snapshot.val().step === 6) {
            //     //     database.ref('players/two').update({
            //     //         userLine : game.variables.userLine2
            //     //     })
            //     //     database.ref().update({
            //     //         step : 7
            //     //     })
            //     // }
            // });
        },
        getRapSentence : function() {
            var word;
            var rapSentence;
        
            var minCorpusCount = 50000;
            var exclude1 = "proper-noun";
            var exclude2 = "abbreviation";
            var exclude3 = "article";
        
            var charMin = 35;
            var charMax = 40;
        
            var randomWordQueryURL = "http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&excludePartOfSpeech="+ exclude1 + "&excludePartOfSpeech=" + exclude2 + "&excludePartOfSpeech=" + exclude3 + "&minCorpusCount="+minCorpusCount+"&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=4&maxLength=12&limit=1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";
        
            $.ajax({
                url: 'https://corsbridge.herokuapp.com/' + encodeURIComponent(randomWordQueryURL)
            }).then(function(randomWordResponse){
                word = randomWordResponse[0].word;

                var maxSentences = 70;
        
                var randomSentenceQueryURL = "http://api.wordnik.com:80/v4/word.json/"+ word + "/examples?includeDuplicates=false&useCanonical=false&skip=0&limit="+maxSentences+"&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5"
        
                $.ajax({
                    url: 'https://corsbridge.herokuapp.com/' + encodeURIComponent(randomSentenceQueryURL)
                }).then(function(randomSentenceResponse){
                    console.log(randomSentenceResponse);
                    for(i = 0; i<randomSentenceResponse.examples.length; i++){
                        var sentence = randomSentenceResponse.examples[i].text;
                        var splitSentence = sentence.split(word);
                        var snippet = splitSentence[0] + word;
                        var charCount = 0;
        
                        for(k = 0; k<snippet.length; k++){
                            charCount++;
                        }
                        
                        if(charCount > charMin && charCount < charMax){
                            rapSentence = snippet;
                            game.variables.word = word;
                            game.variables.sentence = rapSentence;
                            console.log(game.variables.word);
                            console.log(game.variables.sentence);
                            $('#random-line').text(game.variables.sentence+'...');
                            return
                        }
                    }
                    
                    if(rapSentence === undefined){
                        
                        for(i = 0; i<randomSentenceResponse.examples.length; i++){
                            var sentence2 = randomSentenceResponse.examples[i].text;
                            var splitSentence2 = sentence2.split(word);
                            var snippet2 = splitSentence2[0] + word;
                            var charCount2 = 0;
        
                            for(k = 0; k<snippet2.length; k++){
                                charCount2++;
                            }
                            
                            if(charCount2 > (charMin - 5) && charCount2 < (charMax + 5)){
                                rapSentence = snippet2;
                                game.variables.word = word;
                                game.variables.sentence = rapSentence;
                                console.log(word);
                                console.log(rapSentence);
                                $('#random-line').text(game.variables.sentence);
                            return
                        }
                    }
                    }
                })
            })
        },
        rhymeHelp : function(word){

            var numWords = 5;
            var rhymeQueryURL = "https://wordsapiv1.p.mashape.com/words/"+word+"/rhymes";

            $.ajax({
                url: rhymeQueryURL,
                method: "GET",
                headers: {
                "X-Mashape-Key": "ddjCflwLbmmshpr46LyV2dsijG5vp18NGwsjsnlNwVMkagEa6k",
                "X-Mashape-Host": "wordsapiv1.p.mashape.com"
                }

                }).then(function(response){
                    if(response.rhymes.all === undefined || response.rhymes.all.length === 1){
                        $(".rhyme-text").text("Try 'Mom's Spaghetti'");
                    }
                else{
                   var rhymeArray = [];
                   var bigRhymeArray = response.rhymes.all;
        
                   if(bigRhymeArray.includes(word)){
                      var index = bigRhymeArray.indexOf(word);
                      bigRhymeArray.splice(index,1);
                    }
        
                    var location = bigRhymeArray.indexOf(word);
                    var length;
                    var repeatIndex;
            
                    if(bigRhymeArray.length > numWords){
                        length = numWords;
                    }
                    else{
                        length = bigRhymeArray.length;
                    }
                    for(i = 0; i < bigRhymeArray.length; i++){
                        if(rhymeArray.length === length){
                            $(".rhyme-text").empty();
                            console.log(rhymeArray)
                            $(".rhyme-text").append("<li>"+rhymeArray[0]+"</li>");
                            $(".rhyme-text").append("<li>"+rhymeArray[1]+"</li>");
                            $(".rhyme-text").append("<li>"+rhymeArray[2]+"</li>");
                            $(".rhyme-text").append("<li>"+rhymeArray[3]+"</li>");
                            $(".rhyme-text").append("<li>"+rhymeArray[4]+"</li>");
                            return rhymeArray
                        }
                        else{
                            var rand = randNum(bigRhymeArray.length);
                            if(!rhymeArray.includes(bigRhymeArray[rand])){
                                rhymeArray.push(bigRhymeArray[rand]);
                            }
                        }
                    }
                }
                })

            function randNum(length){
                var randNum = Math.floor(Math.random()*(length));
                return randNum
            }
        },
        getGifs : function(word, sentence, givenSentence) {

            $.ajax({
                url:"https://api.giphy.com/v1/gifs/search?q=" + word + "&rating=pg&limit=1&api_key=CTQB8RbrPA6QANI0K2AHuM915bo0avta",
                method: "GET"
            }).then(function(response){
        
                game.pic.imageObjectForArray = {
                    image: response.data[0].images.fixed_height.url,
                    randomSentence: givenSentence,
                    userSentence: sentence
                };
        
                game.pic.arr.push(game.pic.imageObjectForArray);

                //game.pic.indexNum = game.pic.arr.length()-1;
        
        
                database.ref('arrayContainer').set({
                    array: game.pic.arr
                });
                
        
                var memeContainer = $('<div>').addClass('meme-container');
                var memeWord = $('<h2>').text(givenSentence);
                var memeSentence = $('<p>').text(sentence);
                var memePicture = $('<img>').attr('src', response.data[0].images.fixed_height.url);
        
                memeContainer.append(memeWord).append(memePicture).append(memeSentence);
                $('.battle').append(memeContainer);
                
                game.onClicks.goToQueryPage();
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
                   game.functions.getGifs(game.variables.word, game.variables.userLine, game.variables.sentence)
                   $('.battle').show();
                   $('html, body').animate({
                    scrollTop: $(".battle").offset().top
                }, 400); 
                $('.build-rap').fadeOut();  
                }
            }, 1000)
        },
    
    },    
    onClicks : {
        getUserName : function(){
            $('.info-character').hide()
            $('.hype-chars').hide()
            $('.build-rap').hide()
            $('.battle').hide()


            // This function gets the name that the user inputs on the title page and saves it as the username to be used throughout the game. 
            
            
            $('#user-name-submit').on('click', function(){
                var input = $('#user-name').val().trim();
                if (input !== ""){
                    database.ref().on("value", function(snapshot){
                        if (snapshot.val().step === 1){
                            game.variables.username1 = input
                            database.ref('players/one').update({
                                username : game.variables.username1
                            })
                            database.ref().update({
                                step : 2
                            })   
                        } else if (snapshot.val().step === 2){
                            game.variables.username2 = input                            
                            database.ref('players/two').update({
                                username : game.variables.username2
                            })
                            database.ref().update({
                                step : 3
                            })
                        } 
                    });
                    if (game.variables.username1 !== '' && game.variables.username2 !== ''){
                        // Scrolls page to next section
                        $('.info-character').fadeIn();
                        $('html, body').animate({
                            scrollTop: $(".info-character").offset().top
                        }, 400); 
                        $('.header').fadeOut();  
                        game.functions.checkPlayers();
                    }
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
                var choice = $(this).attr('id');
                database.ref().once("value", function(snapshot){
                    if (snapshot.val().step === 3){
                        game.variables.userChar1 = choice;
    
                    } else if (snapshot.val().step === 4){
                        game.variables.userChar2 = choice;
    
                    }
                });
                // Scrolls page to next section
                $('.hype-chars').fadeIn();
                $('html, body').animate({
                    scrollTop: $(".hype-chars").offset().top
                }, 400);  
                $('.info-character').fadeOut();
                // game.functions.checkPlayers();                
                
            });
        },
        chooseHype : function(){
            $('.hype-char-img').on('click',function(){
                var choice = $(this).data('name')
                game.variables.hypeChoice = choice;
                var hypeMan = $(this).clone();
                hypeMan.addClass('hype-choice-api');
                $('.hype-chosen').append(hypeMan);
                game.functions.getRapSentence();
                // $('#random-line').text(game.variables.sentence);
                game.functions.countdownTimer();
                $('.build-rap').fadeIn();
                
                $('html, body').animate({
                    scrollTop: $(".build-rap").offset().top
                }, 400); 
                $('.hype-chars').fadeOut();
                 
            });
        },
        getNewLine : function(){
            $('#random-line').text(game.variables.sentence);
            
            $('#want-new-line').on('click',function(){
                game.functions.getRapSentence();
            });
        },
        getUserLine : function(){
            // This function eventually needs to be a timeout instead of an onclick. It grabs the input that the user filled out and uses it to make their final rap image. If they don't enter anything, they fail. 
            $('#user-line-submit').on('click',function(){
                var input = $('#user-line').val().trim();
                if (input !== ""){

                    database.ref().once("value", function(snapshot){
                        if (snapshot.val().step === 5){
                            game.variables.userLine = input;
        
                        } else if (snapshot.val().step === 6){
                            game.variables.userLine = input;
        
                        }
                    });
                } else {
                    alert("You failed bro.")
                }
            });
        },
        hypeHelp : function(){
            // $('.rhyme-box').hide();
            
            $('.hype-chosen').hover(function(){
                $('.rhyme-box').fadeIn();  
                if(game.variables.hypeChoice == "eminem"){
                    $('.rhyme-text').text("Mom's Spaghetti?");
                } else{
                    $('.rhyme-text').text('Need rhymes?')
                }
            }, function(){
                // $('.rhyme-box').fadeOut();
            });
            $('.hype-chosen').on('click', function(){
                game.functions.rhymeHelp(game.variables.word);
                $('.rhyme-text').text('')
                
                

            })
        },

        goToQueryPage: function(){
            $('#meme-container').on('click', function(){
            document.location.href = "https://stevenhorkey.github.io/Project-One/queryPage.html?images=" + game.pic.indexNum;
        });
        }
    }
}


$(document).ready(function(){
    game.functions.generateGame();
    game.functions.checkPlayers();                        
    game.onClicks.getUserName();
    game.onClicks.chooseChar();
    game.onClicks.chooseHype();  
    game.onClicks.hypeHelp();  
    game.onClicks.getUserLine();
    game.onClicks.getNewLine();
    AOS.init();

   
    database.ref('players').set({
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
        })
    });
    database.ref('step').set({
        step : 1
    })
