
// track star input user made
var currentStar = -1;


// this is the js file to store and make user interactions
$(document).ready(function() {
	$('img').fadeTo(2000, 1);

	var starArray = $('.star');

	// fills in any stars that are hovered over to represent the rating
	$('.star').hover(function() {
		
		var index = findIndex(this);

		toggleStars(true, 0, index);
		toggleStars(false, index, starArray.length);

	});

	// unselects all stars if the div is not hovered
	$("#star-rating").hover(function() {}, function() {
		if(currentStar == -1) {
			toggleStars(false, 0, starArray.length);
		} else {
			toggleStars(false, 0, starArray.length);
			toggleStars(true, 0, currentStar);
		}
	});

	// toggle the star to either filled or not filled, depending on arguments
	function toggleStars(state, start, end) {
		for (var i = start; i < end; i++) {
			$(starArray[i]).toggleClass("fa-star-o", !state);
			$(starArray[i]).toggleClass("fa-star", state);
		}
	}

	// finds the index of the given star identity
	function findIndex(given) {
		var starID = $(given).attr('id');

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
		return index;
	}

	// colors over the given star identity
	$('.star').click(function() {
		var index = findIndex(this);
		toggleStars(true, 0, index);
		currentStar = index;
		console.log(currentStar);

	});
	
});


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

	reviews.set('rate', currentStar);
	currentStar = -1;

	// After setting each property, save your new instance back to your database
	reviews.save(null, {
		success:function() {
			getData();
		}
	}, {
		error: function() {
			alert('unable to save');
		}
	});
	return false;

});

function getData() {
	// Set up a new query for our Music class
	var query = new Parse.Query(Reviews);

	// Set a parameter for your query -- where the website property isn't missing
	//query.notEqualTo('website', '')

	/* Execute the query using ".find".  When successful:
	    - Pass the returned data into your buildList function
	*/
	query.find({
		success:function(results) {
			//buildList(results);
		}
	});
};

