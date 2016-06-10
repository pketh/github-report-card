$( document ).ready(function() {

  var username = 'pketh'; // CHANGE THIS to your github name

  var profileURL = "https://github.com/" + username;
  $('.gh-username').html("<a href='" + profileURL + "'>" + username + "</a>");

  var gistsURL = "https://gist.github.com/" + username;
  var reposURL = "https://github.com/" + username +"?tab=repositories";

  var userPath = "https://api.github.com/users/" + username;
  var reposPath = "https://api.github.com/users/" + username + "/repos";

  var languages = [];
  // there is something similar in
  // https://github.com/doda/github-language-colors/blob/master/build.py
  var languageNameMapping = {
      'C++': 'cpp',
      'C#': 'C Sharp',
  }

  // get user profile json
  $.getJSON(userPath, function(userResult){

    // avatar pic
    var avatar = userResult.avatar_url;
    $('.gh-avatar').html("<a href=" + profileURL + "><img src='" + avatar + "'></a>");

    // get last activity month
    var ghMonth = parseInt(userResult.updated_at.substring(5,7));
    // get current month
    var d = new Date();
    var currentMonth = d.getMonth() + 1;

    // has it been a month or less since you're last activity?
    if (ghMonth === currentMonth || ghMonth + 1 === currentMonth || ghMonth === 13 && currentMonth === 01) {
      console.log("＼(＾▽＾*)");
      $('.gh-recently-active').removeClass('gh-hidden');
    };

    var reposNum = userResult.public_repos;
    $('.gh-repos').html("<a href='" + reposURL + "'>" + reposNum + " Repositories</a>")
    var gistsNum = userResult.public_gists;
    $('.gh-gists').html("<a href='" + gistsURL + "'>" + gistsNum + " Gists</a>")
  });

  // get languages for all repos from github
  $.getJSON(reposPath, function(reposResult){
    reposResult.forEach (function(obj){
      if(obj.language && obj.language !== 'undefined') {
        languages.push(obj.language)
      }
    });
    var maxNumberOfLanguages = getMaxLanguages(languages);
    var languagesSorted = languages.byCount();

    for (var i = 0; i < maxNumberOfLanguages; i++) {
      var languagesOutput;
      var languageColor = getLanguageColor(languagesSorted[i])
      var color = '<div class="gh-color" style="background-color:' + languageColor + '"></div> ';
      if (i === maxNumberOfLanguages - 1) {
         languagesOutput = '<div class="gh-language-block">' + color + languagesSorted[i] + '</div>'
      } else {
        languagesOutput = '<div class="gh-language-block">' + color + languagesSorted[i] + ', '  + '</div> '
      }
      console.log('do ' + languageColor + ' for ' + languagesSorted[i]);
      $('.gh-languages').append(languagesOutput)
    }

    function getMaxLanguages(languages) {
      var maxLanguages = 4
      if (languages.length > maxLanguages) {
        return maxLanguages
      } else {
        return languages.length
      }
    }

    function getLanguageColor(languageName) {
      console.log('fetching color for ' + languageName);
      var color = githubLanguageColors[languageName]
      if (color) {
          console.log('color is ' + githubLanguageColors[languageName]);
          return githubLanguageColors[languageName];
      } else {
          // language not found, try synonym
          console.log('color for ' + languageName + ' is ' + githubLanguageColors[languageName]);
          languageName = languageNameMapping[languageName];
          return githubLanguageColors[languageName];
      }
    }

  });

  // returns most frequent to least frequent
  Array.prototype.byCount= function(){
    var itm, a= [], L= this.length, o= {};
    for(var i= 0; i<L; i++){
      itm= this[i];
      if(!itm) continue;
      if(o[itm] === undefined) o[itm]= 1;
      else ++o[itm];
    }
    for(var p in o) a[a.length]= p;
    return a.sort(function(a, b){
      return o[b]-o[a];
    });
  }

});
