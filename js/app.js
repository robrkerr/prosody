'use strict';
var app;

app = angular.module('wordbeatApp', []);

app.controller("BodyController", function($scope, $http) {
  var find_word;
  $scope.lines = [
    {
      text: "",
      words: []
    }
  ];
  $scope.url = "http://anywhere.anyrhyme.com/";
  $scope.refresh = function(line) {
    var i, line_text, word_texts, _results;
    line_text = line.text.replace(/[\.,-\/#!\?$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s{2,}/g, " ");
    word_texts = line_text.split(" ");
    i = 0;
    _results = [];
    while (i < Math.max(line.words.length, word_texts.length)) {
      if (i < word_texts.length) {
        find_word(line, i, word_texts[i]);
      } else {
        find_word(line, i, "");
      }
      _results.push(i = i + 1);
    }
    return _results;
  };
  find_word = function(line, i, word_text) {
    var search_url;
    if (word_text.length === 0) {
      if (i < line.words.length) {
        return line.words = line.words.slice(0, i);
      }
    } else {
      line.words[i] = {
        text: word_text
      };
      search_url = $scope.url + "search/" + word_text.toLowerCase() + ".json";
      return $http({
        method: 'GET',
        url: search_url,
        cache: true
      }).then(function(response) {
        if (line.words[i].text === word_text) {
          return line.words[i].data = response.data.filter(function(v) {
            return v.label === word_text.toLowerCase();
          });
        }
      });
    }
  };
  return $scope.input_keydown = function($event, line_index) {
    if ($event.keyCode === 13) {
      return $scope.lines.splice(line_index + 1, 0, {
        text: "",
        words: []
      });
    } else if ($event.keyCode === 8) {
      if (($scope.lines[line_index].text.length === 0) && ($scope.lines.length > 1)) {
        return $scope.lines.splice(line_index, 1);
      }
    }
  };
});
