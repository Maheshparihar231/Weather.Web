const timeEL = document.getElementById('time');
const dateEL = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weaterforcastEl = document.getElementById('weathet-forcast');
const currentTemp = document.getElementById('current-temp');

const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const months = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec']

//Replace your API_KEY here

const API_KEY = 'cdf08fbc27774dd01bd183c39d8b52fd';

setInterval(()=>{
    const time = new Date();
    const year = time.getFullYear()
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hours12 = hour>=13 ? hour%12:hour 
    const minuts = time.getMinutes();
    const sec = time.getSeconds();
    const ampm = hour>12 ? 'PM' : 'AM'

    timeEL.innerHTML = (hours12<10? '0'+hours12:hour) + ' : ' + (minuts <10? '0'+minuts:minuts) +' : ' + (sec<10? '0'+sec:sec) + ''+ `<span id="am-pm">${ampm}</span>`
    dateEL.innerHTML = weekdays[day] + ', ' + date+' '+ months[month]
},100);
getWeatherData()
function getWeatherData(){
    navigator.geolocation.getCurrentPosition((success)=>{
        
        let{latitude , longitude} = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=matric&appid=${API_KEY}`).then(res=> res.json()).then(data => {
            console.log(data);
            showWeatherData(data)
        })
    })
}

function showWeatherData(data){
    let {humidity , pressure,sunrise,sunset,wind_speed } = data.current;
    timezone.innerHTML=data.timezone;
    countryEl.innerHTML= data.lat + 'N' + ' , '+ data.lon+'E'
    currentWeatherItemsEl.innerHTML=
    `<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind-Speed</div>
        <div>${wind_speed}</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise*1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
    </div>
    `;
    let otherdayforcast = ''
    date.daily.forEach((day,idx)=>{
        if(idx==0){
            currentTemp.innerHTML=`
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</</div>
                <div class="temp">Night - ${day.temp.night}&#176;c</div>
                <div class="temp">Day - ${day.temp.day}&#176;c</div>
            </div>
        `
        }else{
            otherdayforcast += `
            <div class="weather-forcast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176;c</div>
                <div class="temp">Day - ${day.temp.day}&#176;c</div>
            </div>
            `
        }
    })

    weaterforcastEl.innerHTML = otherdayforcast;
}