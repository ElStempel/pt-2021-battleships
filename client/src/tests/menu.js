import React from 'react';
import { Media } from 'reactstrap';
import './media.css';

class Menu extends React.Component {
	constructor(props){
		super(props);
		
		this.state = {};
	}
	
	render(){
		
		const menu = this.props.places.map((place) => {
			return(
				<div key={place.id} id="unit" className="col-12 mt-5">					
					<Media tag="li">
						<Media left>
							<Media object src={place.image} alt={place.name} />
						</Media>
						<Media body className="ml-3">
							<Media heading><strong>{place.name}</strong></Media>
							<div><strong>Location Type - </strong>{place.category}</div>
							<div><strong>Info - </strong>{place.description}</div>
							<div>Info source - {place.source}</div>
						</Media>
					</Media>
				</div>
			);
		});
		
		return(
			<div className="container">
				<div className="row">
					<Media list>
						{menu}
					</Media>
				</div>
			</div>
		);
	}
}

// 'Keys' - It helps identify which items have changed, are added or removed.


export default Menu;