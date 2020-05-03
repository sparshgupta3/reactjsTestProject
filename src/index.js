import React from 'react';
import ReactDOM from 'react-dom';
import MyComponent from './App.js'
import './App.css';

class Home extends React.Component{
  constructor(props){
    super(props);
    this.state= {
      countries: [],
      countrycall: [],
      data: [],
      value: '',
      name: [],
      url: '/home',
      defurl: '/home',
    };
  }
  
  fetching(ur){
    fetch(ur)
		.then(response => response.json())
		.then(data => {
      var dataPoints = [];
			var x;
      for(x in data["Stats"]){
        if(x !== "TotalCases"){
          dataPoints.push({
              label: x,
              value: data["Stats"][x]
          });
        }
      }
      this.setState({data: dataPoints, name: data["Name"]});
		});
  }

  handleChange = (event) =>{
    this.setState({value : event.target.value, data: []});
    let ur;
    if(event.target.value){
      ur = '/country/' + event.target.value;
    }
    else{
      ur = '/home';
    }
      this.setState({url : ur});
      this.fetching(ur);
  }
 
  componentDidMount(){
    var ar=[];
    Promise.all(
      [
        fetch('/countrynames').then(response => response.json()),
        fetch('/home').then(response => response.json())
      ]
    )
    .then(data => {
      for (var i = 0; i < data[0].length; i++) {
        ar.push(data[0][i]);
      }
      this.setState({countries : ar});
      let t =[];
      t.push(<option value=""></option>);
      for (i = 0; i < data[0].length; i++) {
        t.push(<option value={this.state.countries[i]}>{this.state.countries[i]}</option>) ;
      }
      this.setState({countrycall : t});
      var x;
      var dataPoints = [];
			
      for(x in data[1]["Stats"]){
        if(x !== "TotalCases"){
          dataPoints.push({
              label: x,
              value: data["Stats"][x]
          });
        }
      }
      this.setState({data: dataPoints, name: data[1]["Name"]});

    });
  }

  render(){
    return(
      <div>
       <h1>COVID-19</h1>
      <form>
      <p style={{textAlign: 'left'}}>Select Country     :
      <select value={this.state.value} onChange={this.handleChange}>
        {this.state.countrycall}
      </select>
      </p>      
      </form>
      <MyComponent data = {this.state.data} name = {this.state.name}/>
      </div>
    );
  }
}

ReactDOM.render(<Home />, document.getElementById('root'));