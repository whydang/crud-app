

// this is the js file to store and make user interactions
$(document).ready(function() {
	$('img').fadeTo(2000, 1);
});

$('#test')[0].onload = function() {
	alert("");
};

// Initialize Parse app
Parse.initialize("bj0XEgiqJuXgawhlDKdvgZkExjfKTRYwEUIzqroG", "ypMTQVrr0vW2y3MRueaRu6RDjyh7cKDx7Bgch1Aq");

// Create a new sub-class of the Parse.Object, with name "Reviews"
var Reviews = Parse.Object.extend('Reviews');