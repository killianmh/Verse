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
        var memeContainer = $('<div>').addClass('meme-container container justify-content-center');
        var memeWord = $('<h2>').text(imageObject.randomSentence).addClass('row justify-content-center');
        var memeSentence = $('<h2>').text(imageObject.userSentence).addClass('row justify-content-center');
        var memePicture = $('<img>').attr('src', imageObject.image).addClass('row mx-auto d-block meme-picture');
        var memeShare = $('<div>').addClass('row justify-content-center addthis_inline_share_toolbox');
       
        
        memeContainer.append(memeWord).append(memePicture).append(memeSentence).append(memeShare);
        $('#container').html(memeContainer);

        database.ref('arrayContainer/trigger').remove();
    })

    

  })