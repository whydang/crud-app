
// track star input user made
var currentStar = 0;
var totalStar = 0;
var reviewCount = 0;

// this is the js file to store and make user interactions
$(document).ready(function() {
	$('img').fadeTo(2000, 1);

	var starArray = $('#star-rating .star');

	// fills in any stars that are hovered over to represent the rating
	$('#star-rating .star').hover(function() {
		
		var index = findIndex(this);

		toggleStars(true, 0, index);
		toggleStars(false, index, starArray.length);

	});

	// unselects all stars if the div is not hovered
	$("#star-rating").hover(function() {}, function() {
		if(currentStar == 0) {
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
	$('#star-rating .star').click(function() {
		var index = findIndex(this);
		toggleStars(true, 0, index);
		currentStar = index;
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
		if(currentStar < 1) {
			alert("please input a valid star from 1 to 5!");
		}
		currentStar = 0;

		reviews.set('up', 0);
		reviews.set('down', 0);

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

	// this function gets the data and processes them
	function getData() {
		// Set up a new query for our Music class
		var query = new Parse.Query(Reviews);
		query.notEqualTo('rate', 0);

		/* Execute the query using ".find".  When successful:
		    - Pass the returned data into your buildList function
		*/
		query.find({
			success:function(results) {
				buildList(results);
			}
		});
	};

	// populates the list with reviews
	function buildList(results) {

		//remove everything first
		$('.review-group').remove();

		reviewCount = 0;
		totalStar = 0;
		results.forEach(function(data) {
			addItem(data);
		});
	}

	var star_half = "<i class='fa fa-star-half-o star'></i>";
	var star_filled = "<i class='fa fa-star star'></i>";
	var star = "<i class='fa fa-star-o star'></i>";
	var like = "<i class='up thumb fa fa-thumbs-o-up'></i>";
	var dislike = "<i class='down thumb fa fa-thumbs-o-down'></i>";

	function addItem(data) {
		var thisID = data.id;
		var title = data.get('title');
		var desc = data.get('desc');
		var rating = data.get('rate');

		reviewCount++;
		totalStar += rating;

		// Create a button with a <span> element (using bootstrap class to show the X)
		var button = $('<div class="rightSide"><button class="btn-info btn-xs"><span class="glyphicon glyphicon-remove"></span></button></div>');
		var likeButton = $(like);
		var dislikeButton = $(dislike);

		deleteNoRates(data);

		// Click function on the button to destroy the item, then re-call getData
		button.click(function() {
			data.destroy({
				success:getData
			});
		});

		likeButton.click(function() {
			data.increment('up');
			data.save();
			getData();
		});

		dislikeButton.click(function() {
			data.increment('down');
			data.save();
			getData();
		});


		var box = $("<div class='form-group review-group'></div>");
		var titleEle = $("<h3>" + title + "</h3>");
		var descEle = $('<p>"' + desc + '"</p>');

		// Two for loops, one for filled stars
		// One for not filled stars
		// 0 - rating, rating - max rating
		var starString = "";
		for(var i = 0; i < rating; i++) {
			starString += star_filled;
		}
		for(var i = rating; i < 5; i++) {
			starString += star;
		}

		var starEle = $("<div class='review-star inline'>" + starString + "</div>");

		box.append(starEle);
		box.append(button);
		box.append(titleEle);
		box.append(descEle);

		addThumb(box, likeButton);
		addThumb(box, dislikeButton);

		box.append($("<p>" + data.get('up') + " out of " + Number(data.get('up') + data.get('down')) + " found this helpful</p>"));
		$('.review-area').append(box);

		computeAverage();
	}

	function addThumb(box, button) {
		var div = $("<div class='move'></div>");
		div.append(button);
		box.append(div);
	}

	// deletes any data with a rating of 0 from the database
	function deleteNoRates(data) {
		if (data.get('rate') == 0) {
			data.destroy({
				success:getData
			});
		}
	}

	// computes the average of the stars of all reviews
	function computeAverage() {
		var averageStar = Number(totalStar / reviewCount);
		var averageRate = "";
		var stop = 5;

		for (var i = 1; i <= averageStar; i++) {
			averageRate += star_filled;
		}

		if (Math.floor(averageStar) != averageStar) {
			averageRate += star_half;
			stop--;
		}

		for (var i = averageStar; i < stop; i ++) {
			averageRate += star;
		}

		$('#avg-rating i').remove();
		$('#avg-rating').append(averageRate);
	}

	getData();
});


