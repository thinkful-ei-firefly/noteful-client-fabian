import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import ApiContext from '../ApiContext';
import config from '../config';
import './App.css';
import AddFolder from '../AddFolder/AddFolder';
import AddNote from '../AddNote/AddNote';
import ErrorPage from '../ErrorBoundry';

//console.log(process.env.REACT_APP_API_KEY );

class App extends Component {
    state = {
        notes: [],
        folders: [],
        loading: true
    };

    updateState = (folder) => {
        this.setState({
            folders: [...this.state.folders, folder]
        })
    }

    updateNoteState = (note) => {
        this.setState({
            notes: [...this.state.notes, note],
        })
    }

    componentDidMount() {
        Promise.all([
            fetch(`${config.API_ENDPOINT}/notes`,{
            headers: {
                'Authorization': `Bearer ${config.API_KEY}`
            }}),
            fetch(`${config.API_ENDPOINT}/folders`,{
            headers: {
                'Authorization': `Bearer ${config.API_KEY}`
            }})
        ])
            .then(([notesRes, foldersRes]) => {
                if (!notesRes.ok)
                    return notesRes.json().then(e => Promise.reject(e));
                if (!foldersRes.ok)
                    return foldersRes.json().then(e => Promise.reject(e));

                return Promise.all([notesRes.json(), foldersRes.json()]);
            })
            .then(([notes, folders]) => {
                const loading = false;
                this.setState({notes, folders, loading});
            })
            .catch(error => {
                console.error({error});
            });
    }

    handleDeleteNote = noteId => {
        this.setState({
            notes: this.state.notes.filter(note => note.id !== noteId)
        });
    };

    renderNavRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListNav}
                    />
                ))}
                <Route path="/note/:noteId" component={NotePageNav} />
                <Route path="/add-folder" component={NotePageNav} />
                <Route path="/add-note" component={NotePageNav} />
            </>
        );
    }

    renderMainRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListMain}
                    />
                ))}
                <Route path="/note/:noteId" component={NotePageMain} />
                <Route inexact path="/add-folder" component={AddFolder}/>
                <Route exact path="/add-note" component={AddNote}/>
                <Route exact path="/add-note/:folderId" component={AddNote}/>
            </>
        );
    }

    render() {
        const value = {
            notes: this.state.notes,
            folders: this.state.folders,
            deleteNote: this.handleDeleteNote,
            updateState: this.updateState,
            updateNoteState: this.updateNoteState
        };
        return (
            <ApiContext.Provider value={value}>
                <ErrorPage>
                <div className="App">
                    <nav className="App__nav">{this.renderNavRoutes()}</nav>
                    <header className="App__header">
                        <h1>
                            <Link to="/">Noteful</Link>{' '}
                            <FontAwesomeIcon icon="check-double" />
                        </h1>
                    </header>
                    <main className="App__main">{this.renderMainRoutes()}</main>
                </div>
                {this.state.loading && <div className="loading">{this.state.loading}Loading..</div> }
                </ErrorPage>
            </ApiContext.Provider>
        );
    }
}

export default App;
