import React, { Component } from 'react';
import Loading from './components/Loading';
import WeatherInfo from './components/Weatherinfo';

const api_key = process.env.REACT_APP_WEATHER_TOKEN;
const key = "&appid="+api_key;
const url = "http://api.openweathermap.org/data/2.5/weather?lang=ru&units=metric&q=";

const WeatherDataWrapper = (props) =>{
        if(props.resp==="")
            return (<Loading loading={props.loading} /> )
        else
            return(<WeatherInfo data={props.state} addToFav={props.addToFav} />) 
    }

class Widget extends Component {
    constructor(props){
        super(props)
        this.state = {
            desc: "",
            temp: "",
            wind: "",
            press: "",
            humidity: "",
            img: "",
            resp: "",
            isFav: false,
            btnName: "Добавить в избранное"
        }
        this.addToFav = this.addToFav.bind(this);
        this.checkFav = this.checkFav.bind(this);
    }
    refreshWeatherData(){
        if(this.props.city==="") return;
        const composedUrl = url+this.props.city+key;
        fetch(composedUrl).then(res => res.json()).then(json => {
            if(json.cod === 200){
                this.setState({
                    desc: json.weather[0].description,
                    temp: json.main.temp,
                    wind: json.wind.speed,
                    press: json.main.pressure,
                    humidity: json.main.humidity,
                    img: "http://openweathermap.org/img/w/" + json.weather[0].icon + ".png",
                    resp: "200"
                });
            }else{
                this.setState({resp: json.cod})
            }
        });
    }
    checkFav(city){
        let cityList = localStorage.getItem('favCityList');
        cityList == null ? cityList = [] : cityList = cityList.split(";");
        if(cityList.length<1){
            return;
        }else if(cityList.indexOf(city)>-1){
            this.setState({isFav: true, btnName: "В избранном"});
            return;
        }
    }
    addToFav(e){
        e.preventDefault();
        let favList = localStorage.getItem('favCityList');
        favList == null ? favList="" : "";
        favList+=this.props.city+";";
        localStorage.setItem('favCityList', favList);
        this.setState({isFav: true, btnName: "В избранном"});
    }
    componentWillMount(){
        this.checkFav(this.props.city);
        this.refreshWeatherData();
    }
    componentDidMount(){
       setInterval(()=>this.refreshWeatherData(), 500000) 
    }
    
    render(){
        if(this.state.resp==="200"){
            return (
                <div className="col-md-3">
                    <div className="card" style={{marginTop:'10px'}}>
                        <div className="card-body">
                          <img className="img-fluid d-block float-right" src={this.state.img} alt={this.state.desc}/>
                          <h5 className="card-title">{this.props.city}</h5>
                            <WeatherDataWrapper resp={this.state.resp} loading={this.state.loading} state={this.state} addToFav={this.addToFav} />
                        </div>
                    </div>
                </div>
            )
        }else{
            return ""
        }    
    }
}

export default Widget;