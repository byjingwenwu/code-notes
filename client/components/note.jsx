import React from 'react';
import NotebookHeader from './notebook-header';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Link } from 'react-router-dom';

function CancelModal(props) {
  let modalDisplay;
  if (props.modal === 'hidden') {
    modalDisplay = 'cancel-note-modal modal-hide';
  }
  if (props.modal === 'visible') {
    modalDisplay = 'cancel-note-modal modal-visible';
  }
  return (
    <div className={modalDisplay}>
      <div className="cancel-note-modal-main">
        <p>Changes have been cancelled</p>
      </div>
    </div>
  );
}

class Note extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      note: null,
      view: 'viewNote',
      element: null,
      notebooks: [],
      flashcard: { fcTags: [''], fcDeckId: null, fcQuestion: '', fcAnswer: '' }
    };
    this.deleteNote = this.deleteNote.bind(this);
    this.editNote = this.editNote.bind(this);
    this.createNewNote = this.createNewNote.bind(this);
    this.createFlashcard = this.createFlashcard.bind(this);
    this.handleDifficultyChange = this.handleDifficultyChange.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.createNewNote = this.createNewNote.bind(this);
    this.getAllNoteData = this.getAllNoteData.bind(this);
    this.getNotebooks = this.getNotebooks.bind(this);
    this.addOneResource = this.addOneResource.bind(this);
    this.deleteOneResource = this.deleteOneResource.bind(this);
    this.handleResourceName = this.handleResourceName.bind(this);
    this.handleResourceLink = this.handleResourceLink.bind(this);
    this.addOneResource = this.addOneResource.bind(this);
    this.deleteOneResource = this.deleteOneResource.bind(this);
    this.handleTagChange = this.handleTagChange.bind(this);
    this.flashCardQuestion = this.flashCardQuestion.bind(this);
    this.flashCardAnswer = this.flashCardAnswer.bind(this);
    this.showModal = this.showModal.bind(this);

  }

  componentDidMount() {
    this.getAllNoteData();
    this.getNotebooks();
  }

  getAllNoteData() {
    if (this.props.match.params.noteId) {
      fetch(`/api/notes/${this.props.match.params.noteId}`)
        .then(res => res.json())
        .then(data => {
          this.setState({
            note: data,
            flashcard: { ...this.state.flashcard, fcDeckId: data.notebookId }

          });
        })
        .catch(error => console.error(error));
    } else {
      this.setState({
        note: {
          notebookId: 1,
          noteTitle: '',
          noteContent: '',
          noteDifficulty: 1,
          noteResource: [],
          noteCode: {},
          noteTags: ''
        },
        view: 'createNote',
        flashcard: { ...this.state.flashcard, fcDeckId: 1 }
      });
    }
  }

  getNotebooks() {
    fetch('/api/students/1')
      .then(res => res.json())
      .then(notebookData => this.setState({
        notebooks: notebookData.notebooks
      }))
      .catch(error => console.error(error));
  }

  handleTitleChange(event) {
    this.setState({
      note: {
        ...this.state.note,
        noteTitle: event.target.value
      }
    });
  }

  handleDifficultyChange(number) {
    this.setState({
      note: {
        ...this.state.note,
        noteDifficulty: number
      }
    });
  }

  handleContentChange(event) {
    this.setState({
      note: {
        ...this.state.note,
        noteContent: event.target.value
      }
    });
  }

  handleTagChange(event) {
    this.setState({
      note: {
        ...this.state.note,
        noteTags: event.target.value
      }
    });
  }

  handleResourceName(index, event) {
    const resourceArray = [...this.state.note.noteResource];
    const newName = {
      name: event.target.value,
      link: resourceArray[index].link
    };
    resourceArray.splice(index, 1, newName);
    this.setState({
      note: {
        ...this.state.note,
        noteResource: resourceArray
      }
    });
  }

  handleResourceLink(index, event) {
    const resourceArray = [...this.state.note.noteResource];
    const newName = {
      name: resourceArray[index].name,
      link: event.target.value
    };
    resourceArray.splice(index, 1, newName);
    this.setState({
      note: {
        ...this.state.note,
        noteResource: resourceArray
      }
    });
  }

  addOneResource() {
    const resource = { link: '', name: '' };
    const resourceArray = [...this.state.note.noteResource];
    resourceArray.push(resource);
    this.setState({
      note: {
        ...this.state.note,
        noteResource: resourceArray
      }
    });
  }

  deleteOneResource(index) {
    const resourceArray = [...this.state.note.noteResource];
    resourceArray.splice(index, 1);
    this.setState({
      note: {
        ...this.state.note,
        noteResource: resourceArray
      }
    });
  }

  flashCardQuestion(event) {
    this.setState({
      flashcard: {
        ...this.state.flashcard,
        fcQuestion: event.target.value
      }
    });
  }

  flashCardAnswer(event) {
    this.setState({
      flashcard: {
        ...this.state.flashcard,
        fcAnswer: event.target.value
      }
    });
  }

  createNewNote(event) {
    event.preventDefault();
    const newNote = this.state.note;
    // newNote.noteTags = newNote.noteTags.split(' ');
    fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNote)
    })
      .then(res => res.json())
      .then(data => {
        this.setState({
          view: 'viewNote'
        });
        this.props.history.push(`/notes/${data.noteId}`);
      })
      .catch(error => console.error(error));
  }

  editNote(event) {
    event.preventDefault();
    const { notebookName, noteId, ...rest } = this.state.note;
    fetch(`/api/notes/${this.props.match.params.noteId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rest)
    })
      .then(res => res.json())
      .then(update => {
      })
      .catch(error => console.error(error));
  }

  deleteNote(noteId) {
    fetch(`/api/notes/${noteId}`, {
      method: 'DELETE'
    })
      .then(() => { this.setState({ view: 'deleteSuccess' }); })
      .catch(error => console.error(error));
  }

  createFlashcard(event) {
    event.preventDefault();
    fetch('/api/flashcards/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.state.flashcard)
    })
      .then(res => res.json())
      .then(() => {
        this.setState({
          flashcard: {
            ...this.state.flashcard,
            fcTags: [''],
            fcQuestion: '',
            fcAnswer: ''
          }
        });
      })
      .catch(error => console.error(error));
  }

  showModal() {
    this.setState({
      modal: 'visible'
    });
    setTimeout(() => {
      this.setState({
        modal: 'hidden'
      });
    }, 2000);
  }

  render() {
    const note = this.state.note;
    const view = this.state.view;
    const element = this.state.element;
    const justifyContent = element ? 'justify-content-between' : 'justify-content-end';
    const closeButton = this.state.view === 'viewNote' ? '/notebook' : '/';
    let elementRow, rightColumn;
    if (view === 'deleteSuccess') {
      return (
        <>
          <NotebookHeader />
          <div className="note-page-container">
            <div className="note-delete">
              <h3>Your note has been deleted.</h3>
              <Link to="/notebook" className="notebooks-link">
                <Button className="solid-button mt-4">Back</Button>
              </Link>
            </div>
          </div>
        </>
      );
    }

    switch (element) {
      case 'flashcard':
        elementRow = (
          <div className="height-90">
            <FormGroup className="mb-4">
              <Label for="flashcardQuestion" className="note-font-1">Enter Question:</Label>
              <Input type="textarea" name="flashcardQuestion" id="flashcardQuestion"
                value={this.state.flashcard.fcQuestion} onChange={this.flashCardQuestion}/>
            </FormGroup>
            <FormGroup className="mb-4">
              <Label for="flashcardAnswer" className="note-font-1">Enter Answer:</Label>
              <Input type="textarea" name="flashcardAnswer" id="flashcardAnswer"
                value={this.state.flashcard.fcAnswer} onChange={this.flashCardAnswer}/>
            </FormGroup>
            <div className="d-flex flex-row align-items-center justify-content-between">
              <FormGroup className="mb-5 flashcard-select-tag">
                <Label for="flashcardTag">Flashcard Tag:</Label>
                <Input type="select" name="flashcardTag" id="flashcardTag">
                  <option defaultValue>Select a Tag</option>
                  <option>Create new tag</option>
                </Input>
              </FormGroup>
              <Button className="solid-button-large ml-4" onClick={this.createFlashcard}>Make Flashcard</Button>
            </div>
          </div>
        );
        break;
      case 'resource':
        elementRow = (
          <div className="height-90">
            {
              note.noteResource.map((item, index) => {
                return (
                  <div key={index} className="d-flex flex-row align-items-center justify-content-between mb-2">
                    <FormGroup className="resource">
                      <Label for="resourceName">Resource Name</Label>
                      <Input type="text" name="resourceName" id="resourceName" placeholder="Name"
                        defaultValue={item.name} onChange={() => this.handleResourceName(index, event)} />
                    </FormGroup>
                    <FormGroup className="resource-link ml-4">
                      <Label for="resourceLink">Link</Label>
                      <Input type="text" name="resourceLink" id="resourceLink" placeholder="Name"
                        defaultValue={item.link} onChange={() => this.handleResourceLink(index, event)} />
                    </FormGroup>
                    <div className="minus-button ml-4" onClick={() => this.deleteOneResource(index)}><i className="fas fa-minus"></i></div>
                  </div>
                );
              })
            }
            <div className="add-button" onClick={this.addOneResource}><i className="fas fa-plus"></i></div>
          </div>
        );
        break;
      case 'code':
        elementRow = (
          <div className="height-90">
            <h3>HTML</h3>
            <p>{note.noteCode.html}</p>
            <h3>CSS</h3>
            <p>{note.noteCode.css}</p>
            <h3>JavaScript</h3>
            <p>{note.noteCode.javascript}</p>
          </div>
        );
        break;
    }

    switch (view) {
      case 'viewNote':
        rightColumn = (
          <div className={`d-flex flex-column height-90 ${justifyContent}`}>
            {elementRow}
            <div className="height-10 d-flex align-items-end justify-content-center ">
              <Button type="submit" className="solid-button" onClick={this.editNote}>Update</Button>
              <Button type="reset" className="solid-button ml-4"
                onClick={() => {
                  this.getAllNoteData();
                  this.showModal();
                }}>Cancel</Button>
              <Button className="solid-button ml-4" onClick={() => this.deleteNote(note.noteId)}>Delete</Button>
            </div>
          </div>
        );
        break;
      case 'createNote':
        rightColumn = (
          <div className={`d-flex flex-column height-90 ${justifyContent}`}>
            {elementRow}
            <div className="height-10 d-flex align-items-end justify-content-center">
              <Button type="submit" className="solid-button"
                onClick={() => {
                  this.createNewNote(event);
                }}>Create</Button>
              <Button type="reset" className="solid-button ml-4"
                onClick={() => {
                  this.getAllNoteData();
                  this.showModal();
                }}>Cancel</Button>
            </div>
          </div>
        );
        break;
    }

    return note === null ? (null) : (
      <Form>
        <header className="header-container d-flex flex-row justify-content-between">
          <div className="d-flex flex-row align-items-center col">
            <Link to="/" className="d-flex flex-row align-items-center">
              <i className="fa fa-bars theme-green fa-2x header-hamburger-icon"></i>
            </Link>
            <FormGroup className="ml-5 mb-0">
              <Label for="noteTile"></Label>
              <input
                className="header-note-title"
                type="text" name="noteTile"
                id="noteTile"
                placeholder="Enter title here"
                defaultValue={note.noteTitle}
                onChange={this.handleTitleChange} />
            </FormGroup>
          </div>
          <div className="d-flex flex-row align-items-center justify-content-between col-md-3">
            <Input type="text" name="noteTags" id="noteTags" className="col"
              value={this.state.note.noteTags} onChange={this.handleTagChange}/>

            <div className={`diff-status ml-4 diff-${note.noteDifficulty}`}></div>
            <Link to={{ pathname: closeButton }}>
              <Button className="d-flex flex-row align-items-center justify-content-center close-page-button ml-4">
                <i className="fas fa-times"></i>
              </Button>
            </Link>
          </div>
        </header>
        <main className="note-page-container">
          <div className="col-6">
            <div className="d-flex flex-row align-items-center mb-4">
              <div className="note-font-1">Difficulty:</div>
              <div className="difficulty diff-1"
                onClick={() => this.handleDifficultyChange(1)}></div>
              <div className="difficulty diff-2"
                onClick={() => this.handleDifficultyChange(2)}></div>
              <div className="difficulty diff-3"
                onClick={() => this.handleDifficultyChange(3)}></div>
              <div className="difficulty diff-4"
                onClick={() => this.handleDifficultyChange(4)}></div>
              <div className="difficulty diff-5"
                onClick={() => this.handleDifficultyChange(5)}></div>
            </div>
            <FormGroup className="mb-4">
              <Label for="notebookName" className="note-font-1">Select Notebook:</Label>
              <Input type="select" name="notebookName" id="notebookName">
                {
                  this.state.notebooks.map(notebook => {
                    // need to find a way to set current notebookName as  default value.  the below method isn't working as intended.
                    // return (notebook.notebookId === this.state.note.notebookId)
                    //   ? (<option key={notebook.notebookId} defaultValue>{note.notebookName}</option>)
                    //   : (<option key={notebook.notebookId}>{notebook.notebookName}</option>);
                    return (
                      <option key={notebook.notebookId}>{notebook.notebookName}</option>
                    );
                  })}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="noteContent" className="note-font-1">Enter Note:</Label>
              <textarea
                className="form-control note-content"
                type="textarea"
                name="noteContent"
                id="noteContent"
                defaultValue={note.noteContent}
                placeholder="Enter note here"
                onChange={this.handleContentChange}></textarea>
            </FormGroup>
            <CancelModal
              modal={this.state.modal} />
          </div>
          <div className={'col-5 d-flex flex-column h-100'}>
            <div className="height-10">
              <Button
                className="solid-button"
                onClick={() => this.setState({ element: 'flashcard' })}>Flashcard</Button>
              <Button
                className="solid-button ml-4"
                onClick={() => this.setState({ element: 'resource' })}>Resource</Button>
              <Button
                className="solid-button ml-4"
                onClick={() => this.setState({ element: 'code' })}>Code</Button>
            </div>
            {rightColumn}
          </div>
        </main>
      </Form>
    );
  }
}

export default Note;
