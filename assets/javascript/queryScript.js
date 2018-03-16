var config = {
    apiKey: "AIzaSyBTv7aLpgOo0RSq4689Fr9a8K7fzF-aG0g",
    authDomain: "test-for-gif.firebaseapp.com",
    databaseURL: "https://test-for-gif.firebaseio.com",
    projectId: "test-for-gif",
    storageBucket: "",
    messagingSenderId: "832440429464"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  function getUrlVars()
  {
      var vars = {}, hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      for(var i = 0; i < hashes.length; i++)
      {
          hash = hashes[i].split('=');
          vars[hash[0]] = hash[1];
      }
      return vars;
  }
  

function parse_query_string(query) {
    var vars = query.split("&");
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      // If first entry with this name
      if (typeof query_string[pair[0]] === "undefined") {
        query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
      } else if (typeof query_string[pair[0]] === "string") {
        var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
        query_string[pair[0]] = arr;
        // If third or later entry with this name
      } else {
        query_string[pair[0]].push(decodeURIComponent(pair[1]));
      }
    }
    return query_string;
  }

  var imageObject;

  $(document).ready(function() {
      var num = getUrlVars().images;

      var numString = num.toString();

      

      database.ref('arrayContainer/trigger').set({
        trigger: 'yes'
    })

    database.ref('arrayContainer').on('value', function(snapshot){
        imageObject = snapshot.child('array/'+ numString).val();

        console.log(imageObject);
        var memeContainer = $('<div>').addClass('meme-container');
        var memeWord = $('<h2>').text(imageObject.randomSentence);
        var memeSentence = $('<p>').text(imageObject.userSentence);
        var memePicture = $('<img>').attr('src', imageObject.image);
        
        memeContainer.append(memeWord).append(memePicture).append(memeSentence);
        $('#container').html(memeContainer);

        database.ref('arrayContainer/trigger').remove();
    })

    

  })