'use strict'

app = angular.module 'wordbeatApp', []

app.controller "BodyController", ($scope,$http) ->
	$scope.lines = [{text: "", words: []}]
	$scope.url = "http://anywhere.anyrhyme.com/"
	# $scope.url = "http://localhost:3000/"

	$scope.refresh = (line) ->
		line_text = line.text.replace(/[\.,-\/#!\?$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ")
		word_texts = line_text.split(" ")
		i = 0
		while (i < Math.max(line.words.length,word_texts.length))
			if (i < word_texts.length)
				find_word(line,i,word_texts[i])
			else
				find_word(line,i,"")
			i = i+1

	find_word = (line,i,word_text) ->
		if (word_text.length == 0)
			if (i < line.words.length)
				line.words = line.words.slice(0,i)
		else
			line.words[i] = {text: word_text}
			search_url = $scope.url + "search/" + word_text + ".json" 
			$http({method: 'GET', url: search_url, cache: true}).then (response) -> 
				if (line.words[i].text == word_text)
					line.words[i].data = response.data.filter (v) -> v.label == word_text
	
	


