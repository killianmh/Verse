
game = {
    variables : {
        username : ""
    },
    functions : {

    },
    onClicks : {
        userSubmit : function(){
            $('#user-name-submit').on('click', function(){
                var input = $('#user-name').val().trim();
                if (input !== ""){
                    game.variables.username = input;
                    console.log(game.variables.username)
                }
            });
        }
    }
}

$(document).ready(function(){
    game.onClicks.userSubmit();
});