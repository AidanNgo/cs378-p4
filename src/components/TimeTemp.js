import React, { useEffect, useState } from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const TimeTemp = ({ fetchWeather, latitude, longitude, city}) => {
    const [temps, setTemps] = useState([]);
    const [times, setTimes] = useState([]);
   


    useEffect(() => {
        async function getWeather() {
            const data = await fetchWeather(latitude, longitude);
            if (data) {
                const now = new Date();
                const currentHour = now.getHours();

                // Filter out past times and get only relevant data
                const filteredTemps = [];
                const filteredTimes = [];

                data.hourly.time.forEach((isoTime, index) => {
                    const date = new Date(isoTime);
                    if (date.getHours() >= currentHour) {  // Keep only current and future hours
                        filteredTemps.push(data.hourly.temperature_2m[index]);
                        filteredTimes.push(formatTime(isoTime));
                    }
                });

                setTemps(filteredTemps);
                setTimes(filteredTimes);
            }
        }

        if (latitude && longitude){
            getWeather();
        }

    }, [latitude, longitude]);

    function formatTime(isoTime) {
        const date = new Date(isoTime);
        let hours = date.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert 24-hour to 12-hour format
        return `${hours} ${ampm}`;
    }

    return (
        <div>
            <div className="row" id="time-temp">
                <div className="col">
                    <div><strong>Time</strong></div>
                    {times.map((time, index) => (
                        <div key={index}>{time}</div>
                    ))}
                </div>

                <div className="col">
                    <div><strong>Temperature</strong></div>
                    {temps.map((temp, index) => (
                        <div key={index}>{temp} °F</div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TimeTemp;
