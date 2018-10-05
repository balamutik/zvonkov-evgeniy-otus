import React, { Component } from 'react';
import Widget from "./widget";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCloud, faKey } from '@fortawesome/free-solid-svg-icons';
import Alert from 'react-s-alert';


library.add(faCloud, faKey);
let FAVS = localStorage.getItem('favCityList');
console.log(FAVS);
const api_key = process.env.REACT_APP_WEATHER_TOKEN;

class App extends Component {
  constructor(p){
    super(p);
    FAVS == null ? FAVS = [] : FAVS = FAVS.split(";");
    this.state = {searchValue: '', cities: FAVS};
    this.addCity = this.addCity.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    this.setState({searchValue: event.target.value});
  }
  handleSubmit(event){
    const key = "&appid="+api_key;
    const url = "http://api.openweathermap.org/data/2.5/weather?lang=ru&units=metric&q=";
    const composedUrl = url+this.state.searchValue+key;
    fetch(composedUrl).then(res => res.json()).then(json => {
      if(json.cod !== 200) 
         Alert.success('Город не найден!', {position: 'bottom'})
      else
         this.addCity(this.state.searchValue);
    })
    event.preventDefault();
  }
  addCity(city){
    if(city!==""){
      FAVS.push(city);
      this.setState({cities: FAVS});
    }
  }
  render() {
    return (
      <div className="App">
        <Alert stack={{limit: 3}} />
        <nav className="navbar navbar-dark bg-primary">
          <div className="container d-flex justify-content-center"> <a className="navbar-brand">
             <FontAwesomeIcon icon="cloud"/>
              <b className="d-inline-flex align-items-center justify-content-start flex-grow-1">OTUS Приложение для отображения погоды</b>
            </a> </div>
        </nav>
        <div className="py-5 text-center">
          <div className="container">
            <div className="row">
              <div className="mx-auto col-lg-6">
                <h1>Поиск города</h1>
                <form className="form-inline d-flex justify-content-center" onSubmit={this.handleSubmit}>
                  <div className="input-group"> <input type="text" className="form-control form-control-lg" id="form3" placeholder="Введите город" value={this.state.value} onChange={this.handleChange}/>
                    <div className="input-group-append"> <button className="btn btn-primary" type="submit">Поиск</button> </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="py-5">
          <div className="container">
            <div className="row">
            { 
              this.state.cities.map((city)=>{
                  if(city !== "") return <Widget key={city} city={city} />
                  else 
                    return "";
                }
              )
            }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
