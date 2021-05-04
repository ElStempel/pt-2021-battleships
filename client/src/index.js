import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import background from "./images/sea.jpg";
import radar from "./images/radar.jpg";

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
	// display: 'inline-block',
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

const createButtonStyle = { 
	// marginLeft: '10px', 
	// backgroundColor: 'black', 
	// color: 'white', 
	display: 'inline-block', 
	float: 'right',
	marginTop: '20px',
	marginRight: '20px', 
	width: '120px', 
	height: '40px', 
	cursor: 'pointer', 
	fontSize: '15px'
}

const logoutButtonStyle = { 
	float: 'right',
	marginLeft: '20px', 
	marginTop: '5px',
	// display: 'flex',
  	// justifyContent: 'flex-end',
	// backgroundColor: 'black', 
	// color: 'white', 
	width: '120px', 
	height: '40px', 
	cursor: 'pointer', 
	fontSize: '15px'
}

const cancelButtonStyle = { 
	float: 'right',
	marginLeft: '20px', 
	marginTop: '5px',
	// display: 'flex',
  	// justifyContent: 'flex-end',
	// backgroundColor: 'black', 
	// color: 'white', 
	width: '120px', 
	height: '40px', 
	cursor: 'pointer', 
	fontSize: '15px'
}

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
		this.createRoom = this.createRoom.bind(this);
		this.enableRulesChoice = this.enableRulesChoice.bind(this);
		this.handleUsernameChange = this.handleUsernameChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);

		this.state = { div1Shown: true, div2Shown: true, customRulesDisabled: true, username: '', password: '' };

		this.customRule1 = false;
		this.customRule2 = false;
		this.customRule3 = false;
		this.customRule4 = false;
		this.customSize = false;
		this.boardSize = 10;
		this.inviteOnly = false;

		this.wins = 0;
		this.loses = 0;
		this.shipsSunk = 0;
		this.anotherStat = 'xyz';
		this.nextStat = 'zyx';

		this.top = [
			{
				'player': 'Jas', 'score': 4000,
			},
			{
				'player': 'Stas', 'score': 3000,
			},
			{
				'player': 'Karl', 'score': 2000,
			},
			{
				'player': 'Ja', 'score': 1000,
			}
		];
	}

	chooseLogin(event){
		console.log("Login nacisniety")
		console.log(this.state.username);
		console.log(this.state.password);
		
		this.setState({
			div1Shown: !this.state.div1Shown,
		});
	}

	chooseRegister(){
		console.log("Rejestracja nacisnieta")
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ "user_name": this.state.username, "pass_hash": this.state.password })
		};
		fetch('http://localhost:9000/users/add', requestOptions);
	}

	createRoom(){
		console.log("Room created")
		this.setState({
			div2Shown: !this.state.div2Shown,
		});
	}

	enableRulesChoice(){
		console.log("Enabled custom rules")
		this.setState({
			customRulesDisabled: !this.state.customRulesDisabled,
		});
	}

	handleUsernameChange(e) {
		this.setState({username: e.target.value});
	}

	handlePasswordChange(e) {
		this.setState({password: e.target.value});
	}

	render() {
		const listNames = this.top.map((d) => <li key={d.player}>Player: {d.player}</li>);
		const listScore = this.top.map((d) => <li key={d.player}>Current Score: {d.score}</li>);
		return (
				this.state.div1Shown ?
				(
					<div id="startPage" style={{ width: '100%', height: '1010px', fontSize: '60px', background: '#222831', overflowX: 'hidden', }}>
				<br />
					<h1 style={startPageHeader}>Battleships Online</h1>
				<br />
					<div id='login' style={{textAlign: 'center', color: 'white', fontSize: '40px',}}>
						<p>Username</p>
						<input type="text" id="usernameInput" name="usernameInput" placeholder="Username" value={this.state.username} onChange={this.handleUsernameChange} style={inputStyle}/>
					</div>
					<div id='password' style={{textAlign: 'center', color: 'white', fontSize: '40px',}}>
						<p>Password</p>
						<input type="password" id="passwordInput" name="passwordInput" placeholder="Password" value={this.state.password} onChange={this.handlePasswordChange} style={inputStyle}/>
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
				)
				:
				(
					this.state.div2Shown ?
					(
							<div id="startPage" style={{ backgroundImage: `url(${background})`, width: '100%', height: '1010px', fontSize: '20px', background: '#222831', overflowX: 'hidden', }}>
						<br />
							<div id="startHeader" style={{display: 'flex', flexDirection: 'row', marginLeft: '38%', }}>
								<h1 style={startPageHeader}>Battleships Online</h1>
								<button class='logoutButton' id='logoutButton' onClick={this.chooseLogin} style={logoutButtonStyle}>Logout</button>
							</div>
						<br />
							<div id="pageAfterLogin" class="pageAfterLogin" style={{ backgroundImage: `url(${background})`, display: 'flex', flexDirection: 'row', }}>
								<div id="rooms" style={{display: 'inline-block', marginLeft: '50px', backgroundColor: 'grey', width: '600px', height: 'auto'}}>
									<h2 id="roomsText" style={{ marginLeft: '10px', minHeight: '600px', color: 'white', display: 'inline-block', }}>Rooms</h2>
									<button class='createButton' id='createButton' onClick={this.createRoom} style={createButtonStyle}>Create Room</button>
								</div>
								<div id="players" style={{display: 'inline-block', minHeight: '600px', marginLeft: '50px', backgroundColor: 'grey', width: '600px', height: 'auto', }}>
									<h2 style={{ marginLeft: '10px', color: 'white', }}>Top Players</h2>
									<div id="playerNames" style={{ marginLeft: '25px', display: 'inline-block', listStyleType: 'none', color: 'white', }}>
										{listNames}
									</div>
									<div id="playerNames" style={{ float: 'right', marginRight: '20px', display: 'inline-block', listStyleType: 'none', color: 'white', }}>
										{listScore}
									</div>
								</div>
								<div id="statistics" style={{display: 'inline-block', marginTop: '0px', marginLeft: '50px', backgroundColor: 'grey', width: '600px', height: 'auto'}}>
									<h2 style={{ marginLeft: '10px', color: 'white', }}>My statistics</h2>
								<br />
									<p id="numberOfWins" style={{textAlign: 'center', color: 'white', fontSize: '20px', fontWeight: 'bold'}}>
										Wins: {this.wins}
									</p>
								<br />
									<p id="numberOfLoses" style={{textAlign: 'center', color: 'white', fontSize: '20px', fontWeight: 'bold'}}>
										Loses: {this.loses}
									</p>
								<br />
									<p id="numberOfShipsSunk" style={{textAlign: 'center', color: 'white', fontSize: '20px', fontWeight: 'bold'}}>
										Ships sunk: {this.shipsSunk}
									</p>
								<br />
									<p id="otherStat" style={{textAlign: 'center', color: 'white', fontSize: '20px', fontWeight: 'bold'}}>
										Another stat: {this.anotherStat}
									</p>
								<br />
									<p id="anotherStat" style={{textAlign: 'center', color: 'white', fontSize: '20px', fontWeight: 'bold'}}>
										Another stat: {this.nextStat}
									</p>
								</div>
							</div>
						</div>
					)
					:
					(
						<div id="createRoomPage" style={{ backgroundImage: `url(${radar})`, width: '100%', height: '1010px', fontSize: '20px', background: '#222831', overflowX: 'hidden', }}>
						<br />
							<div id="startHeader" style={{display: 'flex', flexDirection: 'row', marginLeft: '38%', }}>
								<h1 style={startPageHeader}>Battleships Online</h1>
								<button class='cancelButton' id='cancelButton' onClick={this.createRoom} style={cancelButtonStyle}>Cancel</button>
							</div>
							<div style={{ marginLeft: '50px', backgroundColor: 'grey', width: '1930px', height: '800px', }}>
								<h3 style={{marginLeft: '50px', color: 'white', }}>New Room</h3>
								<div>
									<input style={{width: '30px', height: '30px', marginLeft: '10px'}} type="checkbox" id="customRules" name="customRules" value="customRules" onChange={this.enableRulesChoice}/>
									<label style={{fontSize: '30px', fontWeight: 'bold', marginLeft: '10px' }} forHtml="customRules">Custom Rules</label><br/>
									<br/>
									<input style={{width: '30px', height: '30px', marginLeft: '10px'}} type="checkbox" id="customRule1" name="customRule1" value="customRule1" disabled={this.state.customRulesDisabled}/>
									<label style={{fontSize: '30px', fontWeight: 'bold', marginLeft: '10px' }} forHtml="customRule1">Rule 1</label><br/>
									<br/>
									<input style={{width: '30px', height: '30px', marginLeft: '10px'}} type="checkbox" id="customRule2" name="customRule2" value="customRule2" disabled={this.state.customRulesDisabled}/>
									<label style={{fontSize: '30px', fontWeight: 'bold', marginLeft: '10px' }} forHtml="customRule2">Rule 2</label><br/>
									<br/>
									<input style={{width: '30px', height: '30px', marginLeft: '10px'}} type="checkbox" id="customRule3" name="customRule3" value="customRule3" disabled={this.state.customRulesDisabled}/>
									<label style={{fontSize: '30px', fontWeight: 'bold', marginLeft: '10px' }} forHtml="customRule3">Rule 3</label><br/>
									<br/>
									<input style={{width: '30px', height: '30px', marginLeft: '10px'}} type="checkbox" id="customRule4" name="customRule4" value="customRule4" disabled={this.state.customRulesDisabled}/>
									<label style={{fontSize: '30px', fontWeight: 'bold', marginLeft: '10px' }} forHtml="customRule4">Rule 4</label><br/>
									<br/>
									<br/>

									<select style={{fontSize: '30px', fontWeight: 'bold', width: '140px', height: '40px', marginLeft: '10px' }} name="size" id="size" disabled={this.state.customRulesDisabled}>
										<option value="10">10 x 10</option>
										<option value="16">16 x 16</option>
										<option value="24">24 x 24</option>
										<option value="30">30 x 30</option>
									</select> 
									<label style={{fontSize: '30px', fontWeight: 'bold', marginLeft: '10px' }} forHtml="size">Choose board size</label>
									<br/>
									<br/>
									<br/>
									<br/>
									<br/>
									<br/>
									
									<div style={{ textAlign: 'center' }}>
										<button class='newRoomButton' id='newRoomButton' onClick={this.createRoom} style={{ width: '1200px', height: '80px', fontSize: '50px', textAlign: 'center', cursor: 'pointer' }}>Create room with specified rules</button>
									</div>
								</div>
							</div>
						</div>
					)
				)
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

