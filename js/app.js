$(function () {
  // Global Variables
  var msg = 'It seems like Geolocation, which is required for this page, is not enabled. Please use a browser which supports it.';
  var $posMsg = $(document.createElement('p'));
  var $main = $('.container');

  //Check if Geolocation is supported
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, fail);
  } else {
    fail();
  }

  // Success function
  function success(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var key = 'bad003dd59dd416c8726b6ed4decdbf5';
    var url = 'https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + key;

    $.ajax({
      url: url,
      dataType: 'json',
      success: function (data) {
        // Update city, weather temperature and sky conditions
        var $temp = $('.temperature');

        $('.city').text(data.name + ', ' + data.sys.country);
        $temp.text((data.main.temp - 273.15).toFixed(2) + ' °C');
        $('.sky').text(data.weather[0].main);
        $('.description').text(data.weather[0].description);

        // Change weather icon
        var $weatherIcon = $('#weatherIcon');
        var $body = $('body');
        var $btn = $('#toggleTemp');
        var hour = new Date().getHours();
        var iconID = data.weather[0].id;

        // Sun icon or moon icon depending on the hour
        if (hour < 20 && hour > 6) {
          $weatherIcon.attr('class', 'owf owf-5x owf-' + iconID + '-d');
        } else {
          $weatherIcon.attr('class', 'owf owf-5x owf-' + iconID + '-n');
        }

        // Set hot colors shortcut
        function setHotColors() {
          $body.css({
            'background-color': '#F44336',
            'color': '#F44336'
          });
          $main.css({
            'background-color': '#FFFDE7'
          });
          $btn.css({
            'background-color': '#F44336'
          });
        }

        // Set snow colors shortcut
        function setSnowColors() {
          $body.css({
            'background-color': '#00BCD4',
            'color': '#00BCD4'
          });
          $main.css({
            'background-color': '#E0F7FA'
          });
          $btn.css({
            'background-color': '#00BCD4'
          });
        }

        // Change page colors
        // Clear or calm
        if (iconID === 800 || iconID === 951) {
          if (hour < 20 && hour > 6) { // Check if it's day or night
            setHotColors();

          } else {
            $body.css({
              'background-color': '#000',
              'color': '#fff'
            });
            $main.css({
              'background-color': '#0D47A1'
            });
            $btn.css({
              'background-color': '#000'
            });
            $weatherIcon.css({
              'color': '#FFEB3B'
            });
          }

          // Additional and extreme
        } else if (iconID >= 900) {
          if (iconID === 903) { // 903 is a cold thermometer
            setSnowColors();

          } else if (iconID === 904) { // 904 is a hot thermometer
            setHotColors();

          } else {
            $body.css({
              'background-color': '#004D40',
              'color': '#004D40'
            });
            $main.css({
              'background-color': '#E0F2F1'
            });
            $btn.css({
              'background-color': '#004D40'
            });
          }

          // Clouds
        } else if (iconID >= 801) {
          $body.css({
            'background-color': '#263238',
            'color': '#263238'
          });
          $main.css({
            'background-color': '#ECEFF1'
          });
          $btn.css({
            'background-color': '#263238'
          });

          // Atmosphere
        } else if (iconID >= 701) {
          $body.css({
            'background-color': '#9E9E9E',
            'color': '#9E9E9E'
          });
          $main.css({
            'background-color': '#FAFAFA'
          });
          $btn.css({
            'background-color': '#9E9E9E'
          });

          // Snow
        } else if (iconID >= 600) {
          setSnowColors();

          // Rain and drizzle
        } else if (iconID >= 300 && iconID) {
          $body.css({
            'background-color': '#01579B',
            'color': '#01579B'
          });
          $main.css({
            'background-color': '#E1F5FE'
          });
          $btn.css({
            'background-color': '#01579B'
          });

          // Thunderstorm
        } else if (iconID >= 200) {
          $body.css({
            'background-color': '#212121',
            'color': '#212121'
          });
          $main.css({
            'background-color': '#1E88E5'
          });
          $btn.css({
            'background-color': '#212121'
          });
        }

        // Toggle Celsius and Fahrenheit temperature
        $btn.on('click', function () {

          if ($btn.text() === 'Get Fahrenheit temperature') {
            $temp.text((data.main.temp * (9 / 5) - 459.67).toFixed(2) + ' °F');
            $btn.text('Get Celsius temperature');

          } else if ($btn.text() === 'Get Celsius temperature') {
            $temp.text((data.main.temp - 273.15).toFixed(2) + ' °C');
            $btn.text('Get Fahrenheit temperature');
          }
        });

      },
      error: function () {
        fail();
      }
    });
  }

  // Fail function
  function fail() {
    $posMsg.text(msg);
    $main.prepend($posMsg);
  }
});