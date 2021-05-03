import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import background from "./images/radar.jpg";

const backgroundImage = {
	backgroundImage: 'url("/radar.jfif")',
	width: '1920px',
	height: '1200px',
	margin: 0,
    padding: 0,
}

const startPageHeader = {
	margin: 0,
    padding: 0,
	// position: 'relative',
	// left: '45%',
	textAlign: 'center',
	color: 'white',
};

const buttonChooseStyle = {
	// margin: '0 auto',
    display: 'inline-block',
	position: 'relative',
	marginLeft: '20px',
	cursor: 'pointer',
	width: '608px',
	height: '50px',
	fontSize: '30px',
};

const inputStyle = {
	// margin: '0 auto',
    display: 'inline-block',
	position: 'relative',
	// marginLeft: '20px',
	width: '600px',
	height: '50px',
	fontSize: '30px',
};

class Window extends React.Component {
	constructor(props) {
		super(props);
		this.chooseLogin = this.chooseLogin.bind(this);
		this.chooseRegister = this.chooseRegister.bind(this);
		this.state = {loginValue: 'Login', passwordValue: 'Password'};
	}

	chooseLogin(event){
		console.log("Login nacisniety")
		
	}

	chooseRegister(){
		console.log("Rejestracja nacisnieta")
	}

	render() {
		return (
			<div id="startPage" style={{ backgroundImage: `url(${background})`, width: '100%', height: '1010px', fontSize: '60px', background: '#222831', overflowX: 'hidden'}}>
				<br />
					<h1 style={startPageHeader}>Battleships Online</h1>
				<br />
					<div id='login' style={{textAlign: 'center', color: 'white', fontSize: '40px',}}>
						<p>{this.state.loginValue}</p>
						<input type="text" id="passwordInput" name="passwordInput" style={inputStyle}/>
					</div>
					<div id='password' style={{textAlign: 'center', color: 'white', fontSize: '40px',}}>
						<p>{this.state.passwordValue}</p>
						<input type="password" id="passwordInput" name="passwordInput" style={inputStyle}/>
					</div>
				<br />
					<div id="buttons" style={{textAlign: 'center',}}>
					<button style={buttonChooseStyle} class="buttonChoose" id="chooseLogin" onClick={this.chooseLogin}>
						Login
					</button>
					<button style={buttonChooseStyle} class="buttonChoose" id="chooseRegister" onClick={this.chooseRegister}>
						Create new Account
					</button>
					</div>
			</div>
		);
	}
}

ReactDOM.render(<Window />, document.getElementById('root'));

// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import background from "./images/radar.jpg";

// const backgroundImage = {
// 	backgroundImage: 'url("/radar.jfif")',
// 	width: '1920px',
// 	height: '1200px',
// 	margin: 0,
//     padding: 0,
// }

// const startPageHeader = {
// 	margin: 0,
//     padding: 0,
// 	position: 'relative',
// 	left: '45%',
// 	color: 'white',
// };

// const buttonChooseStyle = {
// 	margin: 0,
// 	position: 'relative',
// 	left: '52%',
// 	cursor: 'pointer',
// 	width: '200px',
// 	height: '50px',
// 	fontSize: '20px',
// };

// function chooseLogin(){

// }

// function chooseRegister(){

// }

// ReactDOM.render(
// <React.StrictMode>
// 	<div id="startPage" style={{ backgroundImage: `url(${background})`, width: '100%', height: '1010px', fontSize: '40px', overflowX: 'hidden'}}>
// 		<br />
// 		<h1 style={startPageHeader}>Battleships Online</h1>
// 		<button style={buttonChooseStyle} class="buttonChoose" id="chooseLogin()" onclick={chooseLogin}>
// 			Login
// 		</button>
// 		<button style={buttonChooseStyle} class="buttonChoose" id="chooseRegister" onclick={chooseRegister()}>
// 			Create new Account
// 		</button>
		
// 	</div>
// </React.StrictMode>,
// document.getElementById('root')
// );

