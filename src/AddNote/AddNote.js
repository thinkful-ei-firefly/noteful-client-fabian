import React from 'react';
import ApiContext from '../ApiContext';
import config from '../config';
import NotefulForm from "../NotefulForm/NotefulForm";

class AddNote extends React.Component {
	static defaultProps = {
		match:{
			params:{}
		}
	}

	static contextType = ApiContext;

	state = {
		name: '',
		content: '',
		folderId: '0'
	}

	componentDidMount(){
		this.setState({folderId:this.props.match.params.folderId});
	}

	changeName = (name) => {
		this.setState({name:name});
	}

	changeContent = (content) => {
		this.setState({content:content});
	}

	changeFolder = (folderId) => {
		this.setState({folderId:folderId});
	}

	validateName = () => {
		if (this.state.name.length === 0){
			return true;
		}
	}

	validateContent = ()=> {
		if (this.state.content.length === 0){
			return true;
		}
	}

	validateFolder = () => {
		//console.log(this.state.folderId);
		if (typeof this.state.folderId==='undefined' || this.state.folderId === '0'){
			return true;
		}
	}

	submitNote = (event) => {
		event.preventDefault();
		fetch(`${config.API_ENDPOINT}/notes`, {
	      method: 'POST',
	      headers: {
	        'Content-Type': 'application/json',
					'Authorization': `Bearer ${config.API_KEY}`
	      },
	      body: JSON.stringify({
	        name: this.state.name,
	        content: this.state.content,
	        folder_id: this.state.folderId,
	        modified: new Date()
	      })
	    }).then(res => res.ok?res.json():Promise.reject('Got Error'))
	    .then(newNote => {
	    	this.props.history.goBack();
	    	this.context.updateNoteState(newNote);
	    })
	    .catch(error => console.error(error));
	}

	render(){
		const options = this.context.folders.map(folder => <option value={folder.id}>{folder.name}</option>)
		return (
			<NotefulForm id='addNote'>
				<label>Note name</label> {this.validateName() && <span>Note Name Cannot Be Empty</span>} <br/>
				<input id='name' value={this.state.name}  onChange={e => this.changeName(e.target.value)}/><br/>
				<label>Note content</label> {this.validateContent() && <span>Content Name Cannot Be Empty</span>}<br/>
				<input id='content' value={this.state.content}  onChange={e => this.changeContent(e.target.value)}/><br/>

				{!this.props.match.params.folderId &&
				<div>
					<label>Note folder</label> {this.validateFolder() && <span>You have to select a folder</span>} <br/>
					<select onChange={(e) => this.changeFolder(e.target.value)} >
					<option value='0'>--Select folder--</option>
					{options}
					</select><br/>
				</div>
				}
				<button disabled={this.validateName() || this.validateContent() || this.validateFolder()} type="submit" onClick={this.submitNote}>Save</button>
			</NotefulForm>
			)
	}
}

export default AddNote;
