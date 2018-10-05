import React from 'react';

const WeatherInfo = (props)=>(
    <div>
        <p className="card-text">
            <span className ='desc'>Описание: {props.data.desc}</span><br/>
            <span className ='temp'>Температура: {props.data.temp} ℃</span><br/>
            <span className ='wind'>Ветер: {props.data.wind} м/с</span><br/>
            <span className ='press'>Давление: {props.data.press} мм. рт. ст.</span><br/>
            <span className ='humidity'>Влажность: {props.data.humidity}%</span>
        </p> 
        <button className="btn btn-primary" onClick={props.addToFav} disabled={props.data.isFav}>{props.data.btnName}</button>
        </div>
)
export default WeatherInfo;