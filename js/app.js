// ProntoWeather Forecast Application that's powered by the Yahoo Weather API and features the ability to retrieve weather based on current location or search.
// Designed and developed by David To
// v2.0
const prontoWeather = {};

// add apiKey here
prontoWeather.apiKey = apiKey;

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
		if (id = '#location-settings') {
			$(`${id}`).find('#inputPlace').focus();
		}
	};

};

prontoWeather.getLocation = () => {

	return new Promise(function (resolve, reject) {
		navigator.geolocation.getCurrentPosition(resolve, reject);
	})
	.then((position) => {
		// console.log(prontoWeather.location);
		prontoWeather.location = 'lat=' + position.coords.latitude + '&lon=' + position.coords.longitude;
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
	widget.find('.weather-icon').addClass('icon-' + weather.weather[0].icon);
	widget.find('.weather-condition').text(weather.weather[0].main);
	widget.find('.temp .temp-int').text(weather.main.temp);
	widget.find('.temp .unit').text('c');
	widget.find('.city-name').text(weather.name + ', ' + weather.sys.country);
	const feelsLikeHtml = $("<p/>").append(`Feels Like <strong>${weather.main.feels_like}°c</strong>`);
	const highLow = $("<p/>").append(`<i class="fa fa-arrow-up" aria-label="High: "></i> <strong>${weather.main.temp_max}°c</strong> &nbsp;<i class="fa fa-arrow-down" aria-label="Low: "></i> <strong>${weather.main.temp_min}°c</strong>`);
	widget.find('.weather-condition').append(feelsLikeHtml, highLow);
	const timeData = new Date(weather.dt * 1000).toLocaleString();
	$('.date-time').text(timeData);


	// 10 Day Forcast

	// $('.weather-forecast').empty();

	// const forcastArr = weather.item.forecast.reverse();

	// // console.log(forcastArr);

	// forcastArr.forEach(function(forecaseDay){
	// 	const container = $('<div>').addClass('day');
	// 	const heading = $('<h3>').html(forecaseDay.day + ' ' + forecaseDay.date.slice(0, 2));
	// 	const weatherIcon = $('<div>').addClass('wrapper-weather-icon').append($('<div>').addClass('weather-icon icon-' + forecaseDay.code));
	// 	const tempHigh = $('<span>').addClass('temp-high').text(forecaseDay.high);
	// 	const tempLow = $('<span>').addClass('temp-low').text(forecaseDay.low);
	// 	const tempAll = $('<p>').addClass('temp-all').append(tempHigh, tempLow);
	// 	$('.weather-forecast').prepend(container.append(heading, weatherIcon, tempAll));
	// });

	$('#wrapper-weather').show();
	prontoWeather.displayModal('#location-settings', 'hide');
	prontoWeather.displayModal('#loading', 'hide');

};

prontoWeather.getWeather = (manualSearch = false) => {
	let apiUrl = `https://api.openweathermap.org/data/2.5/weather?${prontoWeather.location}&appid=${prontoWeather.apiKey}&units=metric`;
	if (manualSearch) {
		apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${prontoWeather.location}&appid=${prontoWeather.apiKey}&units=metric`;
	}
	$.ajax({
		url: apiUrl,
		method: 'GET',
		dataType: 'json',
		data: {
			format: 'json'
		},
		success: function(data, textStatus, XMLHttpRequest){
			if (data) {
				$('.error-msg').removeClass('show');
				prontoWeather.displayWeather(data);
			}
		},
		error:function (xhr, ajaxOptions, thrownError){
			if(xhr) {
				$('.error-msg').addClass('show');
				prontoWeather.displayModal('#location-settings', 'show');
				prontoWeather.displayModal('#loading', 'hide');
			}

		}
	});
	// .then(function(res){
	// 	console.log(res);
	// 	$('.error-msg').removeClass('show');
	// 	prontoWeather.displayWeather(res);
	// })
	// .catch(function(err){
	// 	if(err) {
	// 		console.log(err);
	// 		prontoWeather.displayModal('#loading', 'hide');
	// 		prontoWeather.displayModal('#location-settings', 'show');
	// 	}
	// });

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
		prontoWeather.getWeather(true);
		// console.log(prontoWeather.location);
		$('#inputPlace').val('');
	});

};

$(function() {
	
	prontoWeather.init();

});
