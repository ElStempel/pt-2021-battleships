import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import background from "./images/sea.jpg";

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
		this.createRoom = this.createRoom.bind(this);
		this.state = { div1Shown: true };
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
		
		this.setState({
			div1Shown: false,
		});
	}

	chooseRegister(){
		console.log("Rejestracja nacisnieta")
	}

	createRoom(){
		console.log("Room created")
	}

	render() {
		const listNames = this.top.map((d) => <li key={d.player}>Player: {d.player}</li>);
		const listScore = this.top.map((d) => <li key={d.player}>Current Score: {d.score}</li>);
		return (
				this.state.div1Shown ?
				(
					<div id="startPage" style={{ width: '100%', height: '1010px', fontSize: '60px', background: '#222831', overflowX: 'hidden'}}>
				<br />
					<h1 style={startPageHeader}>Battleships Online</h1>
				<br />
					<div id='login' style={{textAlign: 'center', color: 'white', fontSize: '40px',}}>
						<p>Username</p>
						<input type="text" id="passwordInput" name="passwordInput" style={inputStyle}/>
					</div>
					<div id='password' style={{textAlign: 'center', color: 'white', fontSize: '40px',}}>
						<p>Password</p>
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
				)
				:
				(
					<div id="startPage" style={{ backgroundImage: `url(${background})`, width: '100%', height: '1010px', fontSize: '20px', background: '#222831', overflowX: 'hidden'}}>
				<br />
					<h1 style={startPageHeader}>Battleships Online</h1>
				<br />
					<div id="pageAfterLogin" class="pageAfterLogin" style={{ backgroundImage: `url(${background})`, display: 'flex', flexDirection: 'row', }}>
						<div id="rooms" style={{display: 'inline-block', marginLeft: '50px', backgroundColor: 'grey', width: '600px', height: 'auto'}}>
							<h2 id="roomsText" style={{ marginLeft: '10px', minHeight: '600px', color: 'white', display: 'inline-block', }}>Rooms</h2>
							<button class='createButton' id='createButton' onClick={this.createRoom} style={{ marginLeft: '10px', background: 'black', color: 'white', display: 'inline-block', marginLeft: '350px', width: '120px', height: '40px', cursor: 'pointer', fontSize: '15px'}}>Create Room</button>
						</div>
						<div id="players" style={{display: 'inline-block', minHeight: '600px', marginLeft: '50px', backgroundColor: 'grey', width: '600px', height: 'auto', }}>
          					<h2 style={{ marginLeft: '10px', color: 'white', }}>Top Players</h2>
							<div id="playerNames" style={{ marginLeft: '25px', display: 'inline-block', listStyleType: 'none', color: 'white', }}>
								{listNames}
							</div>
							<div id="playerNames" style={{ marginLeft: '250px', display: 'inline-block', listStyleType: 'none', color: 'white', }}>
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

				{/* <h1 style="position: relative; left: 5%;">Battleships Online</h1>
    <div id="pageAfterLogin" class="pageAfterLogin">
      <div id="rooms">
        <h2 id="roomsText">Open Rooms</h2>
        <button class='createButton' id='createButton' onclick='createClicked();''>Create Room</button>
        <br>
        <br>
        <br>
        <div class="room">
          <p id="roomName" class="roomName">Room 13</p>
          <p id="space">- -</p>
          <button class='joinButton' id='joinButton' onclick='joinClicked();''>Join</button>
        </div>
        <div class="room">
          <p id="roomName" class="roomName">Room 43</p>
          <p id="space">- -</p>
          <button style="opacity: 0.6; cursor: not-allowed;" class='joinButton' id='joinButton' onclick='joinClicked();''>Full</button>
        </div>
      </div>

      <div id="players">
          <h2>Top Players</h2>
          <p style="word-spacing: 150px;">User333 486-wins</p>
          <p style="word-spacing: 160px;">User32 354-wins</p>
      </div>

      <div id="statistics">
        <h2>My stats</h2>
        <p id="numberOfWins" style="text-align: center">
          Wins: 55
        </p>
        <p id="numberOfLoses" style="text-align: center">
          Loses: 210
        </p>
        <p id="numberOfShipsSunk" style="text-align: center">
          Ships sunk: 327
        </p>
        <p id="otherStat" style="text-align: center">
          Another stat: xyz
        </p>
        <p id="anotherStat" style="text-align: center">
          Another stat: zyx
        </p>

      </div>
    </div> */}
					</div>
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

