import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import background from "./images/sea.jpg";
import radar from "./images/radar.jpg";



const startPageHeader = {
	margin: 0,
    padding: 0,
	textAlign: 'center',
	color: 'white',
};

const buttonChooseStyle = {
    display: 'inline-block',
	position: 'relative',
	marginLeft: '20px',
	cursor: 'pointer',
	width: '608px',
	height: '50px',
	fontSize: '30px',
};

const createButtonStyle = { 
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
	width: '120px', 
	height: '40px', 
	cursor: 'pointer', 
	fontSize: '15px'
}

const cancelButtonStyle = { 
	float: 'right',
	marginLeft: '20px', 
	marginTop: '5px',
	width: '120px', 
	height: '40px', 
	cursor: 'pointer', 
	fontSize: '15px'
}

const inputStyle = {
    display: 'inline-block',
	position: 'relative',
	width: '600px',
	height: '50px',
	fontSize: '30px',
};

const deleteAccountButton = {
	width: '120px', 
	height: '40px',
	cursor: 'pointer', 
	fontSize: '15px'
}

var activeForRules;

class Window extends React.Component {
	constructor(props) {
		super(props);

		this.chooseLogin = this.chooseLogin.bind(this);
		this.chooseRegister = this.chooseRegister.bind(this);
		this.chooseLogout = this.chooseLogout.bind(this);
		this.createRoom = this.createRoom.bind(this);
		this.confirmRoomCreation = this.confirmRoomCreation.bind(this);
		this.enableRulesChoice = this.enableRulesChoice.bind(this);
		this.handleUsernameChange = this.handleUsernameChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.showDeletePopup = this.showDeletePopup.bind(this);
		this.getRoomsList = this.getRoomsList.bind(this);
		this.clearRoomList = this.clearRoomList.bind(this);
		this.handleChangeDeletePopup = this.handleChangeDeletePopup.bind(this);
		this.handleSubmitDeletePopup = this.handleSubmitDeletePopup.bind(this);
		this.handleClickDeletePopup = this.handleClickDeletePopup.bind(this);
		this.joinGame = this.joinGame.bind(this);

		this.state = { 
			div1Shown: true, 
			div2Shown: true, 
			gameShown: false,
			customRulesDisabled: true, 
			startText: '',
			username: '', 
			password: '', 
			user_id: '', 
			games_played: 0, 
			ships_sunk: 0, 
			ships_lost: 0,
			shots_fired: 0,
			wins: 0,
			loses: 0,
			deleteAccountSeen: false,
			customRule1: false,
			customRule2: false,
			customRule3: false,
			customRule4: false,
			inviteOnly: false,
			customSize: false,
			boardSize: 10,
			inviteOnly: false,
			rooms: [
				{ room: 'Room 1', full: false },
				{ room: 'Room 2', full: false },
				{ room: 'Room 3', full: false },
				{ room: 'Room 4', full: false },
				{ room: 'Room 5', full: false },
			],
			deleteAccountModal: true,
			inputValue: '',

		};
		
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

		activeForRules = this;
	}

	togglePop = () => {
		this.setState({
			deleteAccountSeen: !this.state.deleteAccountSeen,
		});
	};

	chooseLogin(event){
		var that = this;

		// that.clearRoomList();
		that.getRoomsList();

		console.log("Login nacisniety")

		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ "user_name": this.state.username, "pass_hash": this.state.password })
		};

		var stat = 0;

		that.setState({
			startText: '',
		});

		fetch('https://localhost:9000/users/login', requestOptions)
		.then(function(response) { 
			stat = response.status;
			if(stat != 200){
				that.setState({
					startText: 'Invalid Credentials. Please, try again.',
				});
			}
			return response.json(); 
		})
		.then(function(data) { 
			if(stat == 200){
				that.setState({
					div1Shown: !that.state.div1Shown,
					user_id: data._id,
					startText: '',
					games_played: 0, 
					ships_sunk: 0, 
					ships_lost: 0,
					shots_fired: 0,
					wins: 0,
					loses: 0,
				});
			}
		});
	}

	chooseRegister(){
		var that = this;

		console.log("Rejestracja nacisnieta")
		var stat = 0;
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ "user_name": this.state.username, "pass_hash": this.state.password })
		};

		fetch('https://localhost:9000/users/add', requestOptions)
		.then(function(response) { 
			stat = response.status;
			if(stat == 201){
				that.setState({
					startText: 'New account created.',
				});
			}
		});
	}

	chooseLogout(){
		var that = this;

		console.log("Rejestracja nacisnieta")
		var stat = 0;
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({})
		};

		fetch('https://localhost:9000/users/logout', requestOptions)
		.then(function(response) { 
			stat = response.status;
			if(stat == 200){
				that.setState({
					div1Shown: !that.state.div1Shown,
					startText: '',
					username: '', 
					password: '', 
					user_id: '', 
					games_played: 0, 
					ships_sunk: 0, 
					ships_lost: 0,
					shots_fired: 0,
					wins: 0,
					loses: 0,
				});
			}
		});
	}

	showDeletePopup(){
		var that = this;
		console.log("Usuwanie konta")
		that.setState({
			deleteAccountModal: false,
		});
	}

	getRoomsList(){
		console.log("Getting list of rooms")
		var receivedRooms = '';
		const requestOptions = {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		};
		var stat = 0;
		fetch('https://localhost:9000/rooms/list', requestOptions)
		// .then(function(response) { 
		// 	stat = response.status;
		// 	if(stat == 200){
		// 		receivedRooms = response.json();
		// 	}
		// 	console.log(receivedRooms)
		// });

		// this.setState({
		// 	rooms: this.state.rooms.concat({ room: 'Room 1', full: false })
		// });
	}

	clearRoomList(){
		this.setState({
			rooms: [],
		});
	}

	createRoom(){
		console.log("Creating room")
		console.log(this.state.user_id);
		this.setState({
			div2Shown: !this.state.div2Shown,
		});
	}

	confirmRoomCreation(){
		console.log("Room created")
		console.log(this.state.user_id);

		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ "player_1_id": this.state.user_id })
		};
		fetch('https://localhost:9000/rooms/create', requestOptions);
		this.setState({
			div2Shown: !this.state.div2Shown,
		});

		console.log(activeForRules.state.customRule1);
		console.log(activeForRules.state.customRule2);
		console.log(activeForRules.state.customRule3);
		console.log(activeForRules.state.customRule4);
		console.log(activeForRules.state.inviteOnly);
	}

	enableRulesChoice(){
		console.log("Enabled custom rules")
		this.setState({
			customRulesDisabled: !this.state.customRulesDisabled,
		});
	}

	enableRule1(){
		console.log("Enabled custom rule 1")
		activeForRules.setState({
			customRule1: !activeForRules.state.customRule1,
		});
	}

	enableRule2(){
		console.log("Enabled custom rule 2")
		activeForRules.setState({
			customRule2: !activeForRules.state.customRule2,
		});
	}

	enableRule3(){
		console.log("Enabled custom rule 3")
		activeForRules.setState({
			customRule3: !activeForRules.state.customRule3,
		});
	}

	enableRule4(){
		console.log("Enabled custom rule 4")
		activeForRules.setState({
			customRule4: !activeForRules.state.customRule4,
		});
	}

	enableInviteOnly(){
		console.log("Enabled invite only")
		activeForRules.setState({
			inviteOnly: !activeForRules.state.inviteOnly,
		});
	}


	handleUsernameChange(e) {
		this.setState({username: e.target.value});
	}

	handlePasswordChange(e) {
		this.setState({password: e.target.value});
	}

	handleClickDeletePopup = () => {
		var that = this;
		that.setState({
			deleteAccountModal: true,
		});
	};

	handleSubmitDeletePopup(event) {
		var that = this;
		that.setState({
			deleteAccountModal: true,
		});
		if(that.state.password = that.state.inputValue){
			var stat = 0;
			const requestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ _id: that.state.user_id, pass_hash: that.state.password})
			};

			fetch('https://localhost:9000/users/delete', requestOptions)
			.then(function(response) { 
				stat = response.status;
				if(stat == 200){
					that.setState({
						div1Shown: !that.state.div1Shown,
						startText: '',
						username: '', 
						password: '', 
						user_id: '', 
						games_played: 0, 
						ships_sunk: 0, 
						ships_lost: 0,
						shots_fired: 0,
						wins: 0,
						loses: 0,
					});
				}
			});
		}
	}

	handleChangeDeletePopup(event) {
		this.setState({ inputValue: event.target.value });
	}

	joinGame(){
		this.setState({ gameShown: !this.state.gameShown });
	}

	render() {
		const listNames = this.top.map((d) => <li style={{ height: '80px', fontWeight: 'bold' }} key={d.player}>Player: {d.player}</li>);
		const listScore = this.top.map((d) => <li style={{ height: '80px', fontWeight: 'bold' }} key={d.player}>Current Score: {d.score}</li>);
		const listRooms = this.state.rooms.map((r) => <li style={{ height: '80px', fontWeight: 'bold' }} key={r.room}>{r.room} <button id='joinButton' class='joinButton' onClick={this.joinGame} style={{display: 'inline-block', float: 'right', marginRight: '20px', width: '120px', height: '40px', cursor: 'pointer', fontSize: '15px'}}>Join</button></li>)
		
		const noHover = {
			pointerEvents: 'none',
		}

		let rowsPlayer = [];
        for (let y = 0; y < 10; y++) {
            const cellsPlayer = [];
            for (let x = 0; x < 10; x++) {
                cellsPlayer.push(<th><button class='but' id='but' disabled='false'></button></th>);
            }
            rowsPlayer.push(<tr>{cellsPlayer}</tr>);
        }

		let rowsEnemy = [];
        for (let y = 0; y < 10; y++) {
            const cellsEnemy = [];
            for (let x = 0; x < 10; x++) {
                cellsEnemy.push(<th><button class='but' id='but' style={noHover} disabled='true'></button></th>);
            }
            rowsEnemy.push(<tr>{cellsEnemy}</tr>);
        }


		return (
				this.state.div1Shown ?
				(
					<div id="startPage" style={{ width: '100%', height: '1010px', fontSize: '60px', background: '#222831', overflowX: 'hidden', }}>
					<h1 style={startPageHeader}>Battleships Online</h1>
					<p style={{ height: '50px', textAlign: 'center', fontSize: '60px', color: 'white', fontWeight: 'bold' }}>{this.state.startText}</p>
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
						this.state.gameShown ?
						(
							<div id='gamePage' class='gamePage' style={{ width: '100%', height: '1010px', display: 'inline-block', backgroundColor: '#09322E'}}>
								<div id='playerBoard' class='playerBoard' style={{ display: 'inline-block', fontSize: '60px', marginLeft: '50px', marginTop: '20px', }}>
									<table class='playerTable'>{rowsPlayer}</table>
									<p style={{textAlign: 'center', fontSize: '35px', color:'white', fontWeight: 'bold'}}>Player Board</p>
								</div>
								<div id='enemyBoard' class='enemyBoard' style={{ display: 'inline-block', fontSize: '60px', marginLeft: '50px', marginTop: '20px', }}>
									<table class='enemyTable'>{rowsEnemy}</table>
									<p style={{textAlign: 'center', fontSize: '35px', color:'white', fontWeight: 'bold'}}>Enemy Board</p>
								</div>
								<div id='gameButtons' class='gameButtons' style={{ display: 'inline-block', verticalAlign: 'top', marginLeft: '50px', marginTop: '20px', }}>
									<br></br>
									<button id='fiveFields' class="ship">Dreadnought</button>
									<br></br>
									<button id='fourFields' class="ship">Cruiser</button>
									<br></br>
									<button id='threeFieldsOne' class="ship">Submarine</button>
									<br></br>
									<button id='threeFieldsTwo' class="ship">Destroyer</button>
									<br></br>
									<button id='twoFields' class="ship">Recon</button>
									<br></br>
									<br></br>
									<br></br>
									<button id='confirmShips' class="confirmShips" disabled='true' style={noHover}>Confirm Setup</button>
									<br></br>
									<br></br>
									<br></br>
									<button id='confirmShot' class="confirmShot" disabled='true' style={noHover}>Confirm Shot</button>
								</div>

							</div>
						)
						:
						(
								<div id="startPage" style={{ backgroundImage: `url(${background})`, width: '100%', height: '1010px', fontSize: '20px', background: '#222831', overflowX: 'hidden', }}>
							<br />
								<div id="startHeader" style={{display: 'flex', flexDirection: 'row', marginLeft: '38%', }}>
									<h1 style={startPageHeader}>Battleships Online</h1>
									<button class='logoutButton' id='logoutButton' onClick={this.chooseLogout} style={logoutButtonStyle}>Logout</button>
								</div>
							<br />
								<div id="pageAfterLogin" class="pageAfterLogin" style={{ backgroundImage: `url(${background})`, display: 'flex', flexDirection: 'row', }}>
									<div id="rooms" style={{display: 'inline-block', marginLeft: '50px', backgroundColor: 'grey', width: '600px', height: 'auto'}}>
										<h2 id="roomsText" style={{ marginLeft: '10px', minHeight: '40px', color: 'white', display: 'inline-block', }}>Rooms</h2>
										<button class='createButton' id='createButton' onClick={this.createRoom} style={createButtonStyle}>Create Room</button>
										<hr></hr>
										<div id="roomsEntrys" style={{ marginLeft: '25px', listStyleType: 'none', color: 'white', }}>
											{listRooms}
										</div>
									</div>
									<div id="players" style={{display: 'inline-block', minHeight: '600px', marginLeft: '50px', backgroundColor: 'grey', width: '600px', height: 'auto', }}>
										<h2 style={{ marginLeft: '10px', color: 'white', minHeight: '50px',}}>Top Players</h2>
										<hr></hr>
										<div id="playerNames" style={{ marginLeft: '25px', display: 'inline-block', listStyleType: 'none', color: 'white', }}>
											{listNames}
										</div>
										<div id="playerNames" style={{ float: 'right', marginRight: '20px', display: 'inline-block', listStyleType: 'none', color: 'white', }}>
											{listScore}
										</div>
									</div>

									{/* {this.state.deleteAccountSeen ? <DeletePopup toggle={this.togglePop} /> : null} */}
									<div className="modal" hidden={this.state.deleteAccountModal}>
										<div className="modal_content">
										<span className="close" onClick={this.handleClickDeletePopup}>
											&times;
										</span>
										<form>
											<h2>Type in your password to delete Account.</h2>
											<div style={{ textAlign: 'center'}}>
												<label>
												Password:
												<input type="text" name="name" onChange={this.handleChangeDeletePopup} placeholder='Password' style={{ marginLeft: '20px', height: '30px', width: '300px'}}/>
												</label>
											</div>
											<br />
											<div style={{ textAlign: 'center'}}> 
												<input id="submitButton" class="submitButton" type="submit" value='Confirm' onSubmit={this.handleSubmitDeletePopup} style={{ cursor: 'pointer', height: '30px', width: '400px' }}/>
											</div>
										</form>
										</div>
									</div>

									<div id="statistics" style={{display: 'inline-block', marginTop: '0px', marginLeft: '50px', backgroundColor: 'grey', width: '600px', height: 'auto'}}>
										<h2 style={{ marginLeft: '10px', color: 'white', minHeight: '50px',}}>My statistics</h2>
										<hr></hr>
										<p id="games_played" style={{textAlign: 'center', color: 'white', fontSize: '20px', fontWeight: 'bold'}}>
											Games played: {this.state.games_played}
										</p>
									<br />
										<p id="ships_sunk" style={{textAlign: 'center', color: 'white', fontSize: '20px', fontWeight: 'bold'}}>
											Ships sunk: {this.state.ships_sunk}
										</p>
									<br />
										<p id="ships_lost" style={{textAlign: 'center', color: 'white', fontSize: '20px', fontWeight: 'bold'}}>
											Ships lost: {this.state.ships_lost}
										</p>
									<br />
										<p id="shots_fired" style={{textAlign: 'center', color: 'white', fontSize: '20px', fontWeight: 'bold'}}>
											Shots fired: {this.state.shots_fired}
										</p>
									<br />
										<p id="wins" style={{textAlign: 'center', color: 'white', fontSize: '20px', fontWeight: 'bold'}}>
											Victories: {this.state.wins}
										</p>
									<br />
										<p id="loses" style={{textAlign: 'center', color: 'white', fontSize: '20px', fontWeight: 'bold'}}>
											Loses: {this.state.loses}
										</p>
									<br />
										<div style={{ textAlign: 'center', }}>
											<button class='deleteAccountButton' id='deleteAccountButton' onClick={this.showDeletePopup} style={deleteAccountButton}>Delete Account</button>
										</div>
									<br />
									</div>
								</div>
							</div>
						)
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
									<input style={{width: '30px', height: '30px', marginLeft: '10px'}} type="checkbox" ref="customRules" id="customRules" name="customRules" value="customRules" onChange={this.enableRulesChoice}/>
									<label style={{fontSize: '30px', fontWeight: 'bold', marginLeft: '10px' }} forHtml="customRules">Custom Rules</label><br/>
									<br/>
									<input style={{width: '30px', height: '30px', marginLeft: '10px'}} type="checkbox" ref="customRule1" id="customRule1" name="customRule1" value="customRule1" onChange={this.enableRule1} disabled={this.state.customRulesDisabled}/>
									<label style={{fontSize: '30px', fontWeight: 'bold', marginLeft: '10px' }} forHtml="customRule1">Rule 1</label><br/>
									<br/>
									<input style={{width: '30px', height: '30px', marginLeft: '10px'}} type="checkbox" ref="customRule2" id="customRule2" name="customRule2" value="customRule2" onChange={this.enableRule2} disabled={this.state.customRulesDisabled}/>
									<label style={{fontSize: '30px', fontWeight: 'bold', marginLeft: '10px' }} forHtml="customRule2">Rule 2</label><br/>
									<br/>
									<input style={{width: '30px', height: '30px', marginLeft: '10px'}} type="checkbox" ref="customRule3" id="customRule3" name="customRule3" value="customRule3" onChange={this.enableRule3} disabled={this.state.customRulesDisabled}/>
									<label style={{fontSize: '30px', fontWeight: 'bold', marginLeft: '10px' }} forHtml="customRule3">Rule 3</label><br/>
									<br/>
									<input style={{width: '30px', height: '30px', marginLeft: '10px'}} type="checkbox" ref="customRule4" id="customRule4" name="customRule4" value="customRule4" onChange={this.enableRule4} disabled={this.state.customRulesDisabled}/>
									<label style={{fontSize: '30px', fontWeight: 'bold', marginLeft: '10px' }} forHtml="customRule4">Rule 4</label><br/>
									<br/>
									<input style={{width: '30px', height: '30px', marginLeft: '10px'}} type="checkbox" ref="inviteOnly" id="inviteOnly" name="inviteOnly" value="inviteOnly" onChange={this.enableInviteOnly} disabled={this.state.customRulesDisabled}/>
									<label style={{fontSize: '30px', fontWeight: 'bold', marginLeft: '10px' }} forHtml="inviteOnly">Invite Only</label><br/>
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
										<button class='newRoomButton' id='newRoomButton' onClick={this.confirmRoomCreation} style={{ width: '1200px', height: '80px', fontSize: '50px', textAlign: 'center', cursor: 'pointer' }}>Create room with specified rules</button>
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