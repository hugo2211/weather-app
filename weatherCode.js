// Checks for cities in local storage
$(document).ready(function () {
    var cities = JSON.parse(localStorage.getItem("cities"));
    renderCities();
    function renderCities() {

        console.log(cities);
        if (cities) {
            var citiesEl = $("#cities")
            citiesEl.empty();
            for (var i = 0; i < cities.length; i++) {
                var cityEl = $("<button>").attr("id", "city-" + i).addClass("py-2 mt-2 btn-group-vertical bg-white city-buttons btn-block btn-sm").text(cities[i]);
                citiesEl.append(cityEl);
            }
        }
    }
    // Ajax pull for city info
    cities = [];
    function citySearch() {
        $("#forecast").empty();
        $("ul").empty();
        var cityName = $("#city-name").val().trim().toUpperCase();
        oldCity(cityName);
    }
    function oldCity(city) {
        var apiKey = "bafb7528423c0a1284eabc3fb41ddeac";
        var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            cities.push(city);
            var date = moment().format("L");
            localStorage.setItem("cities", JSON.stringify(cities));
            var weather = response.weather[0].main;
            console.log(weather);
            var cityLat = response.coord.lat;
            var cityLong = response.coord.lon;
            var searchCity = response.name;
            $("h2").text(searchCity + " ");
            $("h2").append("(" + date + ")");
            console.log(date);

            // variables that show up on the card
            var cityTemp = response.main.temp;
            var cityHumidity = response.main.humidity;
            var cityWind = response.wind.speed;

            //appending all our results
            var liEl = $("<li>").text("Temperature " + cityTemp + " F");
            $("ul").append(liEl);
            var liEl2 = $("<li>").text("Humidity " + cityHumidity + "%");
            var liEl3 = $("<li>").text("Wind Speed " + cityWind + " MPH");
            $("ul").append(liEl2);
            $("ul").append(liEl3);

            //pulling all images and creating img tags
            if (weather === "Clear") {
                var clearEl = $("<img>").attr("src", "http://openweathermap.org/img/wn/01d@2x.png").addClass("weather-image");
                $("h2").append(clearEl);

            }

            else if (weather === "Clouds") {
                var imgEl = $("<img>").attr("src", "http://openweathermap.org/img/wn/04d@2x.png").addClass("weather-image");
                $("h2").append(imgEl);

            }

            else if (weather === "Thunderstorm") {
                var imgEl = $("<img>").attr("src", "http://openweathermap.org/img/wn/11d@2x.png").addClass("weather-image");
                $("h2").append(imgEl)

            }
            else if (weather === "Rain") {
                var imgEl = $("<img>").attr("src", "http://openweathermap.org/img/wn/09d@2x.png").addClass("weather-image");
                $("h2").append(imgEl);

            }

            else if (weather === "Snow") {
                var imgEl = $("<img>").attr("src", "http://openweathermap.org/img/wn/13d@2x.png").addClass("weather-image");
                $("h2").append(imgEl);

            }




            // Ajax pull for UVI
            function cityUv() {
                var queryUrl2 = "http://api.openweathermap.org/data/2.5/uvi?lat=" + cityLat + "&lon=" + cityLong + "&appid=" + apiKey;

                $.ajax({
                    url: queryUrl2,
                    method: "GET"
                }).then(function (res) {
                    console.log(res);
                    var uvIndex = res.value;
                    var liEl4 = $("<li>").text("UV index ")
                    var spanEl = $("<span>").text(uvIndex).addClass("index");
                    liEl4.append(spanEl);
                    $("ul").append(liEl4);


                    if (res.value >= 3 || res.value <= 5) {
                        spanEl.addClass("index");
                    }
                    else if (res.value >= 6 || res.value <= 7) {
                        spanEl.addClass("index2");
                    }
                    else if (res.value >= 8 || res.value <= 10) {
                        spanEl.addClass("index3");
                    }
                    else {
                        spanEl.addClass("index4");
                    }
                });
            }
                    // Ajax pull for 5 day forecast
                    function fiveDay() {
                        $("#5-day").empty();

                        var queryUrl3 = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey;

                        $.ajax({
                            url: queryUrl3,
                            method: "GET"
                        }).then(function (res2) {
                            var h2El = $("<h2>").text("5-Day-Forecast");
                            $("#forecast").append(h2El);
                            for (i = 0; i < res2.list.length; i += 8) {
                                console.log(res2); 
                                var deckEl = $("<div>").addClass("card shadow-lg text-black bg-primary mx-auto mb-10 p-2' style='width: 8.5rem; height: 11rem");

                                var date1 = res2.list[i].dt_txt;
                                var temp1 = res2.list[i].main.temp;
                                var humid1 = res2.list[i].main.humidity;
                                var icon1 = res2.list[i].weather[0].id;
                                var cardText1 = $("<h4>").addClass("card-title mt-0");
                                var cardTemp1 = $("<p>").addClass("card-text pb-2");
                                var cardHumid1 = $("<p>").addClass("card-text pb-2");
                                var cardIcon1 = $("<p>").addClass("card-text");
                                cardIcon1.text(icon1);
                                cardTemp1.text(temp1 +" F");
                                cardText1.text(date1);
                                cardHumid1.text(humid1);

                                // Logic to generate weather icons
                        if (res2.list[i].weather[0].main === "Clear") {
                            var iconEl1 = $("<img>").attr("src", "http://openweathermap.org/img/wn/01d@2x.png").addClass("weather-image");

                            cardIcon1.text(iconEl1);
                            deckEl.append(cardText1, "Temp: ", cardTemp1, "Humidity: ", humid1, "%", iconEl1);
                            var day5El = $("#5-day").append(deckEl);
                            $(".col-md-9").append(day5El);
                        }
                        else if (res2.list[i].weather[0].main === "Thunderstorm") {
                            var iconEl1 = $("<img>").attr("src", "http://openweathermap.org/img/wn/11d@2x.png").addClass("weather-image");
                            cardIcon1.text(iconEl1);
                            deckEl.append(cardText1, "Temp: ", cardTemp1, "Humidity: ", humid1, "%", iconEl1);
                            var day5El = $("#5-day").append(deckEl);
                            $(".col-md-9").append(day5El);
                        }
                        else if (res2.list[i].weather[0].main === "Rain") {
                            var iconEl1 = $("<img>").attr("src", "http://openweathermap.org/img/wn/09d@2x.png").addClass("weather-image");
                            cardIcon1.text(iconEl1);
                            deckEl.append(cardText1, "Temp: ", cardTemp1, "Humidity: ", humid1, "%", iconEl1);
                            var day5El = $("#5-day").append(deckEl);
                            $(".col-md-9").append(day5El);
                        }
                        else if (res2.list[i].weather[0].main === "Snow") {
                            var iconEl1 = $("<img>").attr("src", "http://openweathermap.org/img/wn/13d@2x.png").addClass("weather-image");
                            cardIcon1.text(iconEl1);
                            deckEl.append(cardText1, "Temp: ", cardTemp1, "Humidity: ", humid1, "%", iconEl1);
                            var day5El = $("#5-day").append(deckEl);
                            $(".col-md-9").append(day5El);
                        }
                        else if (res2.list[i].weather[0].main === "Clouds") {
                            var iconEl1 = $("<img>").attr("src", "http://openweathermap.org/img/wn/04d@2x.png").addClass("weather-image");
                            cardIcon1.text(iconEl1);
                            deckEl.append(cardText1, "Temp: ", cardTemp1, "Humidity: ", humid1, "%", iconEl1);
                            var day5El = $("#5-day").append(deckEl);
                            $(".col-md-9").append(day5El);
                        }
                    }
                })
            }
            fiveDay();
            cityUv();
            renderCities();
        });
    }

//eventlistener to start city search
    $(".search").on("click", function (event) {
        event.preventDefault();
        citySearch();

    });

    //eventlistener to clear data upon new city being called
    $(document).on("click", ".city-buttons", function () {
        var buttonText = $(this).text()
        console.log(buttonText);
        $("ul").empty();
        $("#forecast").empty();
        oldCity(buttonText);


    })

    //button to clear city buttons and history
    $(".clear-history").on("click", function () {
        localStorage.clear();
    })
    $(document).on("click", ".clear", function () {
        $("#cities").empty();
        


    })
});