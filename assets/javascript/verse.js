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
        player : "",
        username : "",
        userChar : "",
        userLine : "",
        hypeChoice : "",
        word : "",
        sentence : "",
    },
    pic : {
        arr: [],
        go: true,
        imageObjectForArray: {},
        indexNum: ""
    },

    functions : {
        generateGame : function(){
            database.ref().once("value", function(snapshot){
                if (snapshot.child('players/2/username').val() !== "") { 
                    console.log(snapshot)
                    $('section').hide();
                    $('body').text('enjoy your new virus!');
                }
            })
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

            var numWords = 4;
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
                    if(response.rhymes.all === undefined || response.rhymes.all.length === 1){
                        $(".rhyme-text").text("Idk bro. Try another line...");
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
                    console.log(rhymeArray);
                    for(i = 0; i < bigRhymeArray.length; i++){
                        if(rhymeArray.length === length){
                            $(".rhyme-text").empty();
                            console.log(rhymeArray)
                            $(".rhyme-text").append("<li>"+rhymeArray[0]+"</li>");
                            $(".rhyme-text").append("<li>"+rhymeArray[1]+"</li>");
                            $(".rhyme-text").append("<li>"+rhymeArray[2]+"</li>");
                            $(".rhyme-text").append("<li>"+rhymeArray[3]+"</li>");
                            // $(".rhyme-text").append("<li>"+rhymeArray[4]+"</li>");
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
                console.log(game.pic.arr);

                game.pic.indexNum = (game.pic.arr.length) - 1
                console.log(game.pic.indexNum);
        
                database.ref('arrayContainer').update({
                    array: game.pic.arr
                });

                database.ref('player/' + game.variables.player).update({
                    userImage : game.pic.imageObjectForArray
                })
                
                // game.functions.create();
                if (game.variables.player === 1){
                    setTimeout(game.functions.create,7000)
                } else if (game.variables.player === 2){
                    game.functions.create()
                }
                
                
                
                });
        
        },
        create : function(){

            database.ref('player/2').on("value", function(snapshot){
                
                database.ref('player').once("value", function(snapshot){
                
                
                // setTimeout(function(){
                    // console.log(snapshot.child('player/1').val().userImage.randomSentence)
                    var memeContainer1 = $('<div>').addClass('meme-container1 btn');
                    var memeWord1 = $('<h2>').text(snapshot.child('1').val().userImage.randomSentence);
                    var memeSentence1 = $('<p>').text(snapshot.child('1').val().userImage.userSentence);
                    var memePicture1 = $('<img>').attr('src', snapshot.child('1').val().userImage.image);
                    memePicture1.addClass('gif-img')
                    memeContainer1.append(memeWord1).append(memePicture1).append(memeSentence1);
                    
                    
                // },10000)
                
                

                
                
                    var memeContainer2 = $('<div>').addClass('meme-container2 btn');
                    var memeWord2 = $('<h2>').text(snapshot.child('2').val().userImage.randomSentence);
                    var memeSentence2 = $('<p>').text(snapshot.child('2').val().userImage.userSentence);
                    var memePicture2 = $('<img>').attr('src', snapshot.child('2').val().userImage.image);
                    memePicture2.addClass('gif-img')
                    
                    memeContainer2.append(memeWord2).append(memePicture2).append(memeSentence2);
                    console.log('testing inside')
                


                    $('#user-rap').append(memeContainer1).append(memeContainer2);
                    game.onClicks.goToQueryPage();
                })
            
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
                    game.functions.getGifs(game.variables.word, game.variables.userLine, game.variables.sentence);
                }
            });   
        },

        countdownTimer: function(){
            console.log('clock')
            var timeLeft = 30;
            $('#time-box').text(timeLeft);
            var myClock = setInterval(function(){
                timeLeft--;
                $('#time-box').text(timeLeft);
                if(timeLeft === 0){
                    clearInterval(myClock);
                    game.variables.userLine = $('#user-line').val().trim();
                    if(game.variables.player === 1){
                        game.functions.giphyFirebase();
                    } else if (game.variables.player === 2){
                        setTimeout(game.functions.giphyFirebase, 4000);
                    }
                    // setTimeout(function(){
                            database.ref("players").set({
                                1 : {
                                    username : "",
                                    userLine : "",
                                    userChar : "",
                                    hypeChosen : false
                                },
                                2 : {
                                    username : "",
                                    userLine : "",
                                    userChar : "",
                                    hypeChosen : false
                                },
                            }),
                            database.ref().update({
                                step : 1
                            })
                    // }, 1000);
                    
                    $('.battle').show();
                    $('html, body').animate({
                        scrollTop: $(".battle").offset().top
                }, 400); 
                $('.build-rap').fadeOut();  
                $('footer').show();  
                setTimeout(function(){
                    $('#restart-game').fadeIn();
                }, 7000);
                }
            }, 1000)
            
            
        },
        gotCharacter : function(){
            database.ref().on("value", function(snapshot){
                console.log(snapshot.child('players/1/username').val());
                if (snapshot.child('players/1/userChar').val() !== ""  && snapshot.child('players/2/userChar').val() !==  "" && snapshot.child('players/1/hypeChosen').val() === false  && snapshot.child('players/2/hypeChosen').val() ===  false && snapshot.child('step').val() !== 4){
                    console.log('gotCharacter Ran')
                      // Scrolls page to next section
                      $('.hype-chars').fadeIn();
                      $('html, body').animate({
                          scrollTop: $(".hype-chars").offset().top
                      }, 400);  
                      $('.info-character').fadeOut();
                      // game.functions.checkPlayers(); 
                      // database.ref().off();
                    // database.ref().off();
                      
                }
            });
        },
        chosenHype : function(){
            database.ref().on("value", function(snapshot){
                console.log(snapshot.child('players/1/hypeChosen').val());
                if (snapshot.child('players/1/hypeChosen').val() === true  && snapshot.child('players/2/hypeChosen').val() ===  true && snapshot.child('players/1/userChar').val() !== ""  && snapshot.child('players/2/userChar').val() !==  ""){
                    console.log('chosenHype Ran')
                    
                        database.ref('players/1').update({
                            hypeChosen : false
                        })
                        database.ref('players/2').update({
                            hypeChosen : false
                        })
                        
                        game.functions.getRapSentence();
                        // $('#random-line').text(game.variables.sentence);
                    game.functions.countdownTimer();
                    $('.build-rap').fadeIn();
                    
                    $('html, body').animate({
                        scrollTop: $(".build-rap").offset().top
                    }, 400); 
                    $('.hype-chars').fadeOut();
                    game.onClicks.hypeHelp(); 
                    game.onClicks.getNewLine();
                    game.onClicks.getUserLine();
                    database.ref().update({
                        step : 4
                    }) 
                // database.ref().off();
                    
                }
            });
        }
    },    
    onClicks : {
        getUserName : function(){
            $('.info-character').hide()
            $('.hype-chars').hide()
            $('.build-rap').hide()
            $('.battle').hide()


            // This function gets the name that the user inputs on the title page and saves it as the username to be used throughout the game. 
            
            
            $('#user-name-submit').on('click', function(){
                console.log('submit')
                var input = $('#user-name').val().trim();
                if (input !== ""){
                    database.ref().once("value", function(snapshot){
                        console.log(snapshot.val().step)
                        
                        if (snapshot.val().step === 1){
                            
                            game.variables.player = 1;
                            game.variables.username = input
                            database.ref('players/'+game.variables.player).update({
                                username : game.variables.username
                            })
                            database.ref().update({
                                step : 2
                            })   
                            $('#user-name').fadeOut();
                            $('#user-name-waiting').hide();
                            $('#user-name-waiting').text('Waiting for other player...');
                            $('#user-name-waiting').fadeIn();
                            $('#user-name-submit').fadeOut();

                        } else if (snapshot.val().step === 2){
                            game.variables.player = 2;                            
                            game.variables.username = input                            
                            database.ref('players/'+game.variables.player).update({
                                username : game.variables.username
                            })
                            database.ref().update({
                                step : 3
                            })
                        }
                    });
                } else {
                    $('#user-name-waiting').text('Must enter a name!')
                    $('#user-name-waiting').fadeIn();
                }
                             
            });
            $(document).bind('keypress', function(event) {
                if(event.keyCode==13){
                     $('#user-name-submit').trigger('click');
                 }
            });
            database.ref().on("value", function(snapshot){
                if (snapshot.val().step === 3 && snapshot.child('players/1/userChar').val() === ""  && snapshot.child('players/2/userChar').val() ===  ""){
                    $('.info-character').fadeIn();
                    $('html, body').animate({
                        scrollTop: $(".info-character").offset().top
                    }, 400); 
                    $('.header').fadeOut();  
                    // game.functions.checkPlayers();
                    game.onClicks.chooseChar();
                    
                } 
                
            });
         
        
        },
        chooseChar : function(){
            $('.user-chars').on('click',function(){
                var choice = $(this).attr('id');
                console.log(choice)
                database.ref().once("value", function(snapshot){
                    // if (snapshot.val().step === 3){
                        game.variables.userChar = choice;
                        database.ref('players/'+game.variables.player).update({
                            userChar : game.variables.userChar
                        })
                        // database.ref().update({
                        //     step : 4
                        // })   
                        $('.user-chars').fadeOut();
                        $('.characters').text('Waiting for other player...')
    
                    // } else if (snapshot.val().step === 4){
                    //     game.variables.userChar = choice;
                    //     database.ref('players/'+game.variables.player).update({
                    //         userChar : game.variables.userChar
                    //     })
                    //     database.ref().update({
                    //         step : 5
                    //     })   
                    // }
                });
                // database.ref().on("value", function(snapshot){
                //     if (snapshot.val().step === 5){
                //     // Scrolls page to next section
                //         $('.hype-chars').fadeIn();
                //         $('html, body').animate({
                //             scrollTop: $(".hype-chars").offset().top
                //         }, 400);  
                //         $('.info-character').fadeOut();
                //         // game.functions.checkPlayers(); 
                //         // database.ref().off();
                         
                        
                //     }
                // });
                              
                
            });
        },
        chooseHype : function(){
            $('.hype-char-img').on('click',function(){
                var choice = $(this).data('name')
                game.variables.hypeChoice = choice;
                var hypeMan = $(this).clone();
                hypeMan.addClass('hype-choice-api');
                $('.hype-chosen').append(hypeMan);
                database.ref().once("value", function(snapshot){
                    // if (snapshot.val().step === 5){
                    database.ref('players/'+game.variables.player).update({
                        hypeChosen : true
                    })
                        // database.ref().update({
                        //     step : 6
                        // })   
    
                    // } else if (snapshot.val().step === 6){
                    //     database.ref('players/'+game.variables.player).update({
                    //         hypeChosen : true
                    //     })
                    //     database.ref().update({
                    //         step : 7
                
                    // }
                    
                });
                
                
                $('.hype-char').fadeOut();
                $('#hype-info').text('Waiting for other player...')
                // database.ref().on("value", function(snapshot){
                //     if (snapshot.val().step === 7){
                        
                         
                        
                //     }
                // });
                 
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
            $('.rhyme-box').hide();
            
            $('.hype-chosen').hover(function(){
                $('.rhyme-box').fadeIn();  
                if(game.variables.hypeChoice == "eminem"){
                    $('.rhyme-text').text("Mom's Spaghetti?");
                } else{
                    $('.rhyme-text').text('Need rhymes?')
                }
                
            }, function(){
                $('.rhyme-box').fadeOut();
            });
            $('.hype-chosen').on('click', function(){
                // $('.rhyme-box').show();
                game.functions.rhymeHelp(game.variables.word);
            })
            
        },
        restart : function(){
            $('#restart-game').on('click', function(){
                location.reload();
            });
        },
        goToQueryPage: function(){
            var indexNumString = (game.pic.indexNum).toString();
            var playerString = (game.variables.player).toString();
            $('.meme-container'+ playerString).on('click', function(){
            document.location.href = "https://stevenhorkey.github.io/Project-One/queryPage.html?images=" + indexNumString;
        });
        }
    }
}


$(document).ready(function(){
    // console.log(snapshot.child('step').val())
    game.onClicks.restart();
    $('#restart-game').hide();
    $('footer').hide();
    game.functions.generateGame();
    game.onClicks.getUserName();
    game.onClicks.chooseHype();  
    game.functions.chosenHype();
    game.functions.gotCharacter();
    AOS.init();
// Fix the scroll issues later.
// Get new domain name
// Fix plurals in rhymes
// Append other character to build rap screen
// Style images to share
// Fix the instructions
// Check if fiberbase variables are empty instead of using steps

    // database.ref().on("value", function(snapshot){
    //     console.log(snapshot.child('players/1/hypeChosen').val());
    //     if (snapshot.child('players/1/hypeChosen').val() === true  && snapshot.child('players/2/hypeChosen').val() ===  true){
    //             database.ref('players/1').update({
    //                 hypeChosen : false
    //             })
    //             database.ref('players/2').update({
    //                 hypeChosen : false
    //             })
                
    //             game.functions.getRapSentence();
    //             // $('#random-line').text(game.variables.sentence);
    //         game.functions.countdownTimer();
    //         $('.build-rap').fadeIn();
            
    //         $('html, body').animate({
    //             scrollTop: $(".build-rap").offset().top
    //         }, 400); 
    //         $('.hype-chars').fadeOut();
    //         game.onClicks.hypeHelp(); 
    //         game.onClicks.getNewLine();
    //         game.onClicks.getUserLine();
    //         database.ref().update({
    //             step : 0
    //         }) 
    //     }
    // });


});
