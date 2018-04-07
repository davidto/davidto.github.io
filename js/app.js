// ProntoWeather Forecast Application that's powered by the Yahoo Weather API and features the ability to retrieve weather based on current location or search.
// Designed and developed by David To

const prontoWeather = {};

prontoWeather.location = '';

prontoWeather.addAnimation = (element, animation, display) => {

	if (display == 'show') {
		element.addClass(display);
		element.removeClass('hide');
	};
	element.addClass(`animated ${animation}`).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
		element.removeClass(`animated ${animation}`);
		if (display == 'hide') {
			element.addClass(display);
			element.removeClass('show');
		};
	});

};

prontoWeather.displayModal = (id, display) => {

	if (display == 'hide') {
		prontoWeather.addAnimation($(`${id}.show`), 'zoomOutDown', display);
	} else {
		prontoWeather.addAnimation($(`${id}.hide`), 'zoomInUp', display);
	};

};

prontoWeather.getLocation = () => {

	return new Promise(function (resolve, reject) {
		navigator.geolocation.getCurrentPosition(resolve, reject);
	})
	.then((position) => {
		// console.log(prontoWeather.location);
		prontoWeather.location = '(' + position.coords.latitude + ', ' + position.coords.longitude + ')';
		prontoWeather.getWeather();
	})
	.catch((err) => {
		prontoWeather.displayModal('#location-settings', 'show');
		prontoWeather.displayModal('#loading', 'hide');
	});

};

prontoWeather.displayWeather = (weather) => {

	// console.log(weather);

	// Current Weather

	const widget = $('.weather-widget');
	widget.find('.weather-icon').attr('id', 'icon-' + weather.item.condition.code);
	widget.find('.weather-condition').text(weather.item.condition.text);
	widget.find('.temp .temp-int').text(weather.item.condition.temp);
	widget.find('.temp .unit').text(weather.units.temperature);
	widget.find('.city-name').text(weather.location.city + ', ' + weather.location.region);
	$('.date-time').text(weather.item.condition.date);

	// 10 Day Forcast

	$('.weather-forecast').empty();

	const forcastArr = weather.item.forecast.reverse();

	// console.log(forcastArr);

	forcastArr.forEach(function(forecaseDay){
		const container = $('<div>').addClass('day');
		const heading = $('<h3>').html(forecaseDay.day + ' ' + forecaseDay.date.slice(0, 2));
		const weatherIcon = $('<div>').addClass('wrapper-weather-icon').append($('<div>').addClass('weather-icon icon-' + forecaseDay.code));
		const tempHigh = $('<span>').addClass('temp-high').text(forecaseDay.high);
		const tempLow = $('<span>').addClass('temp-low').text(forecaseDay.low);
		const tempAll = $('<p>').addClass('temp-all').append(tempHigh, tempLow);
		$('.weather-forecast').prepend(container.append(heading, weatherIcon, tempAll));
	});

	$('#wrapper-weather').show();
	prontoWeather.displayModal('#location-settings', 'hide');
	prontoWeather.displayModal('#loading', 'hide');

};

prontoWeather.getWeather = () => {

	$.ajax({
		url: `https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="${prontoWeather.location}") and u="c"`,
		method: 'GET',
		dataType: 'json',
		data: {
			format: 'json'
		}
	})
	.then(function(res){
		// console.log(res);
		if (!res.query.results) {
			$('#loading.animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
				$('.error-msg').addClass('show');
				prontoWeather.displayModal('#loading', 'hide');
				$('#loading.animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
					prontoWeather.displayModal('#location-settings', 'show');
				});
			});
		} else {
			$('.error-msg').removeClass('show');
			prontoWeather.displayWeather(res.query.results.channel);
		}
	})
	.catch(function(err){
		prontoWeather.displayModal('#location-settings', 'show');
		prontoWeather.displayModal('#loading', 'hide');
	});

};

prontoWeather.init = () => {

	prontoWeather.getLocation();

	$('.widget-settings').on('click', function(e){
		e.preventDefault();
		prontoWeather.displayModal('#location-settings', 'show');
	});

	$('#getLocation').on('click', function(e){
		e.preventDefault();
		prontoWeather.displayModal('#loading', 'show');
		prontoWeather.displayModal('#location-settings', 'hide');
		prontoWeather.getLocation();
	});

	$('#inputAddress').on('submit', function(e){
		e.preventDefault();
		prontoWeather.location = $('#inputPlace').val();
		prontoWeather.displayModal('#location-settings', 'hide');
		prontoWeather.displayModal('#loading', 'show');
		prontoWeather.getWeather();
		// console.log(prontoWeather.location);
		$('#inputPlace').val('');
	});

};

$(function() {
	
	prontoWeather.init();

});
