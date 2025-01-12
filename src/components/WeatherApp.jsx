import { useRef, useState } from 'react';
import axios from 'axios';
import './Weather.css';
import Swal from "sweetalert2";

// Import images explicitly
import cloudImg from '../images/cloud.jpg';
import sunnyImg from '../images/sunny.jpg';
import rainImg from '../images/rain.jpeg';
import stormImg from '../images/strom.jpg';
import foggyImg from '../images/foggy.jpg';
import snowyImg from '../images/snowy.jpg';

const Weather = () => {
  const userCityRef = useRef(null);
  const [getWeather, setWeather] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(cloudImg); // Default to cloudImg

  const getCityName = async (event) => {
    event.preventDefault();
    const cityName = userCityRef.current.value;
    const APIkey = 'ca42a6be1a902a354a03bcb78027a0bb';
  
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIkey}&units=metric`
       
        
      );
  
      // Update weather data
      setWeather([response.data, ...getWeather]);
      console.log(response);
  
      // Dynamically change the background based on the weather condition
      const weatherCondition = response.data.weather[0].main.toLowerCase();
      console.log("Weather condition:", weatherCondition);
  
      // Update background image based on weather condition
      switch (weatherCondition) {
        case 'clear':
        case 'clouds':
          setBackgroundImage(sunnyImg);
          break;
        case 'rain':
          setBackgroundImage(rainImg);
          break;
        case 'thunderstorm':
          setBackgroundImage(stormImg);
          break;
        case 'fog':
        case 'haze':
          setBackgroundImage(foggyImg);
          break;
        case 'snow':
          setBackgroundImage(snowyImg);
          break;
        case 'mist':
          // Mist condition might not trigger snow, adjust as needed
          setBackgroundImage(snowyImg); // or any other default image
          break;
        default:
          setBackgroundImage(cloudImg); // Default image
          break;
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
  
      Swal.fire({
        title: `City Not Found`,
        text: `The city "${cityName}" could not be found. Please try again.`,
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
  };

  return (
    <div
      className="bg"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        color: '#fff',
      }}
    >
      <div className="weather">
        <input
          type="text"
          placeholder="Enter your city name"
          ref={userCityRef}
        />
        <button onClick={getCityName}>Search</button>
        {getWeather.length > 0 && (
          <div className="card">
            <h2>Weather in {getWeather[0].name}</h2>
            <h3>{getWeather[0].weather[0].main}</h3>
            <h4>{getWeather[0].main.temp}°C</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
