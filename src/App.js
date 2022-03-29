import React, { useState } from 'react'
import axios from 'axios'
import './App.css'

const testData = [
  {
    name: 'Dan Abramov',
    avatar_url: 'https://avatars0.githubusercontent.com/u/810438?v=4',
    company: '@facebook',
  },
  {
    name: 'Sophie Alpert',
    avatar_url: 'https://avatars2.githubusercontent.com/u/6820?v=4',
    company: 'Humu',
  },
  {
    name: 'Sebastian Markbåge',
    avatar_url: 'https://avatars2.githubusercontent.com/u/63648?v=4',
    company: 'Facebook',
  },
]

const CardList = (props) => (
  // Note the list of profiles is provided by the Input props parameter
  // <CardList profiles={testData}/>
  // when it is called
  // It is not a good idea at all to let a component to manage a global variable
  // NOT RECOMMENDED ::> {testData && testData.map( profile => <Card {...profile} />)}
  <div>
    {props.profiles &&
      props.profiles.map((profile, index) => <Card {...profile} key={index} />)}
  </div>
)

class Card extends React.Component {
  render() {
    const profile = this.props
    return (
      <div className="github-profile">
        <img src={profile.avatar_url} alt={profile.name} />
        <div className="info">
          <div className="name">{profile.name}</div>
          <div className="company">{profile.company}</div>
        </div>
      </div>
    )
  }
}

class FormWithReactRef extends React.Component {
  // Create a reference to the input element
  // It is assigned by the React attribute ref={}
  // ref={this.userNameInput}
  userNameInput = React.createRef()

  // callback to handle the form submit
  // the value submitted in the form is under <reference>.current
  // this.userNameInput.current
  handleSubmit = async (event) => {
    event.preventDefault()
    const resp = await axios.get(`https://api.github.com/users/${this.userNameInput.current.value}`)

    // The function onSubmit is an Input props (this.props.onSubmit) 
    // passed to the component at the moment it is instantiated  
    // ==> The following line it is calling the function defined in the App component
    // ==> Because the data is managed in the App component, the management of the data
    //     is implemented in the function declared in the App component
    this.props.onSubmit(resp.data);
    this.userNameInput.current.value = '';
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="GitHub username"
          ref={this.userNameInput}
          required
        />
        <button>Add card</button>
      </form>
    )
  }
}

class FormWithReactValue extends React.Component {

  // callback to handle the form submit
  // the value submitted in the form is controlled by react 
  // through the state attribute 
  state = { username: '' }
  // using the value attribute
  // defined in the element, but in this case it is mandatory
  // to use onChange method to manipulate the value of the input
  // because React takes the control of the input element
  // onChange={ event => this.setState({ userName: event.target.value})}
  
  // the advantage here is here we have a feedback everytime a key is pressed
  // so depending the use-case this could be a good way to proceed
  handleSubmit = (event) => {
    event.preventDefault()
    console.log(this.state.username)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="GitHub username"
          value={this.state.username}
          onChange={ event => this.setState({ username: event.target.value})}
          required
        />
        <button>Add card</button>
      </form>
    )
  }
}



function App({ title }) {
  // Since we want to render the list of profiles everytime a new profile
  // is added, we need to put the list of profiles in a "state" object
  // like that, the magic of React will triger the render function
  // everytime the state of this object will change.

  // Although the profile list is managed in the CardList component
  // because a new profile is added from the Form component, in order to allow
  // the Form and the CardList components access the list of profiles
  // the state of list of profiles will need to be managed at this level.

  const [profiles, setState] = useState(testData);
 
  // This function is provided as an Input props to the Form component
  // so it can be requested on the form submission and it is here
  // where the logic to add the new profile to list is managed to
  // allow React controls the state change and re-render the UI
  const addNewProfile = (profileData) => {
    setState([...profiles, profileData])
  }

  return (
    <div className="App">
      <header className="App-header">{title}</header>
      <FormWithReactRef onSubmit={addNewProfile}/>
      {/* <FormWithReactValue /> */}
      <CardList profiles={profiles} />
    </div>
  )
}

export default App
