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
    },
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
            });
        },
        chooseHype : function(){
            $('.hype-char-img').on('click',function(){
                var choice = $(this).data('name')
                game.variables.hypeChoice = choice;
                var hypeMan = $(this).clone();
                hypeMan.addClass('hype-choice-api');
                $('.user-rap').append(hypeMan);
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
    }
}

$(document).ready(function(){
    game.functions.generateGame();
    game.onClicks.getUserName();
    game.onClicks.chooseChar();
    game.onClicks.chooseHype();    
    game.onClicks.getUserLine();

});
