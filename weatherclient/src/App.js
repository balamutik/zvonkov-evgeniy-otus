import React, { Component } from 'react';
import Widget from "./widget";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//const URL = "https://tproger.ru/translations/react-basic-weather-app/";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCloud, faKey } from '@fortawesome/free-solid-svg-icons';

library.add(faCloud, faKey);
let FAVS = localStorage.getItem('favCityList').split(";");
class App extends Component {
  constructor(p){
    super(p);
    this.state = {searchValue: '', cities: FAVS};
    this.addCity = this.addCity.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    this.setState({searchValue: event.target.value});
  }
  handleSubmit(event){
    this.addCity(this.state.searchValue);
    event.preventDefault();
  }
  addCity(city){
    console.log(city);
    if(city!=""){
      FAVS.push(city);
      this.setState({cities: FAVS});
    }
  }
  render() {
    return (
      <div className="App">
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
              this.state.cities.map((city, index)=>{
                return <Widget key={index} city={city} />}
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
