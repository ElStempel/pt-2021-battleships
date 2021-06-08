import ReactDOM from 'react-dom';
import React,{Component,useEffect,useState} from 'react'
import axios from 'axios'
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
var activeForRejoin;
var inGame = false;

function idToCoords(id){
	var x, y;
	if(id[3] == 'Y'){
		x = parseInt(id[2])
		if(id.length == 5){
			y = parseInt(id[4])
		}
		else{
			y = parseInt(id[4]) * 10 + parseInt(id[5])
		}
	}
	else{
		x = parseInt(id[2]) * 10 + parseInt(id[3])
		if(id.length == 6){
			y = parseInt(id[5])
		}
		else{
			y = parseInt(id[5]) * 10 + parseInt(id[6])
		}
	}
	return [x, y];
}

async function fetchGameState(that, enemy, player){
	try{
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ "game_id": that.state.game_id, "player_id": that.state.user_id })
		};
		var stat = 0
		var data
		while(inGame){
			await new Promise(r => setTimeout(r, 500));
			fetch('https://localhost:9000/games/fetch-state', requestOptions)
			.then(function(response){
				stat = response.status;
				if(stat == 200){
					data = response.json();
				}
				return data;
			})
			.then(function(data){
				if(stat == 200){
					that.setState({
						playerBoard: data.playerMap,
						enemyBoard: data.enemyMap,
						draw: data.draw,
						turn: data.turn,
						winner: data.winner,
						shipsLostGame: data.stats.ships_lost,
						shipsSunkGame: data.stats.ships_sunk,
						enemyBoardButtons: false,
						shipDeployed: true,
						gamePlayer: data.player,
						mapSize: data.custom_rules.map_size,
						customRule1: data.custom_rules.cust_rule_1,
						customRule2: data.custom_rules.cust_rule_2,
						customRule3: data.custom_rules.cust_rule_3,
						gap: data.custom_rules.cust_rule_4
					})
					try{
						var normalShotButton = document.getElementsByClassName('confirmShot')[0];
						var clusterButton = document.getElementsByClassName('clusterAttack')[0];
						if(that.state.gamePlayer == that.state.turn && that.state.clusterAttackActive == true){
							normalShotButton.disabled = true;
							normalShotButton.style.backgroundColor = 'green';
						}
						else{
							clusterButton.disabled = true;
							clusterButton.style.backgroundColor = 'green';
							normalShotButton.disabled = false;
							normalShotButton.style.backgroundColor = 'red';
							that.setState({
								clusterAttackActive: false,
							})
						}
					}
					catch(error){

					}
					try{
						if(data.custom_rules.enabled == true){
							document.getElementsByClassName('specialAttacks')[0].style.display = 'inline-block';
							if(data.custom_rules.cust_rule_1){
								document.getElementsByClassName('torpedoShotVertical')[0].style.display = 'inline-block';
								document.getElementsByClassName('torpedoShotHorizontal')[0].style.display = 'inline-block';
							}
							if(data.custom_rules.cust_rule_2){
								document.getElementsByClassName('clusterAttack')[0].style.display = 'inline-block';
							}
							if(data.custom_rules.cust_rule_3){
								document.getElementsByClassName('airStrike')[0].style.display = 'inline-block';
							}
						}
						if(data.stats.attack1 == false){
							var torp1 = document.getElementsByClassName('torpedoShotVertical')[0];
							torp1.style.background = 'green';
							torp1.disabled = true;
							var torp2 = document.getElementsByClassName('torpedoShotHorizontal')[0];
							torp2.style.background = 'green';
							torp2.disabled = true;
						}
						else{
							var torp1 = document.getElementsByClassName('torpedoShotVertical')[0];
							torp1.style.background = 'red';
							torp1.disabled = false;
							var torp2 = document.getElementsByClassName('torpedoShotHorizontal')[0];
							torp2.style.background = 'red';
							torp2.disabled = false;
						}
						if(data.stats.attack2 == false){
							var cluster = document.getElementsByClassName('clusterAttack')[0];
							cluster.style.background = 'green';
							cluster.disabled = true;
						}
						else{
							var cluster = document.getElementsByClassName('clusterAttack')[0];
							cluster.style.background = 'red';
							cluster.disabled = false;
						}
						if(data.stats.attack3 == false){
							var air = document.getElementsByClassName('airStrike')[0];
							air.style.background = 'green';
							air.disabled = true;
						}
						else{
							var air = document.getElementsByClassName('airStrike')[0];
							air.style.background = 'red';
							air.disabled = false;
						}
					}
					catch(error){

					}
					if(data.draw == 1 && that.state.drawProposed == false){
						that.setState({
							drawDivText: 'Enemy Proposed a draw. Do you accept?'
						})
						try{
							document.getElementsByClassName('modalDraw')[0].hidden = false;
						}
						catch(error){
							
						}
					}
					else if(data.draw >= 2){
						that.setState({
							gameShown: false,
							endGameDivShown: true,
							endGameDivText: 'Game ended with a draw.',
							rejoinCurrentGameHidden: 'hidden',
						})
						inGame = false;
						document.getElementsByClassName('modalEnd')[0].hidden = false;
						that.getRoomsList();
					}
					if(data.winner == that.state.gamePlayer){
						that.setState({
							gameShown: false,
							endGameDivShown: true,
							endGameDivText: 'Congratulations, you have won!',
							shipsLostGame: 0,
							shipsSunkGame: 0,
							rejoinCurrentGameHidden: 'hidden',
						})
						inGame = false;
						document.getElementsByClassName('modalEnd')[0].hidden = false;
						that.getMineStats();
						that.getRoomsList();
					}
					else if(data.winner != 0){
						that.setState({
							gameShown: false,
							endGameDivShown: true,
							endGameDivText: 'Unfortunately, you have lost. More luck next time!',
							shipsLostGame: 0,
							shipsSunkGame: 0,
							rejoinCurrentGameHidden: 'hidden',
						})
						inGame = false;
						document.getElementsByClassName('modalEnd')[0].hidden = false;
						that.getMineStats();
						that.getRoomsList();
					}
					if(data.turn == that.state.gamePlayer){
						that.setState({
							turnText: 'Your turn.'
						})
					}
					else{
						that.setState({
							turnText: 'Enemy turn.'
						})
					}
				}
			})
			.then(function(){
				if(stat == 200){
					try{
						for(var i = 0; i < that.state.mapSize; i++){
							for(var j = 0; j < that.state.mapSize; j++){
								if(that.state.enemyBoard[i][j] == 1){
									enemy[j + i * that.state.mapSize].style.backgroundColor = 'red'
								}
								else if(that.state.enemyBoard[i][j] == 2){
									enemy[j + i * that.state.mapSize].style.backgroundColor = 'black'
								}
								else if(that.state.enemyBoard[i][j] == 5){
									enemy[j + i * that.state.mapSize].style.backgroundColor = 'white'
								}
								else if(that.state.enemyBoard[i][j] == 0 && j == that.state.shotX && i == that.state.shotY){
									enemy[j + i * that.state.mapSize].style.backgroundColor = 'yellow'
								}
								else if(that.state.enemyBoard[i][j] == 0){
									enemy[j + i * that.state.mapSize].style.backgroundColor = 'darkblue'
								}
							}
						}
						for(var i = 0; i < that.state.mapSize; i++){
							for(var j = 0; j < that.state.mapSize; j++){
								if(parseInt(that.state.playerBoard[i][j] % 10) == 1){
									// trafienie
									player[j + i * that.state.mapSize].style.backgroundColor = 'red'
								}
								else if(parseInt(that.state.playerBoard[i][j] % 10) == 2){
									// zatopienie
									player[j + i * that.state.mapSize].style.backgroundColor = 'black'
								}
								else if(parseInt(that.state.playerBoard[i][j] % 10) == 5){
									// pudlo
									player[j + i * that.state.mapSize].style.backgroundColor = 'white'
								}
								else if(parseInt(that.state.playerBoard[i][j]) != 0){
									// statek
									player[j + i * that.state.mapSize].style.backgroundColor = '#383838'
								}
								else {
									// puste
									player[j + i * that.state.mapSize].style.backgroundColor = 'blue'
								}
							}
						}
					}
					catch(error){

					}
				}
			})
		}
	}
	catch(error){

	}
}

class Window extends React.Component {
	constructor(props) {
		super(props);

		this.chooseLogin = this.chooseLogin.bind(this);
		this.chooseRegister = this.chooseRegister.bind(this);
		this.chooseLogout = this.chooseLogout.bind(this);
		this.showCreateRoomPage = this.showCreateRoomPage.bind(this);
		this.confirmRoomCreation = this.confirmRoomCreation.bind(this);
		this.enableRulesChoice = this.enableRulesChoice.bind(this);
		this.handleUsernameInputChange = this.handleUsernameInputChange.bind(this);
		this.handlePasswordInputChange = this.handlePasswordInputChange.bind(this);
		this.showDeletePopup = this.showDeletePopup.bind(this);
		this.getRoomsList = this.getRoomsList.bind(this);
		this.clearRoomsList = this.clearRoomsList.bind(this);
		this.getPlayersList = this.getPlayersList.bind(this);
		this.clearPlayersList = this.clearPlayersList.bind(this);
		this.handleChangeDeleteInputPopup = this.handleChangeDeleteInputPopup.bind(this);
		this.handleSubmitDeletePopup = this.handleSubmitDeletePopup.bind(this);
		this.handleClickCloseDeletePopup = this.handleClickCloseDeletePopup.bind(this);
		this.joinGame = this.joinGame.bind(this);
		this.handlePlayerBoardClick = this.handlePlayerBoardClick.bind(this);
		this.handleEnemyBoardClick = this.handleEnemyBoardClick.bind(this);
		this.handleConfirmShipsClick = this.handleConfirmShipsClick.bind(this);
		this.handleResetBoardClick = this.handleResetBoardClick.bind(this);
		this.handleShipButtonClick = this.handleShipButtonClick.bind(this);
		this.handleConfirmShotClick = this.handleConfirmShotClick.bind(this);
		this.updatePlayersList = this.updatePlayersList.bind(this);
		this.updateRoomsList = this.updateRoomsList.bind(this);
		this.startGame = this.startGame.bind(this);
		this.deleteYourRoom = this.deleteYourRoom.bind(this);
		this.leaveRoom = this.leaveRoom.bind(this);
		this.fetchGameStart = this.fetchGameStart.bind(this);
		this.handleSubmitGiveUpPopup = this.handleSubmitGiveUpPopup.bind(this);
		this.fetchGameState = this.fetchGameState.bind(this);
		this.rejoinCurrentGame = this.rejoinCurrentGame.bind(this);
		this.showGiveUpPopup = this.showGiveUpPopup.bind(this);
		this.showDrawPopup = this.showDrawPopup.bind(this);
		this.handleSubmitDrawPopup = this.handleSubmitDrawPopup.bind(this);
		this.handleSubmitDrawGiveUpPopup = this.handleSubmitDrawGiveUpPopup.bind(this);
		this.handleClickCloseDrawGiveUpPopup = this.handleClickCloseDrawGiveUpPopup.bind(this);
		this.handleClickEndPopup = this.handleClickEndPopup.bind(this);
		this.customMapSize = this.customMapSize.bind(this);
		this.torpedoShotVertical = this.torpedoShotVertical.bind(this);
		this.torpedoShotHorizontal = this.torpedoShotHorizontal.bind(this);
		this.clusterAttack = this.clusterAttack.bind(this);
		this.airStrike = this.airStrike.bind(this);
		this.createRoom = this.createRoom.bind(this);
		this.getMineStats = this.getMineStats.bind(this);

		this.state = { 
			// Strona po loginie
			div1Shown: true, 

			// Tekst na stronie loginu
			startText: '',

			// Dane usera
			user_id: '', 
			password: '', 
			username: '', 

			// Staty usera
			games_played: 0, 
			ships_sunk: 0, 
			ships_lost: 0,
			shots_fired: 0,
			shots_missed: 0,
			wins: 0,
			loses: 0,

			// Dołączanie do pokoi
			joinRoomHidden: 'hidden',
			// Usuwanie pokoi i start do gry
			deleteRoomHidden: 'hidden',
			// Ponowne łączenie z grą
			rejoinCurrentGameHidden: 'hidden',

			div2Shown: true, 
			gameShown: false,
			customRulesDisabled: true, 

			endGameDivShown: false,
			endGameDivText: '',

			deleteAccountSeen: false,
			customRule1: false,
			customRule2: false,
			customRule3: false,
			customRule4: false,
			inviteOnly: false,
			customSize: false,
			inviteOnly: false,

			customRulesDisabledVisibility: 'none',
			mapSizeVisibility: 'none',
			customRule1Visibility: 'none',
			customRule2Visibility: 'none',
			customRule3Visibility: 'none',
			customRule4Visibility: 'none',

			createButtonDisabled: false,
			joinRoomHidden: 'hidden',
			deleteRoomHidden: 'hidden',
			rejoinCurrentGameHidden: 'hidden',

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

			playerBoard: [

			],
			enemyBoard: [

			],

			shotX: 0,
			shotY: 0,

			draw: 0,
			winner: 0,
			shipsLostGame: 0,
			shipsSunkGame: 0,

			drawGiveUpPopupText: '',
			drawGiveUpPopupShown: false,

			gamePlayer: 2,

			turn: 0,
			turnText: '',

			mapSize: 10,

			drawDivText: 'Are you sure to propose a Draw?',

			gap: false,

			drawProposed: false,

			shotText: '',

			clusterAttackActive: false,
		};

		activeForRules = this;
		activeForRejoin = this;
	}

	togglePop = () => {
		this.setState({
			deleteAccountSeen: !this.state.deleteAccountSeen,
		});
	};

	updateRoomsList(){
		var that = this;
		that.clearRoomsList();
		that.getRoomsList();
	}

	updatePlayersList(){
		var that = this;
		that.clearPlayersList();
		that.getPlayersList();
	}

	chooseLogin(){
		var that = this;

		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ "user_name": that.state.username, "pass_hash": that.state.password })
		};

		var stat = 0;
		var rejoinStat = 0;

		that.setState({
			startText: '',
		});

		fetch('https://localhost:9000/users/login', requestOptions)
		.then(function(response) { 
			stat = response.status;
			if(stat == 400){
				that.setState({
					startText: "User with such credentials doesn't exist.",
				});
			}
			return response.json(); 
		}, )
		.then(function(data) { 
			if(stat == 200){
				that.setState({
					startText: '',

					div1Shown: !that.state.div1Shown,

					user_id: data._id,
					username: data.user_name,
					password: data.pass_hash,

					games_played: data.stats.games_played, 
					ships_sunk: data.stats.ships_sunk, 
					ships_lost: data.stats.ships_lost,
					shots_fired: data.stats.shots_fired,
					shots_missed: data.stats.shots_missed,
					wins: data.stats.wins,
					loses: data.stats.defeats,
				});
			}
		})
		.then(function() {
			if(stat == 200){
				that.clearRoomsList();
				that.clearPlayersList();
			}
		})
		.then(function() {
			if(stat == 200){
				that.getRoomsList();
				that.getPlayersList();
			}
		})
		.then(async function(){
			const rejoinRequestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ player_id: that.state.user_id })
			};
			await fetch('https://localhost:9000/rooms/rejoin', rejoinRequestOptions)
			.then(function(response){
				rejoinStat = response.status
				return response.json()
			})
			.then(function(data){
				if(rejoinStat == 200 && data.game_id){
					that.setState({
						game_id: data.game_id,
						rejoinCurrentGameHidden: 'visible',
						joinRoomHidden: 'hidden',
						deleteRoomHidden: 'hidden',
					})
				}
				else if(rejoinStat == 200 && data.player_1 == that.state.user_id){
					that.setState({
						rejoinCurrentGameHidden: 'hidden',
						joinRoomHidden: 'hidden',
						deleteRoomHidden: 'visible',
						customRulesDisabled: !data.custom_rules.enabled,
						mapSize: data.custom_rules.map_size,
						customRule1: data.custom_rules.cust_rule_1,
						customRule2: data.custom_rules.cust_rule_2,
						customRule3: data.custom_rules.cust_rule_3,
						customRule4: data.custom_rules.cust_rule_4,
					})
				}
				else if(rejoinStat == 200 && data.player_1 != that.state.user_id){
					that.setState({
						rejoinCurrentGameHidden: 'hidden',
						joinRoomHidden: 'visible',
						deleteRoomHidden: 'hidden',
						customRulesDisabled: !data.custom_rules.enabled,
						mapSize: data.custom_rules.map_size,
						customRule1: data.custom_rules.cust_rule_1,
						customRule2: data.custom_rules.cust_rule_2,
						customRule3: data.custom_rules.cust_rule_3,
						customRule4: data.custom_rules.cust_rule_4,
					})
				}
				else{
					that.setState({
						rejoinCurrentGameHidden: 'hidden',
					})
				}
				if(that.state.customRulesDisabled == false){
					that.setState({
						customRulesDisabledVisibility: 'inline-block'
					})
				}
				if(that.state.mapSize == true){
					that.setState({
						mapSizeVisibility: 'inline-block'
					})
				}
				if(that.state.customRule1 == true){
					that.setState({
						customRule1Visibility: 'inline-block'
					})
				}
				if(that.state.customRule2 == true){
					that.setState({
						customRule2Visibility: 'inline-block'
					})
				}
				if(that.state.customRule3 == true){
					that.setState({
						customRule3Visibility: 'inline-block'
					})
				}
				if(that.state.customRule4 == true){
					that.setState({
						customRule4Visibility: 'inline-block'
					})
				}
			})

		})
	}

	chooseRegister(){
		var that = this;

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
			else{
				that.setState({
					startText: 'There is account with specified username.',
				});
			}
		});
	}

	chooseLogout(){
		var that = this;

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
					// Strona po loginie
					div1Shown: true, 

					// Tekst na stronie loginu
					startText: '',

					// Dane usera
					user_id: '', 
					password: '', 
					username: '', 

					// Staty usera
					games_played: 0, 
					ships_sunk: 0, 
					ships_lost: 0,
					shots_fired: 0,
					shots_missed: 0,
					wins: 0,
					loses: 0,

					// Dołączanie do pokoi
					joinRoomHidden: 'hidden',
					// Usuwanie pokoi i start do gry
					deleteRoomHidden: 'hidden',
					// Ponowne łączenie z grą
					rejoinCurrentGameHidden: 'hidden',

					div2Shown: true, 
					gameShown: false,
					customRulesDisabled: true, 

					endGameDivShown: false,
					endGameDivText: '',

					deleteAccountSeen: false,
					customRule1: false,
					customRule2: false,
					customRule3: false,
					customRule4: false,
					inviteOnly: false,
					customSize: false,
					inviteOnly: false,

					customRulesDisabledVisibility: 'none',
					mapSizeVisibility: 'none',
					customRule1Visibility: 'none',
					customRule2Visibility: 'none',
					customRule3Visibility: 'none',
					customRule4Visibility: 'none',

					createButtonDisabled: false,
					joinRoomHidden: 'hidden',
					deleteRoomHidden: 'hidden',
					rejoinCurrentGameHidden: 'hidden',

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

					playerBoard: [

					],
					enemyBoard: [

					],

					shotX: 0,
					shotY: 0,

					draw: 0,
					winner: 0,
					shipsLostGame: 0,
					shipsSunkGame: 0,

					drawGiveUpPopupText: '',
					drawGiveUpPopupShown: false,

					gamePlayer: 2,

					turn: 0,
					turnText: '',

					mapSize: 10,

					drawDivText: 'Are you sure to propose a Draw?',

					gap: false,

					drawProposed: false,

					shotText: '',

					clusterAttackActive: false,
				});
			}
		});
	}

	getRoomsList(){
		var that = this;
		var receivedRooms;
		const requestOptions = {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		};
		var stat = 0;
		fetch('https://localhost:9000/rooms/list', requestOptions)
		.then(function(response) { 
			stat = response.status;
			if(stat == 200){
				receivedRooms = response.json();
			}
			return receivedRooms;
		}).then(function(receivedRooms){
			for(var i = 0; i < receivedRooms.length; i++){
				var custom = [];
				if(receivedRooms[i].custom_rules.enabled == true){
					custom.push('true')
					custom.push('Enabled')
					if(receivedRooms[i].custom_rules.map_size != 10){
						custom.push(receivedRooms[i].custom_rules.map_size)
					}
					else{
						custom.push(10)
					}
					if(receivedRooms[i].custom_rules.cust_rule_1 != false){
						custom.push('Enabled')
					}
					else{
						custom.push('Disabled')
					}
					if(receivedRooms[i].custom_rules.cust_rule_2 != false){
						custom.push('Enabled')
					}
					else{
						custom.push('Disabled')
					}
					if(receivedRooms[i].custom_rules.cust_rule_3 != false){
						custom.push('Enabled')
					}
					else{
						custom.push('Disabled')
					}
					if(receivedRooms[i].custom_rules.cust_rule_4 != false){
						custom.push('Enabled')
					}
					else{
						custom.push('Disabled')
					}
				}
				else{
					custom = ['false', 'Disabled', 10, 'Disabled', 'Disabled', 'Disabled', 'Disabled']
				}
				if(receivedRooms[i].player_1 == that.state.username){
					that.setState({
						room_id: receivedRooms[i]._id,
						joinRoomHidden: 'hidden',
						deleteRoomHidden: 'visible',
						// rooms: that.state.rooms.concat({ room: 'Room ' + (i + 1).toString(), full: true, hover: 'none', text: 'Created Room', roomId: receivedRooms[i]._id })
						rooms: that.state.rooms.concat({ room: receivedRooms[i].player_1 + "'s room ", full: true, hover: 'none', text: 'Created Room', roomId: receivedRooms[i]._id, customRules: custom })
					});
					if(that.state.rejoinCurrentGameHidden == 'visible'){
						that.setState({
							deleteRoomHidden: 'hidden',
							joinRoomHidden: 'hidden'
						})
					}
				}
				else if(receivedRooms[i].player_2 == null && that.state.room_id == 0 && that.state.rejoinCurrentGameHidden == 'hidden'){
					that.setState({
						// rooms: that.state.rooms.concat({ room: 'Room ' + (i + 1).toString(), full: false, hover: 'auto', text: 'Join', roomId: receivedRooms[i]._id })
						rooms: that.state.rooms.concat({ room: receivedRooms[i].player_1 + "'s room ", full: false, hover: 'auto', text: 'Join', roomId: receivedRooms[i]._id, customRules: custom })
					});
				}
				else if(receivedRooms[i].player_2 == null){
					that.setState({
						// rooms: that.state.rooms.concat({ room: 'Room ' + (i + 1).toString(), full: true, hover: 'none', text: 'Join', roomId: receivedRooms[i]._id  })
						rooms: that.state.rooms.concat({ room: receivedRooms[i].player_1 + "'s room ", full: true, hover: 'none', text: 'Join', roomId: receivedRooms[i]._id, customRules: custom })
					});
				}
				else if(receivedRooms[i].player_2 == that.state.username){
					that.setState({
						room_id: receivedRooms[i]._id,
						joinRoomHidden: 'visible',
						createButtonDisabled: true,
						// rooms: that.state.rooms.concat({ room: 'Room ' + (i + 1).toString(), full: true, hover: 'none', text: 'Joined Room', roomId: receivedRooms[i]._id })
						rooms: that.state.rooms.concat({ room: receivedRooms[i].player_1 + "'s room ", full: true, hover: 'none', text: 'Joined Room', roomId: receivedRooms[i]._id, customRules: custom })
					});
					if(that.state.rejoinCurrentGameHidden == 'visible'){
						that.setState({
							deleteRoomHidden: 'hidden',
							joinRoomHidden: 'hidden'
						})
					}
				}	
				else{
					that.setState({
						// rooms: that.state.rooms.concat({ room: 'Room ' + (i + 1).toString(), full: true, hover: 'none', text: 'Full', roomId: receivedRooms[i]._id })
						rooms: that.state.rooms.concat({ room: receivedRooms[i].player_1 + "'s room ", full: true, hover: 'none', text: 'Full', roomId: receivedRooms[i]._id, customRules: custom })
					});
				}
			}
		})
	}

	clearRoomsList(){
		this.setState({
			rooms: [],
		});
	}

	getPlayersList(){
		var that = this;
		var receivedPlayers;
		const requestOptions = {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		};
		var stat = 0;
		fetch('https://localhost:9000/users/list', requestOptions)
		.then(function(response) { 
			stat = response.status;
			if(stat == 200){
				receivedPlayers = response.json();
			}
			return receivedPlayers;
		}).then(function(receivedPlayers){
			for(var i = 0; i < receivedPlayers.length; i++){
				for(var j = 0; j < receivedPlayers.length - 1; j++){
					if(receivedPlayers[j].stats.wins < receivedPlayers[j + 1].stats.wins){
						var temp = receivedPlayers[j]
						receivedPlayers[j] = receivedPlayers[j + 1];
						receivedPlayers[j + 1] = temp;
					}
				}
			}
			for(var i = 0; i < receivedPlayers.length; i++){
				var divider = 1;
				if(receivedPlayers[i].stats.loses != 0){
					divider = divider = receivedPlayers[i].stats.loses;
				}
				that.setState({
					playersList: that.state.playersList.concat({ player: receivedPlayers[i].user_name, score: receivedPlayers[i].stats.wins })
				});
			}
		})
	}

	clearPlayersList(){
		this.setState({
			playersList: [],
		});
	}

	showCreateRoomPage(){
		this.updateRoomsList();
		this.setState({
			div2Shown: !this.state.div2Shown,
		});
	}

	createRoom(){
		this.updateRoomsList();
		this.setState({
			div2Shown: !this.state.div2Shown,
		});
	}

	confirmRoomCreation(){
		var that = this;
		var custom = {
			enabled: !that.state.customRulesDisabled,
			map_size: that.state.mapSize,
			cust_rule_1: that.state.customRule1,
			cust_rule_2: that.state.customRule2,
			cust_rule_3: that.state.customRule3,
			cust_rule_4: that.state.customRule4,
		}

		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ player_1_id: this.state.user_id, custom_rules: custom })
		};
		var stat = 0;
		var roomDetails;
		fetch('https://localhost:9000/rooms/create', requestOptions)
		.then(function(response){
			stat = response.status;
			if(stat == 201){
				roomDetails = response.json();
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
			if(that.state.customRulesDisabled == false){
				that.setState({
					customRulesDisabledVisibility: 'inline-block'
				})
			}
			if(that.state.mapSize == true){
				that.setState({
					mapSizeVisibility: 'inline-block'
				})
			}
			if(that.state.customRule1 == true){
				that.setState({
					customRule1Visibility: 'inline-block'
				})
			}
			if(that.state.customRule2 == true){
				that.setState({
					customRule2Visibility: 'inline-block'
				})
			}
			if(that.state.customRule3 == true){
				that.setState({
					customRule3Visibility: 'inline-block'
				})
			}
			if(that.state.customRule4 == true){
				that.setState({
					customRule4Visibility: 'inline-block'
				})
			}
		})
		.then(function(){
			that.updateRoomsList();
		})
	}

	enableRulesChoice(){
		activeForRules.setState({
			customRulesDisabled: !activeForRules.state.customRulesDisabled,
		});
	}

	enableRule1(){
		activeForRules.setState({
			customRule1: !activeForRules.state.customRule1,
		});
	}

	enableRule2(){
		activeForRules.setState({
			customRule2: !activeForRules.state.customRule2,
		});
	}

	enableRule3(){
		activeForRules.setState({
			customRule3: !activeForRules.state.customRule3,
		});
	}

	enableRule4(){
		activeForRules.setState({
			customRule4: !activeForRules.state.customRule4,
		});
	}

	enableInviteOnly(){
		activeForRules.setState({
			inviteOnly: !activeForRules.state.inviteOnly,
		});
	}

	customMapSize(event){
		activeForRules.setState({
			mapSize: event.target.value,
		});
	}

	rejoinGame(){
		var that = activeForRejoin;
		that.setState({
			gameShown: !that.state.gameShown,
			enemyBoardButtons: false,
			shipDeployed: true,
		})
		inGame = true;
		var enemy = document.getElementsByClassName('butEnemy');
		var player = document.getElementsByClassName('butPlayer');
		that.fetchGameState();
		// fetchGameState(that, enemy, player);
	}

	startGame(){
		var that = this;
		this.activeForRules = this;
		this.activeForRejoin = this;

		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ "room_id": that.state.room_id, "player_1_id": that.state.user_id })
		};
		var stat = 0;
		fetch('https://localhost:9000/rooms/start-game', requestOptions)
		.then(function(response){
			var data;
			stat = response.status;
			if(stat == 201){
				data = response.json();	
			}
			return data;
		})
		.then(function(data){
			if(stat == 201){
				that.setState({
					gameShown: !that.state.gameShown,
					game_id: data._id,
					game_player: 1,
					mapSize: data.map_size,
					gap: data.force_gap
				})
				inGame = true;
			}
		})
	}

	async fetchGameStart(){
		await new Promise(r => setTimeout(r, 5000));
		var that = this;

		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ "room_id": that.state.room_id, "player_2_id": that.state.user_id })
		};
		var stat = 0;
		fetch('https://localhost:9000/rooms/fetch-game', requestOptions)
		.then(function(response){
			var data;
			stat = response.status;
			if(stat == 200){
				data = response.json();
			}
			return data;
		})
		.then(function(data){
			if(stat == 200){
				that.setState({
					gameShown: !that.state.gameShown,
					game_id: data._id,
					mapSize: data.map_size,
					gap: data.force_gap
				})
			}
		})
	}

	async fetchGameState(){
		var that = this;

		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ "game_id": that.state.game_id, "player_id": that.state.user_id })
		};
		var stat = 0
		var data
		while(stat != 200){
			await new Promise(r => setTimeout(r, 200));
			fetch('https://localhost:9000/games/fetch-state', requestOptions)
			.then(function(response){
				stat = response.status;
				if(stat == 200){
					data = response.json();
				}
				return data;
			})
			.then(function(data){
				if(stat == 200){
					try{
						var confirmBut = document.getElementsByClassName('confirmShips');
						var resetBut = document.getElementsByClassName('resetBoard');
						confirmBut[0].style.backgroundColor = 'green';
						confirmBut[0].disabled = true;
						resetBut[0].style.backgroundColor = 'green';
						resetBut[0].disabled = true;
						var confirmShotBut = document.getElementsByClassName('confirmShot')[0]
						confirmShotBut.style.backgroundColor = 'red'
						var shipsButtons = document.getElementsByClassName('ship');
						for(var i = 0; i < shipsButtons.length; i++){
							shipsButtons[i].style.backgroundColor = 'green';
							shipsButtons[i].disabled = true;
						}
					}
					catch(error){

					}
				}
			})
		}
		var enemy = document.getElementsByClassName('butEnemy');
		var player = document.getElementsByClassName('butPlayer');
		fetchGameState(that, enemy, player);
	}

	leaveRoom(){
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
				})
			}
		})
		.then(function(){
			that.updateRoomsList();
		})
	}

	rejoinCurrentGame(){
		var that = this;
		that.setState({
			gameShown: true,
			createButtonDisabled: true,
			joinRoomHidden: 'hidden',
			deleteRoomHidden: 'hidden',
			rejoinCurrentGameHidden: 'visible',
		})
		inGame = true;
		that.fetchGameState();
	}

	deleteYourRoom(){
		var that = this;

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
					gameShown: false,
					createButtonDisabled: false,
					joinRoomHidden: 'hidden',
					deleteRoomHidden: 'hidden',
          			room_id: 0,
				})
			}
			if(stat == 403){
				that.setState({
					gameShown: false,
					createButtonDisabled: true,
					joinRoomHidden: 'hidden',
					deleteRoomHidden: 'hidden',
					rejoinCurrentGameHidden: 'visible',
				})
				that.rejoinCurrentGame();
			}
		})
		.then(function(){
			that.updateRoomsList();
		})
	}


	handleUsernameInputChange(e) {
		this.setState({username: e.target.value});
	}

	handlePasswordInputChange(e) {
		this.setState({password: e.target.value});
	}

	showGiveUpPopup(){
		document.getElementsByClassName('modalGiveUp')[0].hidden = false;
	}

	handleClickGiveUpPopup() {
		document.getElementsByClassName('modalGiveUp')[0].hidden = true;
	};

	handleClickCloseDrawGiveUpPopup(){
		document.getElementsByClassName('modalDrawGiveUp')[0].hidden = true;
	}

	handleSubmitDrawGiveUpPopup(event) {
		document.getElementsByClassName('modalDrawGiveUp')[0].hidden = true;
	}

	handleSubmitGiveUpPopup(event) {

		var that = this;

		const requestOptions = {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ "game_id": that.state.game_id, "player_id": that.state.user_id })
		};
		var stat = 0;
		fetch('https://localhost:9000/games/give-up', requestOptions)
		.then(function(response){
			stat = response.status;
			that.setState({
				drawGiveUpPopupText: 'You gave up game',
			})
		})
		.then(function(){
			if(stat == 200){
				that.setState({
					createButtonDisabled: false,
					room_id: 0,
					joinRoomHidden: 'hidden',
					deleteRoomHidden: 'hidden',
					div2Shown: true,
					gameShown: false,
					rejoinCurrentGameHidden: 'hidden',
					endGameDivText: 'You gave up a game.',
				})
				document.getElementsByClassName('modalEnd')[0].hidden = false;
				inGame = false;
			}
			that.updateRoomsList();
		})
		that.getMineStats();
	}

	showDrawPopup(){
		document.getElementsByClassName('modalDraw')[0].hidden = false;
	}

	handleClickDrawPopup() {
		document.getElementsByClassName('modalDraw')[0].hidden = true;
	}

	handleSubmitDrawPopup(event) {
		var that = this;
		var stat = 0;
		const requestOptions = {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ game_id: that.state.game_id, player_id: that.state.user_id})
		};

		fetch('https://localhost:9000/games/draw', requestOptions)
		.then(function(response) { 
			stat = response.status;
			if(stat == 200){
				if(that.state.drawProposed == false){
					that.setState({
						drawProposed: true,	
					});
					try{
						document.getElementsByClassName('modalDraw')[0].hidden = true;
					}
					catch(error){

					}
				}
				// that.setState({
				// 	gameShown: !that.state.gameShown,
				// 	rejoinCurrentGameHidden: 'hidden',
				// });
			}
		})
	}

	handleClickEndPopup(){
		document.getElementsByClassName('modalEnd')[0].hidden = true;
	}

	showDeletePopup(){
		document.getElementsByClassName('modalDelete')[0].hidden = false;
	}

	handleClickCloseDeletePopup() {
		document.getElementsByClassName('modalDelete')[0].hidden = true;
	};

	handleSubmitDeletePopup(event) {
		var that = this;
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
			})
		}
	}

	handleChangeDeleteInputPopup(event) {
		this.setState({ inputValue: event.target.value });
	}

	joinGame(event){
		var that = this;
		var room = event.target.id;
		var roomIdToJoin = 0;
		for(var i = 0; i < that.state.rooms.length; i++){
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
			if(stat == 201){
				that.setState({ 
					createButtonDisabled: true,
					room_id: roomIdToJoin,
				});
			}
		})
		.then(function(){
			that.updateRoomsList();
		})

		that.fetchGameStart();
	}

	async getMineStats(){
		var that = this;
		var stat = 0;
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ _id: that.state.user_id })
		};

		await fetch('https://localhost:9000/stats/mine', requestOptions)
		.then(function(response) { 
			stat = response.status;
			return response.json();
		})
		.then(function(data){
			if(stat == 200){
				that.setState({
					games_played: data[0].stats.games_played, 
					ships_sunk: data[0].stats.ships_sunk, 
					ships_lost: data[0].stats.ships_lost,
					shots_fired: data[0].stats.shots_fired,
					shots_missed: data[0].stats.shots_missed,
					wins: data[0].stats.wins,
					loses: data[0].stats.defeats,
				})
			}
		})
	}

	neighbourCheck(that, coords, shipName){
		var neighbourCoordsTaken = false;
		if(shipName == 'dreadnought'){
			for(var i = 0; i < that.state.cruiserCoordsList.length; i++){
				if((coords.x == that.state.cruiserCoordsList[i].X + 1 && coords.y == that.state.cruiserCoordsList[i].Y) || (coords.x == that.state.cruiserCoordsList[i].X - 1 && coords.y == that.state.cruiserCoordsList[i].Y) ||
				(coords.x == that.state.cruiserCoordsList[i].X && coords.y == that.state.cruiserCoordsList[i].Y + 1) || (coords.x == that.state.cruiserCoordsList[i].X && coords.y == that.state.cruiserCoordsList[i].Y - 1) ||
				(coords.x == that.state.cruiserCoordsList[i].X + 1 && coords.y == that.state.cruiserCoordsList[i].Y + 1) || (coords.x == that.state.cruiserCoordsList[i].X - 1 && coords.y == that.state.cruiserCoordsList[i].Y - 1) ||
				(coords.x == that.state.cruiserCoordsList[i].X - 1 && coords.y == that.state.cruiserCoordsList[i].Y + 1) || (coords.x == that.state.cruiserCoordsList[i].X + 1 && coords.y == that.state.cruiserCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
			for(var i = 0; i < that.state.submarineCoordsList.length; i++){
				if((coords.x == that.state.submarineCoordsList[i].X + 1 && coords.y == that.state.submarineCoordsList[i].Y) || (coords.x == that.state.submarineCoordsList[i].X - 1 && coords.y == that.state.submarineCoordsList[i].Y) ||
				(coords.x == that.state.submarineCoordsList[i].X && coords.y == that.state.submarineCoordsList[i].Y + 1) || (coords.x == that.state.submarineCoordsList[i].X && coords.y == that.state.submarineCoordsList[i].Y - 1) ||
				(coords.x == that.state.submarineCoordsList[i].X + 1 && coords.y == that.state.submarineCoordsList[i].Y + 1) || (coords.x == that.state.submarineCoordsList[i].X - 1 && coords.y == that.state.submarineCoordsList[i].Y - 1) ||
				(coords.x == that.state.submarineCoordsList[i].X - 1 && coords.y == that.state.submarineCoordsList[i].Y + 1) || (coords.x == that.state.submarineCoordsList[i].X + 1 && coords.y == that.state.submarineCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
			for(var i = 0; i < that.state.destroyerCoordsList.length; i++){
				if((coords.x == that.state.destroyerCoordsList[i].X + 1 && coords.y == that.state.destroyerCoordsList[i].Y) || (coords.x == that.state.destroyerCoordsList[i].X - 1 && coords.y == that.state.destroyerCoordsList[i].Y) ||
				(coords.x == that.state.destroyerCoordsList[i].X && coords.y == that.state.destroyerCoordsList[i].Y + 1) || (coords.x == that.state.destroyerCoordsList[i].X && coords.y == that.state.destroyerCoordsList[i].Y - 1) ||
				(coords.x == that.state.destroyerCoordsList[i].X + 1 && coords.y == that.state.destroyerCoordsList[i].Y + 1) || (coords.x == that.state.destroyerCoordsList[i].X - 1 && coords.y == that.state.destroyerCoordsList[i].Y - 1) ||
				(coords.x == that.state.destroyerCoordsList[i].X - 1 && coords.y == that.state.destroyerCoordsList[i].Y + 1) || (coords.x == that.state.destroyerCoordsList[i].X + 1 && coords.y == that.state.destroyerCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
			for(var i = 0; i < that.state.reconCoordsList.length; i++){
				if((coords.x == that.state.reconCoordsList[i].X + 1 && coords.y == that.state.reconCoordsList[i].Y) || (coords.x == that.state.reconCoordsList[i].X - 1 && coords.y == that.state.reconCoordsList[i].Y) ||
				(coords.x == that.state.reconCoordsList[i].X && coords.y == that.state.reconCoordsList[i].Y + 1) || (coords.x == that.state.reconCoordsList[i].X && coords.y == that.state.reconCoordsList[i].Y - 1) ||
				(coords.x == that.state.reconCoordsList[i].X + 1 && coords.y == that.state.reconCoordsList[i].Y + 1) || (coords.x == that.state.reconCoordsList[i].X - 1 && coords.y == that.state.reconCoordsList[i].Y - 1) ||
				(coords.x == that.state.reconCoordsList[i].X - 1 && coords.y == that.state.reconCoordsList[i].Y + 1) || (coords.x == that.state.reconCoordsList[i].X + 1 && coords.y == that.state.reconCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
		}
		if(shipName == 'cruiser'){
			for(var i = 0; i < that.state.dreadnoughtCoordsList.length; i++){
				if((coords.x == that.state.dreadnoughtCoordsList[i].X + 1 && coords.y == that.state.dreadnoughtCoordsList[i].Y) || (coords.x == that.state.dreadnoughtCoordsList[i].X - 1 && coords.y == that.state.dreadnoughtCoordsList[i].Y) ||
				(coords.x == that.state.dreadnoughtCoordsList[i].X && coords.y == that.state.dreadnoughtCoordsList[i].Y + 1) || (coords.x == that.state.dreadnoughtCoordsList[i].X && coords.y == that.state.dreadnoughtCoordsList[i].Y - 1) ||
				(coords.x == that.state.dreadnoughtCoordsList[i].X + 1 && coords.y == that.state.dreadnoughtCoordsList[i].Y + 1) || (coords.x == that.state.dreadnoughtCoordsList[i].X - 1 && coords.y == that.state.dreadnoughtCoordsList[i].Y - 1) ||
				(coords.x == that.state.dreadnoughtCoordsList[i].X - 1 && coords.y == that.state.dreadnoughtCoordsList[i].Y + 1) || (coords.x == that.state.dreadnoughtCoordsList[i].X + 1 && coords.y == that.state.dreadnoughtCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
			for(var i = 0; i < that.state.submarineCoordsList.length; i++){
				if((coords.x == that.state.submarineCoordsList[i].X + 1 && coords.y == that.state.submarineCoordsList[i].Y) || (coords.x == that.state.submarineCoordsList[i].X - 1 && coords.y == that.state.submarineCoordsList[i].Y) ||
				(coords.x == that.state.submarineCoordsList[i].X && coords.y == that.state.submarineCoordsList[i].Y + 1) || (coords.x == that.state.submarineCoordsList[i].X && coords.y == that.state.submarineCoordsList[i].Y - 1) ||
				(coords.x == that.state.submarineCoordsList[i].X + 1 && coords.y == that.state.submarineCoordsList[i].Y + 1) || (coords.x == that.state.submarineCoordsList[i].X - 1 && coords.y == that.state.submarineCoordsList[i].Y - 1) ||
				(coords.x == that.state.submarineCoordsList[i].X - 1 && coords.y == that.state.submarineCoordsList[i].Y + 1) || (coords.x == that.state.submarineCoordsList[i].X + 1 && coords.y == that.state.submarineCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
			for(var i = 0; i < that.state.destroyerCoordsList.length; i++){
				if((coords.x == that.state.destroyerCoordsList[i].X + 1 && coords.y == that.state.destroyerCoordsList[i].Y) || (coords.x == that.state.destroyerCoordsList[i].X - 1 && coords.y == that.state.destroyerCoordsList[i].Y) ||
				(coords.x == that.state.destroyerCoordsList[i].X && coords.y == that.state.destroyerCoordsList[i].Y + 1) || (coords.x == that.state.destroyerCoordsList[i].X && coords.y == that.state.destroyerCoordsList[i].Y - 1) ||
				(coords.x == that.state.destroyerCoordsList[i].X + 1 && coords.y == that.state.destroyerCoordsList[i].Y + 1) || (coords.x == that.state.destroyerCoordsList[i].X - 1 && coords.y == that.state.destroyerCoordsList[i].Y - 1) ||
				(coords.x == that.state.destroyerCoordsList[i].X - 1 && coords.y == that.state.destroyerCoordsList[i].Y + 1) || (coords.x == that.state.destroyerCoordsList[i].X + 1 && coords.y == that.state.destroyerCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
			for(var i = 0; i < that.state.reconCoordsList.length; i++){
				if((coords.x == that.state.reconCoordsList[i].X + 1 && coords.y == that.state.reconCoordsList[i].Y) || (coords.x == that.state.reconCoordsList[i].X - 1 && coords.y == that.state.reconCoordsList[i].Y) ||
				(coords.x == that.state.reconCoordsList[i].X && coords.y == that.state.reconCoordsList[i].Y + 1) || (coords.x == that.state.reconCoordsList[i].X && coords.y == that.state.reconCoordsList[i].Y - 1) ||
				(coords.x == that.state.reconCoordsList[i].X + 1 && coords.y == that.state.reconCoordsList[i].Y + 1) || (coords.x == that.state.reconCoordsList[i].X - 1 && coords.y == that.state.reconCoordsList[i].Y - 1) ||
				(coords.x == that.state.reconCoordsList[i].X - 1 && coords.y == that.state.reconCoordsList[i].Y + 1) || (coords.x == that.state.reconCoordsList[i].X + 1 && coords.y == that.state.reconCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
		}
		if(shipName == 'submarine'){
			for(var i = 0; i < that.state.dreadnoughtCoordsList.length; i++){
				if((coords.x == that.state.dreadnoughtCoordsList[i].X + 1 && coords.y == that.state.dreadnoughtCoordsList[i].Y) || (coords.x == that.state.dreadnoughtCoordsList[i].X - 1 && coords.y == that.state.dreadnoughtCoordsList[i].Y) ||
				(coords.x == that.state.dreadnoughtCoordsList[i].X && coords.y == that.state.dreadnoughtCoordsList[i].Y + 1) || (coords.x == that.state.dreadnoughtCoordsList[i].X && coords.y == that.state.dreadnoughtCoordsList[i].Y - 1) ||
				(coords.x == that.state.dreadnoughtCoordsList[i].X + 1 && coords.y == that.state.dreadnoughtCoordsList[i].Y + 1) || (coords.x == that.state.dreadnoughtCoordsList[i].X - 1 && coords.y == that.state.dreadnoughtCoordsList[i].Y - 1) ||
				(coords.x == that.state.dreadnoughtCoordsList[i].X - 1 && coords.y == that.state.dreadnoughtCoordsList[i].Y + 1) || (coords.x == that.state.dreadnoughtCoordsList[i].X + 1 && coords.y == that.state.dreadnoughtCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
			for(var i = 0; i < that.state.cruiserCoordsList.length; i++){
				if((coords.x == that.state.cruiserCoordsList[i].X + 1 && coords.y == that.state.cruiserCoordsList[i].Y) || (coords.x == that.state.cruiserCoordsList[i].X - 1 && coords.y == that.state.cruiserCoordsList[i].Y) ||
				(coords.x == that.state.cruiserCoordsList[i].X && coords.y == that.state.cruiserCoordsList[i].Y + 1) || (coords.x == that.state.cruiserCoordsList[i].X && coords.y == that.state.cruiserCoordsList[i].Y - 1) ||
				(coords.x == that.state.cruiserCoordsList[i].X + 1 && coords.y == that.state.cruiserCoordsList[i].Y + 1) || (coords.x == that.state.cruiserCoordsList[i].X - 1 && coords.y == that.state.cruiserCoordsList[i].Y - 1) ||
				(coords.x == that.state.cruiserCoordsList[i].X - 1 && coords.y == that.state.cruiserCoordsList[i].Y + 1) || (coords.x == that.state.cruiserCoordsList[i].X + 1 && coords.y == that.state.cruiserCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
			for(var i = 0; i < that.state.destroyerCoordsList.length; i++){
				if((coords.x == that.state.destroyerCoordsList[i].X + 1 && coords.y == that.state.destroyerCoordsList[i].Y) || (coords.x == that.state.destroyerCoordsList[i].X - 1 && coords.y == that.state.destroyerCoordsList[i].Y) ||
				(coords.x == that.state.destroyerCoordsList[i].X && coords.y == that.state.destroyerCoordsList[i].Y + 1) || (coords.x == that.state.destroyerCoordsList[i].X && coords.y == that.state.destroyerCoordsList[i].Y - 1) ||
				(coords.x == that.state.destroyerCoordsList[i].X + 1 && coords.y == that.state.destroyerCoordsList[i].Y + 1) || (coords.x == that.state.destroyerCoordsList[i].X - 1 && coords.y == that.state.destroyerCoordsList[i].Y - 1) ||
				(coords.x == that.state.destroyerCoordsList[i].X - 1 && coords.y == that.state.destroyerCoordsList[i].Y + 1) || (coords.x == that.state.destroyerCoordsList[i].X + 1 && coords.y == that.state.destroyerCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
			for(var i = 0; i < that.state.reconCoordsList.length; i++){
				if((coords.x == that.state.reconCoordsList[i].X + 1 && coords.y == that.state.reconCoordsList[i].Y) || (coords.x == that.state.reconCoordsList[i].X - 1 && coords.y == that.state.reconCoordsList[i].Y) ||
				(coords.x == that.state.reconCoordsList[i].X && coords.y == that.state.reconCoordsList[i].Y + 1) || (coords.x == that.state.reconCoordsList[i].X && coords.y == that.state.reconCoordsList[i].Y - 1) ||
				(coords.x == that.state.reconCoordsList[i].X + 1 && coords.y == that.state.reconCoordsList[i].Y + 1) || (coords.x == that.state.reconCoordsList[i].X - 1 && coords.y == that.state.reconCoordsList[i].Y - 1) ||
				(coords.x == that.state.reconCoordsList[i].X - 1 && coords.y == that.state.reconCoordsList[i].Y + 1) || (coords.x == that.state.reconCoordsList[i].X + 1 && coords.y == that.state.reconCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
		}
		if(shipName == 'destroyer'){
			for(var i = 0; i < that.state.dreadnoughtCoordsList.length; i++){
				if((coords.x == that.state.dreadnoughtCoordsList[i].X + 1 && coords.y == that.state.dreadnoughtCoordsList[i].Y) || (coords.x == that.state.dreadnoughtCoordsList[i].X - 1 && coords.y == that.state.dreadnoughtCoordsList[i].Y) ||
				(coords.x == that.state.dreadnoughtCoordsList[i].X && coords.y == that.state.dreadnoughtCoordsList[i].Y + 1) || (coords.x == that.state.dreadnoughtCoordsList[i].X && coords.y == that.state.dreadnoughtCoordsList[i].Y - 1) ||
				(coords.x == that.state.dreadnoughtCoordsList[i].X + 1 && coords.y == that.state.dreadnoughtCoordsList[i].Y + 1) || (coords.x == that.state.dreadnoughtCoordsList[i].X - 1 && coords.y == that.state.dreadnoughtCoordsList[i].Y - 1) ||
				(coords.x == that.state.dreadnoughtCoordsList[i].X - 1 && coords.y == that.state.dreadnoughtCoordsList[i].Y + 1) || (coords.x == that.state.dreadnoughtCoordsList[i].X + 1 && coords.y == that.state.dreadnoughtCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
			for(var i = 0; i < that.state.cruiserCoordsList.length; i++){
				if((coords.x == that.state.cruiserCoordsList[i].X + 1 && coords.y == that.state.cruiserCoordsList[i].Y) || (coords.x == that.state.cruiserCoordsList[i].X - 1 && coords.y == that.state.cruiserCoordsList[i].Y) ||
				(coords.x == that.state.cruiserCoordsList[i].X && coords.y == that.state.cruiserCoordsList[i].Y + 1) || (coords.x == that.state.cruiserCoordsList[i].X && coords.y == that.state.cruiserCoordsList[i].Y - 1) ||
				(coords.x == that.state.cruiserCoordsList[i].X + 1 && coords.y == that.state.cruiserCoordsList[i].Y + 1) || (coords.x == that.state.cruiserCoordsList[i].X - 1 && coords.y == that.state.cruiserCoordsList[i].Y - 1) ||
				(coords.x == that.state.cruiserCoordsList[i].X - 1 && coords.y == that.state.cruiserCoordsList[i].Y + 1) || (coords.x == that.state.cruiserCoordsList[i].X + 1 && coords.y == that.state.cruiserCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
			for(var i = 0; i < that.state.submarineCoordsList.length; i++){
				if((coords.x == that.state.submarineCoordsList[i].X + 1 && coords.y == that.state.submarineCoordsList[i].Y) || (coords.x == that.state.submarineCoordsList[i].X - 1 && coords.y == that.state.submarineCoordsList[i].Y) ||
				(coords.x == that.state.submarineCoordsList[i].X && coords.y == that.state.submarineCoordsList[i].Y + 1) || (coords.x == that.state.submarineCoordsList[i].X && coords.y == that.state.submarineCoordsList[i].Y - 1) ||
				(coords.x == that.state.submarineCoordsList[i].X + 1 && coords.y == that.state.submarineCoordsList[i].Y + 1) || (coords.x == that.state.submarineCoordsList[i].X - 1 && coords.y == that.state.submarineCoordsList[i].Y - 1) ||
				(coords.x == that.state.submarineCoordsList[i].X - 1 && coords.y == that.state.submarineCoordsList[i].Y + 1) || (coords.x == that.state.submarineCoordsList[i].X + 1 && coords.y == that.state.submarineCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
			for(var i = 0; i < that.state.reconCoordsList.length; i++){
				if((coords.x == that.state.reconCoordsList[i].X + 1 && coords.y == that.state.reconCoordsList[i].Y) || (coords.x == that.state.reconCoordsList[i].X - 1 && coords.y == that.state.reconCoordsList[i].Y) ||
				(coords.x == that.state.reconCoordsList[i].X && coords.y == that.state.reconCoordsList[i].Y + 1) || (coords.x == that.state.reconCoordsList[i].X && coords.y == that.state.reconCoordsList[i].Y - 1) ||
				(coords.x == that.state.reconCoordsList[i].X + 1 && coords.y == that.state.reconCoordsList[i].Y + 1) || (coords.x == that.state.reconCoordsList[i].X - 1 && coords.y == that.state.reconCoordsList[i].Y - 1) ||
				(coords.x == that.state.reconCoordsList[i].X - 1 && coords.y == that.state.reconCoordsList[i].Y + 1) || (coords.x == that.state.reconCoordsList[i].X + 1 && coords.y == that.state.reconCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
		}
		if(shipName == 'recon'){
			for(var i = 0; i < that.state.dreadnoughtCoordsList.length; i++){
				if((coords.x == that.state.dreadnoughtCoordsList[i].X + 1 && coords.y == that.state.dreadnoughtCoordsList[i].Y) || (coords.x == that.state.dreadnoughtCoordsList[i].X - 1 && coords.y == that.state.dreadnoughtCoordsList[i].Y) ||
				(coords.x == that.state.dreadnoughtCoordsList[i].X && coords.y == that.state.dreadnoughtCoordsList[i].Y + 1) || (coords.x == that.state.dreadnoughtCoordsList[i].X && coords.y == that.state.dreadnoughtCoordsList[i].Y - 1) ||
				(coords.x == that.state.dreadnoughtCoordsList[i].X + 1 && coords.y == that.state.dreadnoughtCoordsList[i].Y + 1) || (coords.x == that.state.dreadnoughtCoordsList[i].X - 1 && coords.y == that.state.dreadnoughtCoordsList[i].Y - 1) ||
				(coords.x == that.state.dreadnoughtCoordsList[i].X - 1 && coords.y == that.state.dreadnoughtCoordsList[i].Y + 1) || (coords.x == that.state.dreadnoughtCoordsList[i].X + 1 && coords.y == that.state.dreadnoughtCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
			for(var i = 0; i < that.state.cruiserCoordsList.length; i++){
				if((coords.x == that.state.cruiserCoordsList[i].X + 1 && coords.y == that.state.cruiserCoordsList[i].Y) || (coords.x == that.state.cruiserCoordsList[i].X - 1 && coords.y == that.state.cruiserCoordsList[i].Y) ||
				(coords.x == that.state.cruiserCoordsList[i].X && coords.y == that.state.cruiserCoordsList[i].Y + 1) || (coords.x == that.state.cruiserCoordsList[i].X && coords.y == that.state.cruiserCoordsList[i].Y - 1) ||
				(coords.x == that.state.cruiserCoordsList[i].X + 1 && coords.y == that.state.cruiserCoordsList[i].Y + 1) || (coords.x == that.state.cruiserCoordsList[i].X - 1 && coords.y == that.state.cruiserCoordsList[i].Y - 1) ||
				(coords.x == that.state.cruiserCoordsList[i].X - 1 && coords.y == that.state.cruiserCoordsList[i].Y + 1) || (coords.x == that.state.cruiserCoordsList[i].X + 1 && coords.y == that.state.cruiserCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
			for(var i = 0; i < that.state.submarineCoordsList.length; i++){
				if((coords.x == that.state.submarineCoordsList[i].X + 1 && coords.y == that.state.submarineCoordsList[i].Y) || (coords.x == that.state.submarineCoordsList[i].X - 1 && coords.y == that.state.submarineCoordsList[i].Y) ||
				(coords.x == that.state.submarineCoordsList[i].X && coords.y == that.state.submarineCoordsList[i].Y + 1) || (coords.x == that.state.submarineCoordsList[i].X && coords.y == that.state.submarineCoordsList[i].Y - 1) ||
				(coords.x == that.state.submarineCoordsList[i].X + 1 && coords.y == that.state.submarineCoordsList[i].Y + 1) || (coords.x == that.state.submarineCoordsList[i].X - 1 && coords.y == that.state.submarineCoordsList[i].Y - 1) ||
				(coords.x == that.state.submarineCoordsList[i].X - 1 && coords.y == that.state.submarineCoordsList[i].Y + 1) || (coords.x == that.state.submarineCoordsList[i].X + 1 && coords.y == that.state.submarineCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
			for(var i = 0; i < that.state.destroyerCoordsList.length; i++){
				if((coords.x == that.state.destroyerCoordsList[i].X + 1 && coords.y == that.state.destroyerCoordsList[i].Y) || (coords.x == that.state.destroyerCoordsList[i].X - 1 && coords.y == that.state.destroyerCoordsList[i].Y) ||
				(coords.x == that.state.destroyerCoordsList[i].X && coords.y == that.state.destroyerCoordsList[i].Y + 1) || (coords.x == that.state.destroyerCoordsList[i].X && coords.y == that.state.destroyerCoordsList[i].Y - 1) ||
				(coords.x == that.state.destroyerCoordsList[i].X + 1 && coords.y == that.state.destroyerCoordsList[i].Y + 1) || (coords.x == that.state.destroyerCoordsList[i].X - 1 && coords.y == that.state.destroyerCoordsList[i].Y - 1) ||
				(coords.x == that.state.destroyerCoordsList[i].X - 1 && coords.y == that.state.destroyerCoordsList[i].Y + 1) || (coords.x == that.state.destroyerCoordsList[i].X + 1 && coords.y == that.state.destroyerCoordsList[i].Y - 1)){
					neighbourCoordsTaken = true;
				}
			}
		}
		return neighbourCoordsTaken;
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

		if(this.state.gap == true){
			neighbourCoordsTaken = this.neighbourCheck(this, coords, shipName);
		}
		
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
		if(this.state.availableFields > 0){
			if(this.state.dreadnoughtEnabled == true){
				if(this.checkCoords('dreadnought', this.state.dreadnoughtCoordsList, {x: parseInt(idToCoords(event.target.id)[0]), y: parseInt(idToCoords(event.target.id)[1])})){
					this.state.dreadnoughtCoordsList.push({X: parseInt(idToCoords(event.target.id)[0]), Y: parseInt(idToCoords(event.target.id)[1])})
					event.target.style.backgroundColor = '#383838'
					this.setState({
						availableFields: this.state.availableFields - 1,
					})
				}
			}
			else if(this.state.cruiserEnabled == true){
				if(this.checkCoords('cruiser', this.state.cruiserCoordsList, {x: parseInt(idToCoords(event.target.id)[0]), y: parseInt(idToCoords(event.target.id)[1])})){
					this.state.cruiserCoordsList.push({X: parseInt(idToCoords(event.target.id)[0]), Y: parseInt(idToCoords(event.target.id)[1])})
					event.target.style.backgroundColor = '#383838'
					this.setState({
						availableFields: this.state.availableFields - 1,
					})
				}
			}
			else if(this.state.submarineEnabled == true){
				if(this.checkCoords('submarine', this.state.submarineCoordsList, {x: parseInt(idToCoords(event.target.id)[0]), y: parseInt(idToCoords(event.target.id)[1])})){
					this.state.submarineCoordsList.push({X: parseInt(idToCoords(event.target.id)[0]), Y: parseInt(idToCoords(event.target.id)[1])})
					event.target.style.backgroundColor = '#383838'
					this.setState({
						availableFields: this.state.availableFields - 1,
					})
				}
			}
			else if(this.state.destroyerEnabled == true){
				if(this.checkCoords('destroyer', this.state.destroyerCoordsList, {x: parseInt(idToCoords(event.target.id)[0]), y: parseInt(idToCoords(event.target.id)[1])})){
					this.state.destroyerCoordsList.push({X: parseInt(idToCoords(event.target.id)[0]), Y: parseInt(idToCoords(event.target.id)[1])})
					event.target.style.backgroundColor = '#383838'
					this.setState({
						availableFields: this.state.availableFields - 1,
					})
				}
			}
			else if(this.state.reconEnabled == true){
				if(this.checkCoords('recon', this.state.reconCoordsList, {x: parseInt(idToCoords(event.target.id)[0]), y: parseInt(idToCoords(event.target.id)[1])})){
					this.state.reconCoordsList.push({X: parseInt(idToCoords(event.target.id)[0]), Y: parseInt(idToCoords(event.target.id)[1])})
					event.target.style.backgroundColor = '#383838'
					this.setState({
						availableFields: this.state.availableFields - 1,
					})
				}
			}
		}
	}

	handleEnemyBoardClick(event){
		event.preventDefault();
		var that = this;
		if(that.state.enemyBoardButtons == false && that.state.enemyBoard != undefined && that.state.playerBoard != undefined){
			that.setState({
				shotX: parseInt(idToCoords(event.target.id)[0]),
				shotY: parseInt(idToCoords(event.target.id)[1]),
			})
			var enemy = document.getElementsByClassName('butEnemy');
			for(var i = 0; i < that.state.mapSize; i++){
				for(var j = 0; j < that.state.mapSize; j++){
					if(that.state.enemyBoard[i][j] == 1){
						enemy[j + i * that.state.mapSize].style.backgroundColor = 'red'
					}
					else if(that.state.enemyBoard[i][j] == 2){
						enemy[j + i * that.state.mapSize].style.backgroundColor = 'black'
					}
					else if(that.state.enemyBoard[i][j] == 5){
						enemy[j + i * that.state.mapSize].style.backgroundColor = 'white'
					}
					else if(that.state.enemyBoard[i][j] == 0){
						enemy[j + i * that.state.mapSize].style.backgroundColor = 'darkblue'
					}
				}
			}
			var player = document.getElementsByClassName('butPlayer');
			for(var i = 0; i < that.state.mapSize; i++){
				for(var j = 0; j < that.state.mapSize; j++){
					if(parseInt(that.state.playerBoard[i][j] % 10) == 1){
						// trafienie
						player[j + i * that.state.mapSize].style.backgroundColor = 'red'
					}
					if(parseInt(that.state.playerBoard[i][j] % 10) == 2){
						// zatopienie
						player[j + i * that.state.mapSize].style.backgroundColor = 'black'
					}
					if(parseInt(that.state.playerBoard[i][j] % 10) == 5){
						// pudlo
						player[j + i * that.state.mapSize].style.backgroundColor = 'white'
					}
				}
			}
			event.target.style.backgroundColor = 'yellow'
		}
		// that.fetchGameState();
	}

	prepareBoardToSend(){
		var that = this;
		var board = [];
		for(var i = 0; i < that.state.mapSize; i++){
			var temp = [];
			for(var j = 0; j < that.state.mapSize; j++){
				temp.push(0)
			}
			board.push(temp)
		}
		for(var i = 0; i < that.state.dreadnoughtCoordsList.length; i++){
			board[that.state.dreadnoughtCoordsList[i].Y][that.state.dreadnoughtCoordsList[i].X] = 10;
		}
		for(var i = 0; i < that.state.cruiserCoordsList.length; i++){
			board[that.state.cruiserCoordsList[i].Y][that.state.cruiserCoordsList[i].X] = 20;
		}
		for(var i = 0; i < that.state.submarineCoordsList.length; i++){
			board[that.state.submarineCoordsList[i].Y][that.state.submarineCoordsList[i].X] = 30;
		}
		for(var i = 0; i < that.state.destroyerCoordsList.length; i++){
			board[that.state.destroyerCoordsList[i].Y][that.state.destroyerCoordsList[i].X] = 40;
		}
		for(var i = 0; i < that.state.reconCoordsList.length; i++){
			board[that.state.reconCoordsList[i].Y][that.state.reconCoordsList[i].X] = 50;
		}

		return board;
	}

	handleConfirmShipsClick(){
		var that = this;
		var boardToSend = that.prepareBoardToSend();
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

			var stat = 0;
			const requestOptions = {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ game_id: that.state.game_id, player_id: that.state.user_id, map: boardToSend})
			};

			fetch('https://localhost:9000/games/init-map', requestOptions)
			.then(function(response) { 
				stat = response.status;
			})
			.then(function(){
				if(stat == 200){
					inGame = true;
				}
				that.fetchGameState()
			})

		}
		var enemy = document.getElementsByClassName('butEnemy');
		var player = document.getElementsByClassName('butPlayer');
		// fetchGameState(that, enemy, player);
	}

	handleResetBoardClick(){
		var shipsButtons = document.getElementsByClassName('ship');
		var boardButtons = document.getElementsByClassName('butPlayer');
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

	handleConfirmShotClick(event){
		var that = this;
		var enemyBoard = document.getElementsByClassName('enemyTable')[0];
		if(that.state.enemyBoard[that.state.shotY][that.state.shotX] == 0){
			event.preventDefault()
			event.target.style.backgroundColor = 'red'
			var stat = 0;
			const requestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ game_id: that.state.game_id, player_id: that.state.user_id, coordinates: { x: that.state.shotY, y: that.state.shotX}})
			};

			fetch('https://localhost:9000/games/shot', requestOptions)
			.then(function(response) { 
				stat = response.status;
				if(stat == 200){
					// event.target.style.backgroundColor = 'green'
					that.setState({
						shotText: ''
					})
					// that.fetchGameState()
				}
				// else{
				// 	event.target.style.backgroundColor = 'yellow'
				// }
			});
			var enemy = document.getElementsByClassName('butEnemy');
			var player = document.getElementsByClassName('butPlayer');
			// fetchGameState(that, enemy, player);
		}
		else{
			that.setState({
				shotText: 'You already shot here'
			})
		}
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
		
		if(this.state[shipDeployed] == 0 && this.state.availableFields == 0){
			event.target.style.backgroundColor = 'green';
		}
		else{
			event.target.style.backgroundColor = 'red';
		}
	}

	showCustomRulesDiv(room){
		document.getElementsByClassName(room)[0].style.setProperty("display", "inline");
	}

	hideCustomRulesDiv(room){
		document.getElementsByClassName(room)[0].style.setProperty("display", "none");
	}

	torpedoShotHorizontal(){
		var that = this;
		var torpedoButton1 = document.getElementsByClassName('torpedoShotVertical')[0];
		var torpedoButton2 = document.getElementsByClassName('torpedoShotHorizontal')[0];
		var stat = 0;
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ game_id: that.state.game_id, player_id: that.state.user_id, coordinates: { x: that.state.shotY}})
		};

		fetch('https://localhost:9000/games/shot/torpedo', requestOptions)
		.then(function(response) { 
			stat = response.status;
			if(stat == 200){
				torpedoButton1.disabled = true;
				torpedoButton1.style.backgroundColor = 'green';
				torpedoButton2.disabled = true;
				torpedoButton2.style.backgroundColor = 'green';
				// that.fetchGameState()
			}
		});
	}

	torpedoShotVertical(){
		var that = this;
		var torpedoButton1 = document.getElementsByClassName('torpedoShotVertical')[0];
		var torpedoButton2 = document.getElementsByClassName('torpedoShotHorizontal')[0];
		var stat = 0;
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ game_id: that.state.game_id, player_id: that.state.user_id, coordinates: { y: that.state.shotX}})
		};

		fetch('https://localhost:9000/games/shot/torpedo', requestOptions)
		.then(function(response) { 
			stat = response.status;
			if(stat == 200){
				torpedoButton1.disabled = true;
				torpedoButton1.style.backgroundColor = 'green';
				torpedoButton2.disabled = true;
				torpedoButton2.style.backgroundColor = 'green';
				// that.fetchGameState()
			}
		});
	}

	airStrike(){
		var that = this;
		var airStrikeButton = document.getElementsByClassName('airStrike')[0];
		if(that.state.shotY > 0 && that.state.shotY < that.state.mapSize - 1 && that.state.shotX > 0 && that.state.shotX < that.state.mapSize - 1){
			var stat = 0;
			const requestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ game_id: that.state.game_id, player_id: that.state.user_id, coordinates: { x: that.state.shotY, y: that.state.shotX}})
			};

			fetch('https://localhost:9000/games/shot/airstrike', requestOptions)
			.then(function(response) { 
				stat = response.status;
				if(stat == 200){
					that.setState({
						shotText: ''
					})
					airStrikeButton.disabled = true;
					airStrikeButton.style.backgroundColor = 'green';
					// that.fetchGameState()
				}
			});
		}
		else{
			that.setState({
				shotText: 'You cannot shoot here'
			})
		}
	}

	clusterAttack(){
		var that = this;
		var clusterButton = document.getElementsByClassName('clusterAttack')[0];
		var normalShotButton = document.getElementsByClassName('confirmShot')[0];
		if(that.state.enemyBoard[that.state.shotY][that.state.shotX] == 0){
			var stat = 0;
			const requestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ game_id: that.state.game_id, player_id: that.state.user_id, coordinates: { x: that.state.shotY, y: that.state.shotX}})
			};

			fetch('https://localhost:9000/games/shot/cluster', requestOptions)
			.then(function(response) { 
				stat = response.status;
				if(stat == 200){
					that.setState({
						shotText: '',
						clusterAttackActive: true,
					})
					if(that.state.gamePlayer == that.state.turn && that.state.clusterAttackActive == true){
						normalShotButton.disabled = true;
						normalShotButton.style.backgroundColor = 'green';
					}
					else{
						clusterButton.disabled = true;
						clusterButton.style.backgroundColor = 'green';
						normalShotButton.disabled = false;
						normalShotButton.style.backgroundColor = 'red';
						that.setState({
							clusterAttackActive: false,
						})
					}
					// that.fetchGameState()
				}
			});
		}
		else{
			that.setState({
				shotText: 'You already shot here'
			})
		}
	}

	render() {
		const listNames = this.state.playersList.map((d) => <li style={{ height: '80px', fontWeight: 'bold' }} key={d.player}>{d.player}</li>);
		const listScore = this.state.playersList.map((d) => <li style={{ height: '80px', fontWeight: 'bold' }} key={d.player}>{d.score}</li>);
		const listRooms = this.state.rooms.map((r) => <li style={{ height: '110px', fontWeight: 'bold' }} key={r.room}>{r.room} <button id={r.room} class='joinButton' disabled={r.full} onClick={this.joinGame} 
		onMouseOver={() => this.showCustomRulesDiv(r.room)}
		onMouseOut={() => this.hideCustomRulesDiv(r.room)}
		style={{display: 'inline-block', float: 'right', marginRight: '20px', width: '120px', height: '40px', cursor: 'pointer', fontSize: '15px', pointerEvents: [r.hover]}}> {r.text} </button>
		<div class={r.room} style={{ fontSize: '15px', display: 'none', fontWeight: 'normal'}}>
			<br></br>
			<br></br>
			Custom Rules: {r.customRules[1]} &nbsp;&nbsp; | &nbsp;&nbsp; Map Size: {r.customRules[2]}  &nbsp;&nbsp; | &nbsp;&nbsp; Field of gap: {r.customRules[6]}<br></br>
			One Field of space: {r.customRules[3]} &nbsp;&nbsp; | &nbsp;&nbsp; Torpedo Shot: {r.customRules[4]} &nbsp;&nbsp; | &nbsp;&nbsp; Airstrike: {r.customRules[5]}
		</div>
		</li>)

		const noHover = {
			pointerEvents: 'none',
		}

		let rowsPlayer = [];
		var playerId;
        for (let y = 0; y < activeForRules.state.mapSize; y++) {
            const cellsPlayer = [];
            for (let x = 0; x < activeForRules.state.mapSize; x++) {
				playerId = 'PX' + x.toString() + 'Y' + y.toString();
                cellsPlayer.push(<th><button class='butPlayer' id={playerId} disabled={!this.state.playerBoardEnabled} onClick={this.handlePlayerBoardClick}></button></th>);
            }
            rowsPlayer.push(<tr>{cellsPlayer}</tr>);
        }

		let rowsEnemy = [];
		var enemyId;
        for (let y = 0; y < activeForRules.state.mapSize; y++) {
            const cellsEnemy = [];
            for (let x = 0; x < activeForRules.state.mapSize; x++) {
				// this.state.enemyBoardButtons
				enemyId = 'EX' + x.toString() + 'Y' + y.toString();
                cellsEnemy.push(<th><button class='butEnemy' id={enemyId} onClick={this.handleEnemyBoardClick}></button></th>);
            }
            rowsEnemy.push(<tr>{cellsEnemy}</tr>);
        }

		return (
				this.state.div1Shown ?
				(
					<div id="startPage" style={{ width: '100%', height: '1200px', fontSize: '60px', background: '#222831', overflowX: 'hidden', }}>
					<h1 style={startPageHeader}>Battleships Online</h1>
					<p style={{ height: '50px', textAlign: 'center', fontSize: '60px', color: 'white', fontWeight: 'bold' }}>{this.state.startText}</p>
					<div id='login' style={{textAlign: 'center', color: 'white', fontSize: '40px',}}>
						<p>Username</p>
						<input type="text" id="usernameInput" name="usernameInput" placeholder="Username" value={this.state.username} onChange={this.handleUsernameInputChange} style={inputStyle}/>
					</div>
					<div id='password' style={{textAlign: 'center', color: 'white', fontSize: '40px',}}>
						<p>Password</p>
						<input type="password" id="passwordInput" name="passwordInput" placeholder="Password" value={this.state.password} onChange={this.handlePasswordInputChange} style={inputStyle}/>
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
							<div id='gamePage' class='gamePage' style={{ width: '100%', height: '100%', display: 'inline-block', backgroundColor: '#09322E'}}>
								<div className="modalDraw" hidden='true'>
									<div className="modal_content">
									<span className="close" onClick={this.handleClickDrawPopup}>
										&times;
									</span>
										<h2 style={{textAlign: 'center'}}>{this.state.drawDivText}</h2>
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

								<div style={{}}>
									<p style={{fontSize: '30px', color: 'white', display: 'inline-block', marginLeft: '50px'}}>Ships lost: {this.state.shipsLostGame}</p>
									<p style={{fontSize: '30px', color: 'white', display: 'inline-block', marginLeft: '50px'}}>Ships sunk: {this.state.shipsSunkGame}</p>
									{/* <p class="coords" style={{ fontSize: '30px', color: 'white', display: "inline-block", marginLeft: '50px' }}>Current coords: column - {this.state.shotX + 1}, row - {this.state.shotY + 1} </p> */}
									<p class="shotText" style={{ fontSize: '30px', color: 'white', display: "inline-block", marginLeft: '50px' }}> {this.state.shotText} </p>
									<p style={{fontSize: '30px', color: 'white', display: 'inline-block', marginLeft: '50px'}}>{this.state.turnText}</p>
								</div>
								<div id='playerBoard' class='playerBoard' style={{ display: 'inline-block', fontSize: '60px', marginLeft: '50px', marginTop: '20px', }}>
									<table class='playerTable'>{rowsPlayer}</table>
									<p style={{textAlign: 'center', fontSize: '35px', color:'white', fontWeight: 'bold'}}>Player board</p>
								</div>
								<div id='enemyBoard' class='enemyBoard' style={{ display: 'inline-block', fontSize: '60px', marginLeft: '50px', marginTop: '20px', }}>
									<table class='enemyTable'>{rowsEnemy}</table>
									<p style={{textAlign: 'center', fontSize: '35px', color:'white', fontWeight: 'bold'}} disabled={this.state.enemyBoardButtons}>Enemy board</p>
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
									<button id='resetBoard' class="resetBoard" onClick={this.handleResetBoardClick} >Reset board</button>
									<br></br>
									<br></br>
									<button id='confirmShips' class="confirmShips" onClick={this.handleConfirmShipsClick} >Confirm setup</button>
									<br></br>
									<br></br>
									<button id='confirmShot' class="confirmShot" onClick={this.handleConfirmShotClick}>Confirm Shot</button>
									<br></br>
									<br></br>
									<button id='defeat' class="defeat" onClick={this.showGiveUpPopup}>Give up</button>
									<br></br>
									<br></br>
									<button id='draw' class="draw" onClick={this.showDrawPopup}>Propose a draw</button>
								</div>
								<br></br>
								<br></br>
								<br></br>
								<div className='specialAttacks' style={{ display: 'none', verticalAlign: 'top' }} hidden='true'>
									<button className="torpedoShotVertical" hidden={!this.state.customRule1} onClick={this.torpedoShotVertical}>Vertical torpedo shot</button>
									<button className="torpedoShotHorizontal" hidden={!this.state.customRule1} onClick={this.torpedoShotHorizontal}>Horizontal torpedo shot</button>
									<button className="clusterAttack" hidden={!this.state.customRule2} onClick={this.clusterAttack}>Cluster attack</button>
									<button className="airStrike" hidden={!this.state.customRule3} onClick={this.airStrike}>Air strike</button>
								</div>

							</div>
						)
						:
						(
								<div id="startPage" style={{ backgroundImage: `url(${background})`, width: '100%', height: '1200px', fontSize: '20px', background: '#222831', overflowX: 'hidden', }}>
							<br />
								<div id="startHeader" style={{display: 'flex', flexDirection: 'row', marginLeft: '38%', }}>
									<h1 style={startPageHeader}>Battleships Online</h1>
									<button class='logoutButton' id='logoutButton' onClick={this.chooseLogout} style={logoutButtonStyle}>Logout</button>
								</div>
							<br />
								<div id="pageAfterLogin" class="pageAfterLogin" style={{ backgroundImage: `url(${background})`, display: 'flex', flexDirection: 'row', }}>
									<div className="modalDelete" hidden='true'>
										<div className="modal_content">
										<span className="close" onClick={this.handleClickCloseDeletePopup}>
											&times;
										</span>
											<h2 style={{textAlign: 'center'}}>Type in your password to delete Account.</h2>
											<div style={{ textAlign: 'center'}}>
												<label>
												Password:
												<input type="password" name="name" onChange={this.handleChangeDeleteInputPopup} placeholder='Password' style={{ marginLeft: '20px', height: '30px', width: '300px'}}/>
												</label>
											</div>
											<br />
											<div style={{ textAlign: 'center'}}> 
												<button id="submitButton" class="submitButton" onClick={this.handleSubmitDeletePopup} style={{ cursor: 'pointer', height: '30px', width: '400px' }}>Confirm</button>
											</div>
										</div>
									</div>

									<div className="modalDrawGiveUp" hidden='true'>
										<div className="modal_content">
										<span className="close" onClick={this.handleClickCloseDrawGiveUpPopup}>
											&times;
										</span>
											<h2 style={{textAlign: 'center'}}>{this.state.drawGiveUpPopupText}</h2>
											<div style={{ textAlign: 'center'}}> 
												<button id="submitButton" class="submitButton" onClick={this.handleSubmitDrawGiveUpPopup} style={{ cursor: 'pointer', height: '30px', width: '400px' }}>OK</button>
											</div>
										</div>
									</div>

									<div className="modalEnd" hidden='true'>
										<div className="modal_content">
										<span className="close" onClick={this.handleClickEndPopup}>
											&times;
										</span>
											<h2 style={{textAlign: 'center'}}>{this.state.endGameDivText}</h2>
										</div>
									</div>
									
									<div id="rooms" style={{display: 'inline-block', marginLeft: '50px', backgroundColor: 'grey', width: '600px', height: '750px', overflowX: 'hidden', overflowY: 'auto',}}>
										<h2 id="roomsText" style={{ marginLeft: '10px', minHeight: '40px', color: 'white', display: 'inline-block', }}>Rooms</h2>
										<button class='createButton' id='createButton' disabled={this.state.createButtonDisabled} onClick={this.showCreateRoomPage} style={createButtonStyle}>Create Room</button>
										<hr></hr>
										<button class='updateButton' id='updateButton' onClick={this.updateRoomsList} style={{marginLeft: '150px', display: 'block', width: '300px', height: '40px', cursor: 'pointer', fontSize: '15px'}}>Refresh Rooms list</button>
										<hr></hr>
										<div id="roomsEntrys" style={{ marginLeft: '25px', listStyleType: 'none', color: 'white', }}>
											{listRooms}
										</div>
									</div>
									<div id="players" style={{display: 'inline-block', minHeight: '600px', marginLeft: '70px', backgroundColor: 'grey', width: '600px', height: '750px', overflowX: 'hidden', overflowY: 'auto', }}>
										<h2 style={{ marginLeft: '10px', color: 'white', minHeight: '50px',}}>Top Players</h2>
										<hr></hr>
										<button class='updateButton' id='updateButton' onClick={this.updatePlayersList} style={{marginLeft: '150px', display: 'block', width: '300px', height: '40px', cursor: 'pointer', fontSize: '15px'}}>Refresh Top Players list</button>
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
									<br></br>
									<button style={{ visibility: this.state.rejoinCurrentGameHidden, marginLeft: '50px' }} onClick={this.rejoinGame} class='joinRoomButton'>Rejoin Your Game</button>
									<div style={{ visibility: this.state.deleteRoomHidden, display: 'inline-block', marginLeft: '70px', fontSize: '30px', color: 'white' }}>
										<div style={{ display: this.state.customRulesDisabledVisibility }}> Map size: {this.state.mapSize}, custom rules enabled: <p style={{ display: this.state.customRule1Visibility, }}>one field of space,&nbsp;</p><p style={{ display: this.state.customRule2Visibility, }}>torpedo attack,&nbsp;</p><p style={{ display: this.state.customRule3Visibility, }}>cluster attack,&nbsp;</p><p style={{ display: this.state.customRule4Visibility, }}>airstrike</p></div>
									</div>

								</div>
							</div>
						)
					)
					:
					(
						<div id="createRoomPage" style={{ backgroundImage: `url(${radar})`, width: '100%', height: '1200px', fontSize: '20px', background: '#222831', overflowX: 'hidden', }}>
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
									<label style={{fontSize: '30px', fontWeight: 'bold', marginLeft: '10px' }} forHtml="customRule1">Torpedo attack</label><br/>
									<br/>
									<input style={{width: '30px', height: '30px', marginLeft: '10px'}} type="checkbox" ref="customRule2" id="customRule2" name="customRule2" value="customRule2" onChange={this.enableRule2} disabled={this.state.customRulesDisabled}/>
									<label style={{fontSize: '30px', fontWeight: 'bold', marginLeft: '10px' }} forHtml="customRule2">Cluster attack</label><br/>
									<br/>
									<input style={{width: '30px', height: '30px', marginLeft: '10px'}} type="checkbox" ref="customRule3" id="customRule3" name="customRule3" value="customRule3" onChange={this.enableRule3} disabled={this.state.customRulesDisabled}/>
									<label style={{fontSize: '30px', fontWeight: 'bold', marginLeft: '10px' }} forHtml="customRule3">Air strike</label><br/>
									<br/>
									<input style={{width: '30px', height: '30px', marginLeft: '10px'}} type="checkbox" ref="customRule4" id="customRule4" name="customRule4" value="customRule4" onChange={this.enableRule4} disabled={this.state.customRulesDisabled}/>
									<label style={{fontSize: '30px', fontWeight: 'bold', marginLeft: '10px' }} forHtml="customRule4">One field of space between ships</label><br/>
									{/* <br/>
									<input style={{width: '30px', height: '30px', marginLeft: '10px'}} type="checkbox" ref="inviteOnly" id="inviteOnly" name="inviteOnly" value="inviteOnly" onChange={this.enableInviteOnly} disabled={this.state.customRulesDisabled}/>
									<label style={{fontSize: '30px', fontWeight: 'bold', marginLeft: '10px' }} forHtml="inviteOnly">Invite Only</label><br/> */}
									<br/>
									<br/>

									<select style={{fontSize: '30px', fontWeight: 'bold', width: '140px', height: '40px', marginLeft: '10px' }} name="size" id="size" disabled={this.state.customRulesDisabled} onChange={this.customMapSize}>
										<option value="10">10 x 10</option>
										<option value="12">12 x 12</option>
										<option value="14">14 x 14</option>
										<option value="16">16 x 16</option>
										<option value="18">18 x 18</option>
										<option value="20">20 x 20</option>
									</select> 
									<label style={{fontSize: '30px', fontWeight: 'bold', marginLeft: '10px' }} forHtml="size">Choose board size</label>
									<br/>
									<br/>
									<br/>
									<br/>
									<br/>
									<br/>
									
									<div style={{ alignItems: 'center' }}>
										<button class='newRoomButton' id='newRoomButton' onClick={this.confirmRoomCreation} style={{ marginLeft:'300px', width: '1200px', height: '80px', fontSize: '50px', textAlign: 'center', cursor: 'pointer' }}>Create room with specified rules</button>
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