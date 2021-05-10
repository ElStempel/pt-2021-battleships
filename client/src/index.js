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
		this.getPlayersList = this.getPlayersList.bind(this);
		this.clearPlayersList = this.clearPlayersList.bind(this);
		this.handleChangeDeletePopup = this.handleChangeDeletePopup.bind(this);
		this.handleSubmitDeletePopup = this.handleSubmitDeletePopup.bind(this);
		this.handleClickDeletePopup = this.handleClickDeletePopup.bind(this);
		this.joinGame = this.joinGame.bind(this);
		this.handlePlayerBoardClick = this.handlePlayerBoardClick.bind(this);
		this.handleEnemyBoardClick = this.handleEnemyBoardClick.bind(this);
		this.handleConfirmShips = this.handleConfirmShips.bind(this);
		this.handleResetBoard = this.handleResetBoard.bind(this);
		this.handleShipButtonClick = this.handleShipButtonClick.bind(this);
		this.handleConfirmShot = this.handleConfirmShot.bind(this);
		this.updatePlayers = this.updatePlayers.bind(this);
		this.updateRooms = this.updateRooms.bind(this);
		this.startGame = this.startGame.bind(this);
		this.deleteYourRoom = this.deleteYourRoom.bind(this);
		this.leaveRoom = this.leaveRoom.bind(this);
		this.fetchGameStart = this.fetchGameStart.bind(this);

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

			createButtonDisabled: false,
			joinRoomHidden: 'hidden',
			deleteRoomHidden: 'hidden',

			rooms: [

			],
			playersList:[

			],

			deleteAccountModal: true,
			inputValue: '',
			enemyBoardButtons: true,

			dreadnoughtEnabled: true,
			cruiserEnabled: true,
			submarineEnabled: true,
			destroyerEnabled: true,
			reconEnabled: true,

			dreadnoughtFields: 5,
			cruiserFields: 4,
			submarineFields: 3,
			destroyerFields: 3,
			reconFields: 2,

			availableFields: 0,

			shipDeployed: false,

			dreadnoughtCoordsList: [],
			cruiserCoordsList: [],
			submarineCoordsList: [],
			destroyerCoordsList: [],
			reconCoordsList: [],

			playerBoardEnabled: false,

			room_id: 0,
			game_id: 0,

		};

		activeForRules = this;
	}

	togglePop = () => {
		this.setState({
			deleteAccountSeen: !this.state.deleteAccountSeen,
		});
	};

	updateRooms(){
		var that = this;
		that.clearRoomList();
		that.getRoomsList();
	}

	updatePlayers(){
		var that = this;
		that.clearPlayersList();
		that.getPlayersList();
	}

	chooseLogin(event){
		var that = this;
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
		}, )
		.then(function(data) { 
			if(stat == 200){
				console.log(data._id)
				that.setState({
					div1Shown: !that.state.div1Shown,
					user_id: data._id,
					startText: '',
					games_played: data.stats.games_played, 
					ships_sunk: data.stats.ships_sunk, 
					ships_lost: data.stats.ships_lost,
					shots_fired: data.stats.shots_fired,
					wins: 0,
					loses: 0,
				});
			}
		})
		.then(function(data) {
			that.clearRoomList();
			that.clearPlayersList();
		})
		.then(function(data) {
			that.getRoomsList();
			that.getPlayersList();
		})

		console.log(that.state.user_id)

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

	getRoomsList(){
		var that = this;
		console.log("Getting list of rooms")
		var receivedRooms;
		const requestOptions = {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		};
		var stat = 0;
		fetch('https://localhost:9000/rooms/list', requestOptions)
		.then(function(response) { 
			stat = response.status;
			console.log(stat)
			if(stat == 200){
				receivedRooms = response.json();
			}
			return receivedRooms;
		}).then(function(receivedRooms){
			console.log(receivedRooms)
			for(var i = 0; i < receivedRooms.length; i++){
				if(receivedRooms[i].player_1 == that.state.username){
					that.setState({
						room_id: receivedRooms[i]._id,
						joinRoomHidden: 'hidden',
						deleteRoomHidden: 'visible',
						rooms: that.state.rooms.concat({ room: 'Room ' + (i + 1).toString(), full: true, hover: 'none', text: 'Created Room', roomId: receivedRooms[i]._id })
					});
				}
				else if(receivedRooms[i].player_2 == null && that.state.room_id == 0){
					that.setState({
						rooms: that.state.rooms.concat({ room: 'Room ' + (i + 1).toString(), full: false, hover: 'auto', text: 'Join', roomId: receivedRooms[i]._id })
					});
				}
				else if(receivedRooms[i].player_2 == null){
					that.setState({
						rooms: that.state.rooms.concat({ room: 'Room ' + (i + 1).toString(), full: true, hover: 'none', text: 'Join', roomId: receivedRooms[i]._id  })
					});
				}
				else if(receivedRooms[i].player_2 == that.state.username){
					that.setState({
						room_id: receivedRooms[i]._id,
						joinRoomHidden: 'visible',
						createButtonDisabled: true,
						rooms: that.state.rooms.concat({ room: 'Room ' + (i + 1).toString(), full: true, hover: 'none', text: 'Joined Room', roomId: receivedRooms[i]._id })
					});
				}	
				else{
					that.setState({
						rooms: that.state.rooms.concat({ room: 'Room ' + (i + 1).toString(), full: true, hover: 'none', text: 'Full', roomId: receivedRooms[i]._id })
					});
				}
			}
		})
	}

	clearRoomList(){
		this.setState({
			rooms: [],
		});
	}

	getPlayersList(){
		var that = this;
		console.log("Getting list of players")
		var receivedPlayers;
		const requestOptions = {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		};
		var stat = 0;
		fetch('https://localhost:9000/users/list', requestOptions)
		.then(function(response) { 
			stat = response.status;
			console.log(stat)
			if(stat == 200){
				receivedPlayers = response.json();
			}
			return receivedPlayers;
		}).then(function(receivedPlayers){
			// console.log(receivedPlayers)
			for(var i = 0; i < receivedPlayers.length; i++){
				for(var j = 0; j < receivedPlayers.length - 1; j++){
					if(receivedPlayers[j].stats.games_played < receivedPlayers[j + 1].stats.games_played){
						var temp = receivedPlayers[j]
						receivedPlayers[j] = receivedPlayers[j + 1];
						receivedPlayers[j + 1] = temp;
					}
				}
			}
			for(var i = 0; i < receivedPlayers.length; i++){
				that.setState({
					playersList: that.state.playersList.concat({ player: receivedPlayers[i].user_name, score: receivedPlayers[i].stats.games_played })
				});
			}
		})
	}

	clearPlayersList(){
		this.setState({
			playersList: [],
		});
	}

	createRoom(){
		console.log("Creating room")
		this.updateRooms();
		this.setState({
			div2Shown: !this.state.div2Shown,
		});
	}

	confirmRoomCreation(){
		var that = this;
		console.log("Room created")
		// var createButton = document.getElementsByClassName('createButton')[0];
		// var joinButton = document.getElementsByClassName('joinRoomButton')[0];

		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ "player_1_id": this.state.user_id })
		};
		var stat = 0;
		var roomDetails;
		fetch('https://localhost:9000/rooms/create', requestOptions)
		.then(function(response){
			stat = response.status;
			if(stat == 201){
				roomDetails = response.json();
				// createButton.disabled = 'true';
				// createButton.style.pointerEvents = 'none'
				// joinButton.hidden = 'false';
			}
			return roomDetails;
		})
		.then(function(roomDetails){
			that.setState({
				div2Shown: !that.state.div2Shown,
				room_id: roomDetails._id,
				createButtonDisabled: true,
				joinRoomHidden: 'visible',
			});
		})
		.then(function(){
			that.updateRooms();
		})
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

	startGame(){
		var that = this;
		console.log('Starting Game')

		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ "room_id": that.state.room_id, "player_1_id": that.state.user_id })
		};
		var stat = 0;
		fetch('https://localhost:9000/rooms/start-game', requestOptions)
		.then(function(response){
			stat = response.status;
			if(stat == 201){
				var data = response.json();
				that.setState({
					gameShown: !that.state.gameShown,
					game_id: data._id,
				})
				console.log(that.state.game_id)
			}
		})
	}

	async fetchGameStart(){
		await new Promise(r => setTimeout(r, 10000));
		var that = this;

		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ "room_id": that.state.room_id, "player_2_id": that.state.user_id })
		};
		var stat = 0;
		fetch('https://localhost:9000/rooms/fetch-game', requestOptions)
		.then(function(response){
			stat = response.status;
			if(stat == 200){
				var data = response.json();
				that.setState({
					gameShown: !that.state.gameShown,
					game_id: data._id,
				})
				console.log(that.state.game_id)
			}
		})
	}

	leaveRoom(){
		console.log("Leaving")
		var that = this;

		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ "room_id": that.state.room_id, "player_2_id": that.state.user_id })
		};
		var stat = 0;
		fetch('https://localhost:9000/rooms/leave', requestOptions)
		.then(function(response){
			stat = response.status;
			if(stat == 200){
				that.setState({
					createButtonDisabled: false,
					room_id: 0,
					joinRoomHidden: 'hidden',
					room_id: 0,
				})
			}
		})
		.then(function(){
			that.updateRooms();
		})
	}

	deleteYourRoom(){
		var that = this;
		console.log('Delete Your Room');

		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ "room_id": that.state.room_id, "owner_id": that.state.user_id })
		};
		var stat = 0;
		fetch('https://localhost:9000/rooms/delete', requestOptions)
		.then(function(response){
			stat = response.status;
			if(stat == 200){
				that.setState({
					createButtonDisabled: false,
					room_id: 0,
					joinRoomHidden: 'hidden',
					deleteRoomHidden: 'hidden',
				})
			}
		})
		.then(function(){
			that.updateRooms();
		})
	}


	handleUsernameChange(e) {
		this.setState({username: e.target.value});
	}

	handlePasswordChange(e) {
		this.setState({password: e.target.value});
	}

	showGiveUpPopup(){
		console.log("Usuwanie konta")
		document.getElementsByClassName('modalGiveUp')[0].hidden = false;
	}

	handleClickGiveUpPopup() {
		document.getElementsByClassName('modalGiveUp')[0].hidden = true;
	};

	handleSubmitGiveUpPopup(event) {
		
	}

	showDrawPopup(){
		console.log("Usuwanie konta")
		document.getElementsByClassName('modalDraw')[0].hidden = false;
	}

	handleClickDrawPopup() {
		document.getElementsByClassName('modalDraw')[0].hidden = true;
	};

	handleSubmitDrawPopup(event) {
		
	}

	showDeletePopup(){
		console.log("Usuwanie konta")
		document.getElementsByClassName('modalDelete')[0].hidden = false;
	}

	handleClickDeletePopup() {
		document.getElementsByClassName('modalDelete')[0].hidden = true;
	};

	handleSubmitDeletePopup(event) {
		var that = this;
		console.log(this.state.inputValue)
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
				console.log(stat)
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
			})
		}
	}

	handleChangeDeletePopup(event) {
		this.setState({ inputValue: event.target.value });
	}

	joinGame(event){
		var that = this;
		var room = event.target.id;
		var roomIdToJoin = 0;
		console.log(room)
		for(var i = 0; i < that.state.rooms.length; i++){
			console.log(that.state.rooms[i].room)
			if(room == that.state.rooms[i].room){
				roomIdToJoin = that.state.rooms[i].roomId;
			}
		}

		var stat = 0;
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ room_id: roomIdToJoin, player_2_id: that.state.user_id})
		};

		fetch('https://localhost:9000/rooms/join', requestOptions)
		.then(function(response) { 
			stat = response.status;
			console.log(stat)
			if(stat == 201){
				that.setState({ 
					createButtonDisabled: true,
					room_id: roomIdToJoin,
				});
			}
		})
		.then(function(){
			that.updateRooms();
		})

		that.fetchGameStart();
	}

	checkCoords(shipName, coordsList, coordsPass){
		var coords = { x: parseInt(coordsPass.x), y: parseInt(coordsPass.y) }
		var coordsTaken = false;
		for(var i = 0; i < this.state.dreadnoughtCoordsList.length; i++){
			if(coords.x == this.state.dreadnoughtCoordsList[i].X && coords.y == this.state.dreadnoughtCoordsList[i].Y){
				coordsTaken = true;
			}
		}
		for(var i = 0; i < this.state.cruiserCoordsList.length; i++){
			if(coords.x == this.state.cruiserCoordsList[i].X && coords.y == this.state.cruiserCoordsList[i].Y){
				coordsTaken = true;
			}
		}
		for(var i = 0; i < this.state.submarineCoordsList.length; i++){
			if(coords.x == this.state.submarineCoordsList[i].X && coords.y == this.state.submarineCoordsList[i].Y){
				coordsTaken = true;
			}
		}
		for(var i = 0; i < this.state.destroyerCoordsList.length; i++){
			if(coords.x == this.state.destroyerCoordsList[i].X && coords.y == this.state.destroyerCoordsList[i].Y){
				coordsTaken = true;
			}
		}
		for(var i = 0; i < this.state.reconCoordsList.length; i++){
			if(coords.x == this.state.reconCoordsList[i].X && coords.y == this.state.reconCoordsList[i].Y){
				coordsTaken = true;
			}
		}
		var neighbourCoordsTaken = false;
		if(shipName == 'dreadnought'){
			for(var i = 0; i < this.state.cruiserCoordsList.length; i++){
				if((coords.x == this.state.cruiserCoordsList[i].X + 1 && coords.y == this.state.cruiserCoordsList[i].Y) || (coords.x == this.state.cruiserCoordsList[i].X - 1 && coords.y == this.state.cruiserCoordsList[i].Y) ||
				(coords.x == this.state.cruiserCoordsList[i].X && coords.y == this.state.cruiserCoordsList[i].Y + 1) || (coords.x == this.state.cruiserCoordsList[i].X && coords.y == this.state.cruiserCoordsList[i].Y - 1) ||
				(coords.x == this.state.cruiserCoordsList[i].X + 1 && coords.y == this.state.cruiserCoordsList[i].Y + 1) || (coords.x == this.state.cruiserCoordsList[i].X - 1 && coords.y == this.state.cruiserCoordsList[i].Y - 1) ||
				(coords.x == this.state.cruiserCoordsList[i].X - 1 && coords.y == this.state.cruiserCoordsList[i].Y + 1) || (coords.x == this.state.cruiserCoordsList[i].X + 1 && coords.y == this.state.cruiserCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
			for(var i = 0; i < this.state.submarineCoordsList.length; i++){
				if((coords.x == this.state.submarineCoordsList[i].X + 1 && coords.y == this.state.submarineCoordsList[i].Y) || (coords.x == this.state.submarineCoordsList[i].X - 1 && coords.y == this.state.submarineCoordsList[i].Y) ||
				(coords.x == this.state.submarineCoordsList[i].X && coords.y == this.state.submarineCoordsList[i].Y + 1) || (coords.x == this.state.submarineCoordsList[i].X && coords.y == this.state.submarineCoordsList[i].Y - 1) ||
				(coords.x == this.state.submarineCoordsList[i].X + 1 && coords.y == this.state.submarineCoordsList[i].Y + 1) || (coords.x == this.state.submarineCoordsList[i].X - 1 && coords.y == this.state.submarineCoordsList[i].Y - 1) ||
				(coords.x == this.state.submarineCoordsList[i].X - 1 && coords.y == this.state.submarineCoordsList[i].Y + 1) || (coords.x == this.state.submarineCoordsList[i].X + 1 && coords.y == this.state.submarineCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
			for(var i = 0; i < this.state.destroyerCoordsList.length; i++){
				if((coords.x == this.state.destroyerCoordsList[i].X + 1 && coords.y == this.state.destroyerCoordsList[i].Y) || (coords.x == this.state.destroyerCoordsList[i].X - 1 && coords.y == this.state.destroyerCoordsList[i].Y) ||
				(coords.x == this.state.destroyerCoordsList[i].X && coords.y == this.state.destroyerCoordsList[i].Y + 1) || (coords.x == this.state.destroyerCoordsList[i].X && coords.y == this.state.destroyerCoordsList[i].Y - 1) ||
				(coords.x == this.state.destroyerCoordsList[i].X + 1 && coords.y == this.state.destroyerCoordsList[i].Y + 1) || (coords.x == this.state.destroyerCoordsList[i].X - 1 && coords.y == this.state.destroyerCoordsList[i].Y - 1) ||
				(coords.x == this.state.destroyerCoordsList[i].X - 1 && coords.y == this.state.destroyerCoordsList[i].Y + 1) || (coords.x == this.state.destroyerCoordsList[i].X + 1 && coords.y == this.state.destroyerCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
			for(var i = 0; i < this.state.reconCoordsList.length; i++){
				if((coords.x == this.state.reconCoordsList[i].X + 1 && coords.y == this.state.reconCoordsList[i].Y) || (coords.x == this.state.reconCoordsList[i].X - 1 && coords.y == this.state.reconCoordsList[i].Y) ||
				(coords.x == this.state.reconCoordsList[i].X && coords.y == this.state.reconCoordsList[i].Y + 1) || (coords.x == this.state.reconCoordsList[i].X && coords.y == this.state.reconCoordsList[i].Y - 1) ||
				(coords.x == this.state.reconCoordsList[i].X + 1 && coords.y == this.state.reconCoordsList[i].Y + 1) || (coords.x == this.state.reconCoordsList[i].X - 1 && coords.y == this.state.reconCoordsList[i].Y - 1) ||
				(coords.x == this.state.reconCoordsList[i].X - 1 && coords.y == this.state.reconCoordsList[i].Y + 1) || (coords.x == this.state.reconCoordsList[i].X + 1 && coords.y == this.state.reconCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
		}
		if(shipName == 'cruiser'){
			for(var i = 0; i < this.state.dreadnoughtCoordsList.length; i++){
				if((coords.x == this.state.dreadnoughtCoordsList[i].X + 1 && coords.y == this.state.dreadnoughtCoordsList[i].Y) || (coords.x == this.state.dreadnoughtCoordsList[i].X - 1 && coords.y == this.state.dreadnoughtCoordsList[i].Y) ||
				(coords.x == this.state.dreadnoughtCoordsList[i].X && coords.y == this.state.dreadnoughtCoordsList[i].Y + 1) || (coords.x == this.state.dreadnoughtCoordsList[i].X && coords.y == this.state.dreadnoughtCoordsList[i].Y - 1) ||
				(coords.x == this.state.dreadnoughtCoordsList[i].X + 1 && coords.y == this.state.dreadnoughtCoordsList[i].Y + 1) || (coords.x == this.state.dreadnoughtCoordsList[i].X - 1 && coords.y == this.state.dreadnoughtCoordsList[i].Y - 1) ||
				(coords.x == this.state.dreadnoughtCoordsList[i].X - 1 && coords.y == this.state.dreadnoughtCoordsList[i].Y + 1) || (coords.x == this.state.dreadnoughtCoordsList[i].X + 1 && coords.y == this.state.dreadnoughtCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
			for(var i = 0; i < this.state.submarineCoordsList.length; i++){
				if((coords.x == this.state.submarineCoordsList[i].X + 1 && coords.y == this.state.submarineCoordsList[i].Y) || (coords.x == this.state.submarineCoordsList[i].X - 1 && coords.y == this.state.submarineCoordsList[i].Y) ||
				(coords.x == this.state.submarineCoordsList[i].X && coords.y == this.state.submarineCoordsList[i].Y + 1) || (coords.x == this.state.submarineCoordsList[i].X && coords.y == this.state.submarineCoordsList[i].Y - 1) ||
				(coords.x == this.state.submarineCoordsList[i].X + 1 && coords.y == this.state.submarineCoordsList[i].Y + 1) || (coords.x == this.state.submarineCoordsList[i].X - 1 && coords.y == this.state.submarineCoordsList[i].Y - 1) ||
				(coords.x == this.state.submarineCoordsList[i].X - 1 && coords.y == this.state.submarineCoordsList[i].Y + 1) || (coords.x == this.state.submarineCoordsList[i].X + 1 && coords.y == this.state.submarineCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
			for(var i = 0; i < this.state.destroyerCoordsList.length; i++){
				if((coords.x == this.state.destroyerCoordsList[i].X + 1 && coords.y == this.state.destroyerCoordsList[i].Y) || (coords.x == this.state.destroyerCoordsList[i].X - 1 && coords.y == this.state.destroyerCoordsList[i].Y) ||
				(coords.x == this.state.destroyerCoordsList[i].X && coords.y == this.state.destroyerCoordsList[i].Y + 1) || (coords.x == this.state.destroyerCoordsList[i].X && coords.y == this.state.destroyerCoordsList[i].Y - 1) ||
				(coords.x == this.state.destroyerCoordsList[i].X + 1 && coords.y == this.state.destroyerCoordsList[i].Y + 1) || (coords.x == this.state.destroyerCoordsList[i].X - 1 && coords.y == this.state.destroyerCoordsList[i].Y - 1) ||
				(coords.x == this.state.destroyerCoordsList[i].X - 1 && coords.y == this.state.destroyerCoordsList[i].Y + 1) || (coords.x == this.state.destroyerCoordsList[i].X + 1 && coords.y == this.state.destroyerCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
			for(var i = 0; i < this.state.reconCoordsList.length; i++){
				if((coords.x == this.state.reconCoordsList[i].X + 1 && coords.y == this.state.reconCoordsList[i].Y) || (coords.x == this.state.reconCoordsList[i].X - 1 && coords.y == this.state.reconCoordsList[i].Y) ||
				(coords.x == this.state.reconCoordsList[i].X && coords.y == this.state.reconCoordsList[i].Y + 1) || (coords.x == this.state.reconCoordsList[i].X && coords.y == this.state.reconCoordsList[i].Y - 1) ||
				(coords.x == this.state.reconCoordsList[i].X + 1 && coords.y == this.state.reconCoordsList[i].Y + 1) || (coords.x == this.state.reconCoordsList[i].X - 1 && coords.y == this.state.reconCoordsList[i].Y - 1) ||
				(coords.x == this.state.reconCoordsList[i].X - 1 && coords.y == this.state.reconCoordsList[i].Y + 1) || (coords.x == this.state.reconCoordsList[i].X + 1 && coords.y == this.state.reconCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
		}
		if(shipName == 'submarine'){
			for(var i = 0; i < this.state.dreadnoughtCoordsList.length; i++){
				if((coords.x == this.state.dreadnoughtCoordsList[i].X + 1 && coords.y == this.state.dreadnoughtCoordsList[i].Y) || (coords.x == this.state.dreadnoughtCoordsList[i].X - 1 && coords.y == this.state.dreadnoughtCoordsList[i].Y) ||
				(coords.x == this.state.dreadnoughtCoordsList[i].X && coords.y == this.state.dreadnoughtCoordsList[i].Y + 1) || (coords.x == this.state.dreadnoughtCoordsList[i].X && coords.y == this.state.dreadnoughtCoordsList[i].Y - 1) ||
				(coords.x == this.state.dreadnoughtCoordsList[i].X + 1 && coords.y == this.state.dreadnoughtCoordsList[i].Y + 1) || (coords.x == this.state.dreadnoughtCoordsList[i].X - 1 && coords.y == this.state.dreadnoughtCoordsList[i].Y - 1) ||
				(coords.x == this.state.dreadnoughtCoordsList[i].X - 1 && coords.y == this.state.dreadnoughtCoordsList[i].Y + 1) || (coords.x == this.state.dreadnoughtCoordsList[i].X + 1 && coords.y == this.state.dreadnoughtCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
			for(var i = 0; i < this.state.cruiserCoordsList.length; i++){
				if((coords.x == this.state.cruiserCoordsList[i].X + 1 && coords.y == this.state.cruiserCoordsList[i].Y) || (coords.x == this.state.cruiserCoordsList[i].X - 1 && coords.y == this.state.cruiserCoordsList[i].Y) ||
				(coords.x == this.state.cruiserCoordsList[i].X && coords.y == this.state.cruiserCoordsList[i].Y + 1) || (coords.x == this.state.cruiserCoordsList[i].X && coords.y == this.state.cruiserCoordsList[i].Y - 1) ||
				(coords.x == this.state.cruiserCoordsList[i].X + 1 && coords.y == this.state.cruiserCoordsList[i].Y + 1) || (coords.x == this.state.cruiserCoordsList[i].X - 1 && coords.y == this.state.cruiserCoordsList[i].Y - 1) ||
				(coords.x == this.state.cruiserCoordsList[i].X - 1 && coords.y == this.state.cruiserCoordsList[i].Y + 1) || (coords.x == this.state.cruiserCoordsList[i].X + 1 && coords.y == this.state.cruiserCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
			for(var i = 0; i < this.state.destroyerCoordsList.length; i++){
				if((coords.x == this.state.destroyerCoordsList[i].X + 1 && coords.y == this.state.destroyerCoordsList[i].Y) || (coords.x == this.state.destroyerCoordsList[i].X - 1 && coords.y == this.state.destroyerCoordsList[i].Y) ||
				(coords.x == this.state.destroyerCoordsList[i].X && coords.y == this.state.destroyerCoordsList[i].Y + 1) || (coords.x == this.state.destroyerCoordsList[i].X && coords.y == this.state.destroyerCoordsList[i].Y - 1) ||
				(coords.x == this.state.destroyerCoordsList[i].X + 1 && coords.y == this.state.destroyerCoordsList[i].Y + 1) || (coords.x == this.state.destroyerCoordsList[i].X - 1 && coords.y == this.state.destroyerCoordsList[i].Y - 1) ||
				(coords.x == this.state.destroyerCoordsList[i].X - 1 && coords.y == this.state.destroyerCoordsList[i].Y + 1) || (coords.x == this.state.destroyerCoordsList[i].X + 1 && coords.y == this.state.destroyerCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
			for(var i = 0; i < this.state.reconCoordsList.length; i++){
				if((coords.x == this.state.reconCoordsList[i].X + 1 && coords.y == this.state.reconCoordsList[i].Y) || (coords.x == this.state.reconCoordsList[i].X - 1 && coords.y == this.state.reconCoordsList[i].Y) ||
				(coords.x == this.state.reconCoordsList[i].X && coords.y == this.state.reconCoordsList[i].Y + 1) || (coords.x == this.state.reconCoordsList[i].X && coords.y == this.state.reconCoordsList[i].Y - 1) ||
				(coords.x == this.state.reconCoordsList[i].X + 1 && coords.y == this.state.reconCoordsList[i].Y + 1) || (coords.x == this.state.reconCoordsList[i].X - 1 && coords.y == this.state.reconCoordsList[i].Y - 1) ||
				(coords.x == this.state.reconCoordsList[i].X - 1 && coords.y == this.state.reconCoordsList[i].Y + 1) || (coords.x == this.state.reconCoordsList[i].X + 1 && coords.y == this.state.reconCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
		}
		if(shipName == 'destroyer'){
			for(var i = 0; i < this.state.dreadnoughtCoordsList.length; i++){
				if((coords.x == this.state.dreadnoughtCoordsList[i].X + 1 && coords.y == this.state.dreadnoughtCoordsList[i].Y) || (coords.x == this.state.dreadnoughtCoordsList[i].X - 1 && coords.y == this.state.dreadnoughtCoordsList[i].Y) ||
				(coords.x == this.state.dreadnoughtCoordsList[i].X && coords.y == this.state.dreadnoughtCoordsList[i].Y + 1) || (coords.x == this.state.dreadnoughtCoordsList[i].X && coords.y == this.state.dreadnoughtCoordsList[i].Y - 1) ||
				(coords.x == this.state.dreadnoughtCoordsList[i].X + 1 && coords.y == this.state.dreadnoughtCoordsList[i].Y + 1) || (coords.x == this.state.dreadnoughtCoordsList[i].X - 1 && coords.y == this.state.dreadnoughtCoordsList[i].Y - 1) ||
				(coords.x == this.state.dreadnoughtCoordsList[i].X - 1 && coords.y == this.state.dreadnoughtCoordsList[i].Y + 1) || (coords.x == this.state.dreadnoughtCoordsList[i].X + 1 && coords.y == this.state.dreadnoughtCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
			for(var i = 0; i < this.state.cruiserCoordsList.length; i++){
				if((coords.x == this.state.cruiserCoordsList[i].X + 1 && coords.y == this.state.cruiserCoordsList[i].Y) || (coords.x == this.state.cruiserCoordsList[i].X - 1 && coords.y == this.state.cruiserCoordsList[i].Y) ||
				(coords.x == this.state.cruiserCoordsList[i].X && coords.y == this.state.cruiserCoordsList[i].Y + 1) || (coords.x == this.state.cruiserCoordsList[i].X && coords.y == this.state.cruiserCoordsList[i].Y - 1) ||
				(coords.x == this.state.cruiserCoordsList[i].X + 1 && coords.y == this.state.cruiserCoordsList[i].Y + 1) || (coords.x == this.state.cruiserCoordsList[i].X - 1 && coords.y == this.state.cruiserCoordsList[i].Y - 1) ||
				(coords.x == this.state.cruiserCoordsList[i].X - 1 && coords.y == this.state.cruiserCoordsList[i].Y + 1) || (coords.x == this.state.cruiserCoordsList[i].X + 1 && coords.y == this.state.cruiserCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
			for(var i = 0; i < this.state.submarineCoordsList.length; i++){
				if((coords.x == this.state.submarineCoordsList[i].X + 1 && coords.y == this.state.submarineCoordsList[i].Y) || (coords.x == this.state.submarineCoordsList[i].X - 1 && coords.y == this.state.submarineCoordsList[i].Y) ||
				(coords.x == this.state.submarineCoordsList[i].X && coords.y == this.state.submarineCoordsList[i].Y + 1) || (coords.x == this.state.submarineCoordsList[i].X && coords.y == this.state.submarineCoordsList[i].Y - 1) ||
				(coords.x == this.state.submarineCoordsList[i].X + 1 && coords.y == this.state.submarineCoordsList[i].Y + 1) || (coords.x == this.state.submarineCoordsList[i].X - 1 && coords.y == this.state.submarineCoordsList[i].Y - 1) ||
				(coords.x == this.state.submarineCoordsList[i].X - 1 && coords.y == this.state.submarineCoordsList[i].Y + 1) || (coords.x == this.state.submarineCoordsList[i].X + 1 && coords.y == this.state.submarineCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
			for(var i = 0; i < this.state.reconCoordsList.length; i++){
				if((coords.x == this.state.reconCoordsList[i].X + 1 && coords.y == this.state.reconCoordsList[i].Y) || (coords.x == this.state.reconCoordsList[i].X - 1 && coords.y == this.state.reconCoordsList[i].Y) ||
				(coords.x == this.state.reconCoordsList[i].X && coords.y == this.state.reconCoordsList[i].Y + 1) || (coords.x == this.state.reconCoordsList[i].X && coords.y == this.state.reconCoordsList[i].Y - 1) ||
				(coords.x == this.state.reconCoordsList[i].X + 1 && coords.y == this.state.reconCoordsList[i].Y + 1) || (coords.x == this.state.reconCoordsList[i].X - 1 && coords.y == this.state.reconCoordsList[i].Y - 1) ||
				(coords.x == this.state.reconCoordsList[i].X - 1 && coords.y == this.state.reconCoordsList[i].Y + 1) || (coords.x == this.state.reconCoordsList[i].X + 1 && coords.y == this.state.reconCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
		}
		if(shipName == 'recon'){
			for(var i = 0; i < this.state.dreadnoughtCoordsList.length; i++){
				if((coords.x == this.state.dreadnoughtCoordsList[i].X + 1 && coords.y == this.state.dreadnoughtCoordsList[i].Y) || (coords.x == this.state.dreadnoughtCoordsList[i].X - 1 && coords.y == this.state.dreadnoughtCoordsList[i].Y) ||
				(coords.x == this.state.dreadnoughtCoordsList[i].X && coords.y == this.state.dreadnoughtCoordsList[i].Y + 1) || (coords.x == this.state.dreadnoughtCoordsList[i].X && coords.y == this.state.dreadnoughtCoordsList[i].Y - 1) ||
				(coords.x == this.state.dreadnoughtCoordsList[i].X + 1 && coords.y == this.state.dreadnoughtCoordsList[i].Y + 1) || (coords.x == this.state.dreadnoughtCoordsList[i].X - 1 && coords.y == this.state.dreadnoughtCoordsList[i].Y - 1) ||
				(coords.x == this.state.dreadnoughtCoordsList[i].X - 1 && coords.y == this.state.dreadnoughtCoordsList[i].Y + 1) || (coords.x == this.state.dreadnoughtCoordsList[i].X + 1 && coords.y == this.state.dreadnoughtCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
			for(var i = 0; i < this.state.cruiserCoordsList.length; i++){
				if((coords.x == this.state.cruiserCoordsList[i].X + 1 && coords.y == this.state.cruiserCoordsList[i].Y) || (coords.x == this.state.cruiserCoordsList[i].X - 1 && coords.y == this.state.cruiserCoordsList[i].Y) ||
				(coords.x == this.state.cruiserCoordsList[i].X && coords.y == this.state.cruiserCoordsList[i].Y + 1) || (coords.x == this.state.cruiserCoordsList[i].X && coords.y == this.state.cruiserCoordsList[i].Y - 1) ||
				(coords.x == this.state.cruiserCoordsList[i].X + 1 && coords.y == this.state.cruiserCoordsList[i].Y + 1) || (coords.x == this.state.cruiserCoordsList[i].X - 1 && coords.y == this.state.cruiserCoordsList[i].Y - 1) ||
				(coords.x == this.state.cruiserCoordsList[i].X - 1 && coords.y == this.state.cruiserCoordsList[i].Y + 1) || (coords.x == this.state.cruiserCoordsList[i].X + 1 && coords.y == this.state.cruiserCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
			for(var i = 0; i < this.state.submarineCoordsList.length; i++){
				if((coords.x == this.state.submarineCoordsList[i].X + 1 && coords.y == this.state.submarineCoordsList[i].Y) || (coords.x == this.state.submarineCoordsList[i].X - 1 && coords.y == this.state.submarineCoordsList[i].Y) ||
				(coords.x == this.state.submarineCoordsList[i].X && coords.y == this.state.submarineCoordsList[i].Y + 1) || (coords.x == this.state.submarineCoordsList[i].X && coords.y == this.state.submarineCoordsList[i].Y - 1) ||
				(coords.x == this.state.submarineCoordsList[i].X + 1 && coords.y == this.state.submarineCoordsList[i].Y + 1) || (coords.x == this.state.submarineCoordsList[i].X - 1 && coords.y == this.state.submarineCoordsList[i].Y - 1) ||
				(coords.x == this.state.submarineCoordsList[i].X - 1 && coords.y == this.state.submarineCoordsList[i].Y + 1) || (coords.x == this.state.submarineCoordsList[i].X + 1 && coords.y == this.state.submarineCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
			for(var i = 0; i < this.state.destroyerCoordsList.length; i++){
				if((coords.x == this.state.destroyerCoordsList[i].X + 1 && coords.y == this.state.destroyerCoordsList[i].Y) || (coords.x == this.state.destroyerCoordsList[i].X - 1 && coords.y == this.state.destroyerCoordsList[i].Y) ||
				(coords.x == this.state.destroyerCoordsList[i].X && coords.y == this.state.destroyerCoordsList[i].Y + 1) || (coords.x == this.state.destroyerCoordsList[i].X && coords.y == this.state.destroyerCoordsList[i].Y - 1) ||
				(coords.x == this.state.destroyerCoordsList[i].X + 1 && coords.y == this.state.destroyerCoordsList[i].Y + 1) || (coords.x == this.state.destroyerCoordsList[i].X - 1 && coords.y == this.state.destroyerCoordsList[i].Y - 1) ||
				(coords.x == this.state.destroyerCoordsList[i].X - 1 && coords.y == this.state.destroyerCoordsList[i].Y + 1) || (coords.x == this.state.destroyerCoordsList[i].X + 1 && coords.y == this.state.destroyerCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
		}
		console.log('Taken: ' + coordsTaken);
		console.log('Neighbour: ' + neighbourCoordsTaken);
		if(coordsTaken == true || neighbourCoordsTaken == true){
			return false;
		}
		else if(coordsList.length == 0){
			return true;
		}
		else if(coordsList.length == 1){
			if(((coordsList[0].X + 1 == coords.x || coordsList[0].X - 1 == coords.x) && coordsList[0].Y == coords.y) || ((coordsList[0].Y + 1 == coords.y || coordsList[0].Y - 1 == coords.y) && coordsList[0].X == coords.x) &&
			(shipName == 'dreadnought' || shipName == 'cruiser' || shipName == 'submarine' || shipName == 'destroyer' || shipName == 'recon')){
				return true;
			}
			else{
				return false;
			}
		}
		else if(coordsList.length == 2){
			if(((coordsList[0].X + 1 == coords.x || coordsList[0].X - 1 == coords.x) && coordsList[0].Y == coords.y) || ((coordsList[0].Y + 1 == coords.y || coordsList[0].Y - 1 == coords.y) && coordsList[0].X == coords.x) ||
			((coordsList[1].X + 1 == coords.x || coordsList[1].X - 1 == coords.x) && coordsList[1].Y == coords.y) || ((coordsList[1].Y + 1 == coords.y || coordsList[1].Y - 1 == coords.y) && coordsList[1].X == coords.x) &&
			(shipName == 'dreadnought' || shipName == 'cruiser' || shipName == 'submarine' || shipName == 'destroyer')){
				if((coords.x == coordsList[1].X && coordsList[1].X == coordsList[0].X) || (coords.y == coordsList[1].Y && coordsList[1].Y == coordsList[0].Y)){
					return true;
				}
				else{
					return false;
				}
			}
			else{
				return false;
			}
		}
		else if(coordsList.length == 3){
			if(((coordsList[0].X + 1 == coords.x || coordsList[0].X - 1 == coords.x) && coordsList[0].Y == coords.y) || ((coordsList[0].Y + 1 == coords.y || coordsList[0].Y - 1 == coords.y) && coordsList[0].X == coords.x) ||
			((coordsList[1].X + 1 == coords.x || coordsList[1].X - 1 == coords.x) && coordsList[1].Y == coords.y) || ((coordsList[1].Y + 1 == coords.y || coordsList[1].Y - 1 == coords.y) && coordsList[1].X == coords.x) ||
			((coordsList[2].X + 1 == coords.x || coordsList[2].X - 1 == coords.x) && coordsList[2].Y == coords.y) || ((coordsList[2].Y + 1 == coords.y || coordsList[2].Y - 1 == coords.y) && coordsList[2].X == coords.x) &&
			(shipName == 'dreadnought' || shipName == 'cruiser')){
				if((coords.x == coordsList[2].X && coordsList[2].X == coordsList[1].X && coordsList[1].X == coordsList[0].X) || (coords.y == coordsList[2].Y && coordsList[2].Y == coordsList[1].Y && coordsList[1].Y == coordsList[0].Y)){
					return true;
				}
				else{
					return false;
				}
			}
			else{
				return false;
			}
		}
		else if(coordsList.length == 4){
			if(((coordsList[0].X + 1 == coords.x || coordsList[0].X - 1 == coords.x) && coordsList[0].Y == coords.y) || ((coordsList[0].Y + 1 == coords.y || coordsList[0].Y - 1 == coords.y) && coordsList[0].X == coords.x) ||
			((coordsList[1].X + 1 == coords.x || coordsList[1].X - 1 == coords.x) && coordsList[1].Y == coords.y) || ((coordsList[1].Y + 1 == coords.y || coordsList[1].Y - 1 == coords.y) && coordsList[1].X == coords.x) ||
			((coordsList[2].X + 1 == coords.x || coordsList[2].X - 1 == coords.x) && coordsList[2].Y == coords.y) || ((coordsList[2].Y + 1 == coords.y || coordsList[2].Y - 1 == coords.y) && coordsList[2].X == coords.x) ||
			((coordsList[3].X + 1 == coords.x || coordsList[3].X - 1 == coords.x) && coordsList[3].Y == coords.y) || ((coordsList[3].Y + 1 == coords.y || coordsList[3].Y - 1 == coords.y) && coordsList[3].X == coords.x) &&
			(shipName == 'dreadnought')){
				if((coords.x == coordsList[3].X && coordsList[3].X == coordsList[2].X && coordsList[2].X == coordsList[1].X && coordsList[1].X == coordsList[0].X) || (coords.y == coordsList[3].Y && coordsList[3].Y == coordsList[2].Y && coordsList[2].Y == coordsList[1].Y && coordsList[1].Y == coordsList[0].Y)){
					return true;
				}
				else{
					return false;
				}
			}
			else{
				return false;
			}
		}
	}

	handlePlayerBoardClick(event){
		event.preventDefault()
		console.log(event.target.id)
		if(this.state.availableFields > 0){
			if(this.state.dreadnoughtEnabled == true){
				if(this.checkCoords('dreadnought', this.state.dreadnoughtCoordsList, {x: event.target.id[2], y: event.target.id[4]})){
					this.state.dreadnoughtCoordsList.push({X: parseInt(event.target.id[2]), Y: parseInt(event.target.id[4])})
					event.target.style.backgroundColor = 'black'
					this.setState({
						availableFields: this.state.availableFields - 1,
					})
				}
			}
			else if(this.state.cruiserEnabled == true){
				if(this.checkCoords('cruiser', this.state.cruiserCoordsList, {x: event.target.id[2], y: event.target.id[4]})){
					this.state.cruiserCoordsList.push({X: parseInt(event.target.id[2]), Y: parseInt(event.target.id[4])})
					event.target.style.backgroundColor = 'black'
					this.setState({
						availableFields: this.state.availableFields - 1,
					})
				}
			}
			else if(this.state.submarineEnabled == true){
				if(this.checkCoords('submarine', this.state.submarineCoordsList, {x: event.target.id[2], y: event.target.id[4]})){
					this.state.submarineCoordsList.push({X: parseInt(event.target.id[2]), Y: parseInt(event.target.id[4])})
					event.target.style.backgroundColor = 'black'
					this.setState({
						availableFields: this.state.availableFields - 1,
					})
				}
			}
			else if(this.state.destroyerEnabled == true){
				if(this.checkCoords('destroyer', this.state.destroyerCoordsList, {x: event.target.id[2], y: event.target.id[4]})){
					this.state.destroyerCoordsList.push({X: parseInt(event.target.id[2]), Y: parseInt(event.target.id[4])})
					event.target.style.backgroundColor = 'black'
					this.setState({
						availableFields: this.state.availableFields - 1,
					})
				}
			}
			else if(this.state.reconEnabled == true){
				if(this.checkCoords('recon', this.state.reconCoordsList, {x: event.target.id[2], y: event.target.id[4]})){
					this.state.reconCoordsList.push({X: parseInt(event.target.id[2]), Y: parseInt(event.target.id[4])})
					event.target.style.backgroundColor = 'black'
					this.setState({
						availableFields: this.state.availableFields - 1,
					})
				}
			}
		}
	}

	handleEnemyBoardClick(event){
		event.preventDefault();
		if(this.state.enemyBoardButtons == false){
			event.target.style.backgroundColor = 'red'
		}
	}

	prepareBoardToSend(){
		var that = this;
		var board = [];
		for(var i = 0; i < 10; i++){
			var temp = [];
			for(var j = 0; j < 10; j++){
				temp.push(0)
			}
			board.push(temp)
		}
		for(var i = 0; i < that.state.dreadnoughtCoordsList.length; i++){
			board[that.state.dreadnoughtCoordsList[i].X][that.state.dreadnoughtCoordsList[i].Y] = 10;
		}
		for(var i = 0; i < that.state.cruiserCoordsList.length; i++){
			board[that.state.cruiserCoordsList[i].X][that.state.cruiserCoordsList[i].Y] = 20;
		}
		for(var i = 0; i < that.state.submarineCoordsList.length; i++){
			board[that.state.submarineCoordsList[i].X][that.state.submarineCoordsList[i].Y] = 30;
		}
		for(var i = 0; i < that.state.destroyerCoordsList.length; i++){
			board[that.state.destroyerCoordsList[i].X][that.state.destroyerCoordsList[i].Y] = 40;
		}
		for(var i = 0; i < that.state.reconCoordsList.length; i++){
			board[that.state.reconCoordsList[i].X][that.state.reconCoordsList[i].Y] = 50;
		}

		return JSON.stringify(board);
	}

	handleConfirmShips(){
		var that = this;
		var boardToSend = that.prepareBoardToSend();
		console.log("Confirm ships")
		var shipsBut = document.getElementsByClassName('ship');
		var allSet = true;
		for(var i = 0; i < shipsBut.length; i++)
		{
			if(shipsBut[i].style.backgroundColor != 'green'){
				allSet = false;
			}
		}
		if(allSet == true){
			that.setState({
				enemyBoardButtons: false,
				shipDeployed: true,
			});
			var confirmBut = document.getElementsByClassName('confirmShips');
			var resetBut = document.getElementsByClassName('resetBoard');
			confirmBut[0].style.backgroundColor = 'green';
			confirmBut[0].disabled = true;
			resetBut[0].style.backgroundColor = 'green';
			resetBut[0].disabled = true;
			var confirmShotBut = document.getElementsByClassName('confirmShot')[0]
			confirmShotBut.style.backgroundColor = 'red'

			console.log(that.state.game_id)
			console.log(that.state.user_id)
			console.log(boardToSend)

			var stat = 0;
			const requestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ game_id: that.state.game_id, player_id: that.state.user_id, board: boardToSend})
			};

			fetch('https://localhost:9000/games/init-map', requestOptions)
			.then(function(response) { 
				stat = response.status;
				console.log(stat)
			});

		}
	}

	handleResetBoard(){
		var shipsButtons = document.getElementsByClassName('ship');
		var boardButtons = document.getElementsByClassName('but');
		for(var i = 0; i < shipsButtons.length; i++){
			shipsButtons[i].style.backgroundColor = 'grey';
			shipsButtons[i].disabled = false;
		}
		for(var j = 0; j < boardButtons.length; j++){
			boardButtons[j].style.backgroundColor = 'blue';
		}
		this.setState({
			dreadnoughtCoordsList: [],
			cruiserCoordsList: [],
			submarineCoordsList: [],
			destroyerCoordsList: [],
			reconCoordsList: [],
			dreadnoughtFields: 5,
			cruiserFields: 4,
			submarineFields: 3,
			submarineFields: 3,
			reconFields: 2,
			dreadnoughtEnabled: true, 
			cruiserEnabled: true,
			submarineEnabled: true,
			destroyerEnabled: true,
			reconEnabled: true,
			playerBoardEnabled: false
		})
	}

	handleConfirmShot(event){
		console.log("Shots fired!")
		event.preventDefault()
		event.target.style.backgroundColor = 'red'
	}

	handleShipButtonClick(event){
		event.preventDefault();
		var buttonEnabled = event.target.id + 'Enabled';
		var shipDeployed = event.target.id + 'Fields'

		this.setState({
			dreadnoughtEnabled: !this.state.dreadnoughtEnabled,
			cruiserEnabled: !this.state.cruiserEnabled,
			submarineEnabled: !this.state.submarineEnabled,
			destroyerEnabled: !this.state.destroyerEnabled,
			reconEnabled: !this.state.reconEnabled,
			playerBoardEnabled: !this.state.playerBoardEnabled,
			availableFields: this.state[shipDeployed],
			[shipDeployed]: 0,
		});
		
		this.setState({
			[buttonEnabled]: true,
		});
		console.log(event.target.id + ' clicked')
		console.log(this.state.availableFields + ' fields')
		
		if(this.state[shipDeployed] == 0){
			event.target.style.backgroundColor = 'green';
		}
		else{
			event.target.style.backgroundColor = 'red';
		}
	}

	render() {
		const listNames = this.state.playersList.map((d) => <li style={{ height: '80px', fontWeight: 'bold' }} key={d.player}>{d.player}</li>);
		const listScore = this.state.playersList.map((d) => <li style={{ height: '80px', fontWeight: 'bold' }} key={d.player}>{d.score}</li>);
		const listRooms = this.state.rooms.map((r) => <li style={{ height: '80px', fontWeight: 'bold' }} key={r.room}>{r.room} <button id={r.room} class='joinButton' disabled={r.full} onClick={this.joinGame} style={{display: 'inline-block', float: 'right', marginRight: '20px', width: '120px', height: '40px', cursor: 'pointer', fontSize: '15px', pointerEvents: [r.hover]}}> {r.text} </button></li>)

		// function yourFunction(){
		// 	// do whatever you like here
		// 	console.log("5 sekund")
		// 	setTimeout(yourFunction, 5000);
		// }
		
		// yourFunction();

		const noHover = {
			pointerEvents: 'none',
		}

		let rowsPlayer = [];
		var playerId;
        for (let y = 0; y < 10; y++) {
            const cellsPlayer = [];
            for (let x = 0; x < 10; x++) {
				playerId = 'PX' + (x).toString() + 'Y' + (y).toString();
                cellsPlayer.push(<th><button class='but' id={playerId} disabled={!this.state.playerBoardEnabled} onClick={this.handlePlayerBoardClick}></button></th>);
            }
            rowsPlayer.push(<tr>{cellsPlayer}</tr>);
        }

		let rowsEnemy = [];
		var enemyId;
        for (let y = 0; y < 10; y++) {
            const cellsEnemy = [];
            for (let x = 0; x < 10; x++) {
				// this.state.enemyBoardButtons
				enemyId = 'PX' + (x + 1).toString() + 'Y' + (y + 1).toString();
                cellsEnemy.push(<th><button class='but' id={enemyId} onClick={this.handleEnemyBoardClick}></button></th>);
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
									<p style={{textAlign: 'center', fontSize: '35px', color:'white', fontWeight: 'bold'}} disabled={this.state.enemyBoardButtons}>Enemy Board</p>
								</div>

								<div className="modalDraw" hidden='true'>
									<div className="modal_content">
									<span className="close" onClick={this.handleClickDrawPopup}>
										&times;
									</span>
										<h2 style={{textAlign: 'center'}}>Are you sure to propose a Draw?</h2>
										<br />
										<div style={{ textAlign: 'center'}}> 
											<button id="submitButton" class="submitButton" onClick={this.handleSubmitDrawPopup} style={{ cursor: 'pointer', height: '30px', width: '400px' }}>Yes</button>
											<button id="submitButton" class="submitButton" onClick={this.handleClickDrawPopup} style={{ cursor: 'pointer', height: '30px', width: '400px' }}>No</button>
										</div>
									</div>
								</div>

								<div className="modalGiveUp" hidden='true'>
									<div className="modal_content">
									<span className="close" onClick={this.handleClickGiveUpPopup}>
										&times;
									</span>
										<h2 style={{textAlign: 'center'}}>Are you sure to Give Up?</h2>
										<div style={{ textAlign: 'center'}}>
										</div>
										<br />
										<div style={{ textAlign: 'center'}}> 
											<button id="submitButton" class="submitButton" onClick={this.handleSubmitGiveUpPopup} style={{ cursor: 'pointer', height: '30px', width: '400px' }}>Yes</button>
											<button id="submitButton" class="submitButton" onClick={this.handleClickGiveUpPopup} style={{ cursor: 'pointer', height: '30px', width: '400px' }}>No</button>
										</div>
									</div>
								</div>

								<div id='gameButtons' class='gameButtons' style={{ display: 'inline-block', verticalAlign: 'top', marginLeft: '50px', marginTop: '20px', }}>
									<br></br>
									<button id='dreadnought' class="ship" disabled={!this.state.dreadnoughtEnabled} onClick={this.handleShipButtonClick}>Dreadnought</button>
									<br></br>
									<button id='cruiser' class="ship" disabled={!this.state.cruiserEnabled} onClick={this.handleShipButtonClick}>Cruiser</button>
									<br></br>
									<button id='submarine' class="ship" disabled={!this.state.submarineEnabled} onClick={this.handleShipButtonClick}>Submarine</button>
									<br></br>
									<button id='destroyer' class="ship" disabled={!this.state.destroyerEnabled} onClick={this.handleShipButtonClick}>Destroyer</button>
									<br></br>
									<button id='recon' class="ship" disabled={!this.state.reconEnabled} onClick={this.handleShipButtonClick}>Recon</button>
									<br></br>
									<br></br>
									<button id='resetBoard' class="resetBoard" onClick={this.handleResetBoard} >Reset Board</button>
									<br></br>
									<br></br>
									<button id='confirmShips' class="confirmShips" onClick={this.handleConfirmShips} >Confirm Setup</button>
									<br></br>
									<br></br>
									<button id='confirmShot' class="confirmShot" onClick={this.handleConfirmShot}>Confirm Shot</button>
									<br></br>
									<br></br>
									<button id='defeat' class="defeat" onClick={this.showGiveUpPopup}>Give up</button>
									<br></br>
									<br></br>
									<button id='draw' class="draw" onClick={this.showDrawPopup}>Propose a draw</button>
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
									<div id="rooms" style={{display: 'inline-block', marginLeft: '50px', backgroundColor: 'grey', width: '600px', height: '750px', overflowX: 'hidden', overflowY: 'auto',}}>
										<h2 id="roomsText" style={{ marginLeft: '10px', minHeight: '40px', color: 'white', display: 'inline-block', }}>Rooms</h2>
										<button class='createButton' id='createButton' disabled={this.state.createButtonDisabled} onClick={this.createRoom} style={createButtonStyle}>Create Room</button>
										<hr></hr>
										<button class='updateButton' id='updateButton' onClick={this.updateRooms} style={{marginLeft: '150px', display: 'block', width: '300px', height: '40px', cursor: 'pointer', fontSize: '15px'}}>Refresh Rooms list</button>
										<hr></hr>
										<div id="roomsEntrys" style={{ marginLeft: '25px', listStyleType: 'none', color: 'white', }}>
											{listRooms}
										</div>
									</div>
									<div id="players" style={{display: 'inline-block', minHeight: '600px', marginLeft: '70px', backgroundColor: 'grey', width: '600px', height: '750px', overflowX: 'hidden', overflowY: 'auto', }}>
										<h2 style={{ marginLeft: '10px', color: 'white', minHeight: '50px',}}>Top Players</h2>
										<hr></hr>
										<button class='updateButton' id='updateButton' onClick={this.updatePlayers} style={{marginLeft: '150px', display: 'block', width: '300px', height: '40px', cursor: 'pointer', fontSize: '15px'}}>Refresh Top Players list</button>
										<hr></hr>
										<div id="playerNames" style={{ marginLeft: '25px', display: 'inline-block', listStyleType: 'none', color: 'white', fontSize: '30px', fontWeight: 'bold' }}>
											Player
											<hr></hr>
											{listNames}
										</div>
										<div id="playerNames" style={{ float: 'right', marginRight: '20px', display: 'inline-block', listStyleType: 'none', color: 'white', fontSize: '30px', fontWeight: 'bold' }}>
											Score
											<hr></hr>
											{listScore}
										</div>
									</div>

									{/* {this.state.deleteAccountSeen ? <DeletePopup toggle={this.togglePop} /> : null} */}
									<div className="modalDelete" hidden='true'>
										<div className="modal_content">
										<span className="close" onClick={this.handleClickDeletePopup}>
											&times;
										</span>
											<h2 style={{textAlign: 'center'}}>Type in your password to delete Account.</h2>
											<div style={{ textAlign: 'center'}}>
												<label>
												Password:
												<input type="text" name="name" onChange={this.handleChangeDeletePopup} placeholder='Password' style={{ marginLeft: '20px', height: '30px', width: '300px'}}/>
												</label>
											</div>
											<br />
											<div style={{ textAlign: 'center'}}> 
												<button id="submitButton" class="submitButton" onClick={this.handleSubmitDeletePopup} style={{ cursor: 'pointer', height: '30px', width: '400px' }}>Confirm</button>
											</div>
										</div>
									</div>

									<div id="statistics" style={{display: 'inline-block', marginTop: '0px', marginRight: '50px', marginLeft: '70px', backgroundColor: 'grey', width: '600px', height: '750px', overflowX: 'hidden', overflowY: 'auto',}}>
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
								<div class='joinRoomButtonDiv'>
									<button style={{ visibility: this.state.deleteRoomHidden, display: 'inline-block', marginLeft: '50px' }} onClick={this.startGame} class='joinRoomButton'>Start Game</button>
									<button style={{ visibility: this.state.joinRoomHidden, display: 'inline-block', marginLeft: '70px' }} onClick={this.leaveRoom} class='joinRoomButton'>Leave Room</button>
									<button style={{ visibility: this.state.deleteRoomHidden, display: 'inline-block', marginLeft: '70px' }} onClick={this.deleteYourRoom} class='joinRoomButton'>Delete Your Room</button>
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
									
									<div style={{ alignItems: 'center' }}>
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

// class Timer extends React.Component {
// 	constructor(props) {
// 	  super(props);
// 	  this.state = {
// 		seconds: parseInt(props.startTimeInSeconds, 10) || 0
// 	  };
// 	}
  
// 	tick() {
// 	  this.setState(state => ({
// 		seconds: state.seconds + 1
// 	  }));
// 	}
  
// 	componentDidMount() {
// 	  this.interval = setInterval(() => this.tick(), 1000);
// 	}
  
// 	componentWillUnmount() {
// 	  clearInterval(this.interval);
// 	}
  
// 	formatTime(secs) {
// 	  let hours   = Math.floor(secs / 3600);
// 	  let minutes = Math.floor(secs / 60) % 60;
// 	  let seconds = secs % 60;
// 	  return [hours, minutes, seconds]
// 		  .map(v => ('' + v).padStart(2, '0'))
// 		  .filter((v,i) => v !== '00' || i > 0)
// 		  .join(':');
// 	}
  
// 	render() {
// 	  return (
// 		<div>
// 		  Timer: {this.formatTime(this.state.seconds)}
// 		</div>
// 	  );
// 	}
//   }
  
//   ReactDOM.render(
// 	<Timer startTimeInSeconds="300" />,
// 	document.getElementById('root')
// );

ReactDOM.render(<Window />, document.getElementById('root'));