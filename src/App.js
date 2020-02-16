import React,{Component} from 'react';
import Navigation from './Components/Navigaation/Navigation'
import Logo from './Components/Logo/Logo'
import Register from './Components/Register/Register'

import ImageLink from './Components/ImageLink/ImageLink'
import Rank from './Components/Rank/Rank'
import FaceRecog from './Components/FaceRecog/FaceRecog'
import SignIn from './Components/SignIn/SignIn'

import './App.css';
import Particles from 'react-particles-js';
import 'tachyons';


const particlesOptions={
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initState ={
  input:'',
  imageUrl:'',
  box:{},
  route:'signin',
  isSignedIn: false,
  user:{
          id:"",
           name:"",
           email:"",
           entries:0,
           joinDate:''
  }
   }


class  App extends Component {
  constructor(){
  super();
 this.state=initState;
  }

  loadUser=(data)=>{
    this.setState({user:{
            id:data.id,
            name:data.name,
            email:data.email,
            entries:data.entries,
            joinDate:data.joined

    }})
  }

  calculateFaceLoction=(data)=>{
    const clarifaiFace=data.outputs[0].data.regions[0].region_info.bounding_box;
    const image=document.getElementById('inputimage');
    const width=Number(image.width);
    const height=Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }

  }

  displayFaceBox=(box)=>{
    this.setState({box:box});
  }
  onInputChange=(e)=>{
      this.setState({input:e.target.value});
  }

  onSubmit=()=>{
    this.setState({imageUrl:this.state.input})
     
    fetch('https://peaceful-sierra-98821.herokuapp.com/imageurl', {
      method:'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input:this.state.input
      })
    }).then(response=>response.json())
      .then(response =>{
      if (response) {
          fetch('https://peaceful-sierra-98821.herokuapp.com/image', {
            method:'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id:this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              console.log();
              this.setState(Object.assign(this.state.user, { entries: count}))
            })
            .catch(console.log)

        }
      this.displayFaceBox(this.calculateFaceLoction(response))
      })
      .catch(err=> console.log(err))
  
  }
  onRouteChange=(route)=>{
    if(route==='signout'){
      this.setState(initState)
    }else if(route==='home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route:route})
  }

  render(){ 
    const {isSignedIn,imageUrl,route,box}=this.state
     


  return (
    <div className="App">
       <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route ==='home'
        ?<div>
       <Logo />
      <Rank name={this.state.user.name} entries={this.state.user.entries}/> 
       <ImageLink onInputChange={this.onInputChange} onButtonSubmit={this.onSubmit}/>
       <FaceRecog  imageUrl={imageUrl} box={box}/>
        </div>
        :(
          route === 'signin'
          ?  <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
           : <Register  loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
         )

        }
       </div>
  );
  }
}

export default App;
