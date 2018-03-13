
game = {
    variables : {
        username : "",
        userLine : "",
    },
    functions : {

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
                }
                             
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
    game.onClicks.getUserName();
    game.onClicks.getUserLine();
});