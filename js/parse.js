



// this is the js file to store and make user interactions
$(document).ready(function() {
	$('img').fadeTo(2000, 1);

	var starArray = $('.star');

	$('.star').hover(function() {
		
		var starID = $(this).attr('id');

		var index;
		switch (starID) {
			case 'star5':
				index = 5;
				break;
			case 'star4':
				index = 4;
				break;
			case 'star3':
				index = 3;
				break;
			case 'star2':
				index = 2;
				break;
			case 'star1':
				index = 1;
				break;
			default:
				index = -1;
		}

		toggleStars(true, 0, index);
		toggleStars(false, index, starArray.length);
	});

	$("#star-rating").hover(function() {}, function() {
		toggleStars(false, 0, starArray.length);
	});

	function toggleStars(state, start, end) {
		for (var i = start; i < end; i++) {
			$(starArray[i]).toggleClass("fa-star-o", !state);
			$(starArray[i]).toggleClass("fa-star", state);
		}
	}
});


// var handleIn = function(star) {
	
// };

// var handleOut = fuction() {

// };

// Initialize Parse app
 Parse.initialize("bj0XEgiqJuXgawhlDKdvgZkExjfKTRYwEUIzqroG", "ypMTQVrr0vW2y3MRueaRu6RDjyh7cKDx7Bgch1Aq");

// Create a new sub-class of the Parse.Object, with name "Reviews"
 var Reviews = Parse.Object.extend('Reviews');

$('form').submit(function() {

	// Create a new instance of that class.
	var reviews = new Reviews();
	$(this).find('input').each(function() {
		reviews.set($(this).attr('id'), $(this).val());
		$(this).val('');
	});

});

