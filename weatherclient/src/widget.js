import React, { Component } from 'react';
import { css } from 'react-emotion';
import ClipLoader from 'react-spinners/ClipLoader';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

const key = "&appid=3573a34bfd62979cff547ef0d87db78a";
const url = "http://api.openweathermap.org/data/2.5/weather?q=";

class Widget extends Component {
    constructor(props){
        super(props)
        console.log("Props: "+props.city+" "+props.key);
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
        this.returnData = this.ReturnData.bind(this);
        this.addToFav = this.addToFav.bind(this);
        this.checkFav = this.checkFav.bind(this);
        this.renderComp = this.renderComp.bind(this);
        
    }
    checkFav(city){
        const cityList = localStorage.getItem('favCityList').split(";");
        if(cityList.length<1){
            return;
        }else if(cityList.indexOf(city)>-1){
            console.log(city);
            console.log(cityList);
            this.setState({isFav: true, btnName: "В избранном"});
            return;
        }
    }
    addToFav(e){
        e.preventDefault();
        let favList = localStorage.getItem('favCityList');
        console.log("addToFav started. Type of favlist = "+typeof favList)
        console.log(favList);
        favList+=this.props.city+";";
        localStorage.setItem('favCityList', favList);
        console.log(localStorage.getItem('favCityList'));
        this.setState({isFav: true, btnName: "В избранном"});
    }
    componentWillMount(){
        this.checkFav(this.props.city);
        const composedUrl = url+this.props.city+key+"&lang=ru&units=metric";
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
    componentDidMount(){
       setInterval(()=>this.returnData(), 5000) 
    }
    ReturnData = (() =>{
                      console.log(this.state.resp);
                      if(this.state.resp===""){
                          return (<div className='sweet-loading'>
                                <ClipLoader
                                  className={override}
                                  sizeUnit={"px"}
                                  size={150}
                                  color={'#123abc'}
                                  loading={this.state.loading}
                                />
                              </div> )
                          }else{
                              console.log(this.state)
                             return(
                             <div>
                             <p className="card-text">
                                 Описание: {this.state.desc}<br/>
                                 Температура: {this.state.temp} ℃<br/>
                                 Ветер: {this.state.wind} м/с<br/>
                                 Давление: {this.state.press} мм. рт. ст.<br/>
                                 Влажность: {this.state.humidity}%
                             </p> 
                             <button className="btn btn-primary" onClick={this.addToFav} disabled={this.state.isFav}>{this.state.btnName}</button>
                             </div>
                             ) 
                          }
                      })
    renderComp(){
        console.log(this.state.resp)
        if(this.state.resp==200){
            return (
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body">
                          <img className="img-fluid d-block float-right" src={this.state.img} alt={this.state.desc}/>
                          <h5 className="card-title">{this.props.city}</h5>
                          {
                            this.returnData()
                          }
                        </div>
                    </div>
                </div>
            )
        }else{
            return ""
        } 
    }
    render(){
        return this.renderComp()
    }
    
}
export default Widget;