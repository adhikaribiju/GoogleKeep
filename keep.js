class App {
  constructor() {
  	this.notes = JSON.parse(localStorage.getItem('notes')) || [];
  	this.title = '';
  	this.text = '';
  	this.id ='';

  	this.$placeholder = document.querySelector('#placeholder')
    this.$form = document.querySelector('#form');  //$ sign is for html element
    this.$notes = document.querySelector('#notes');
    this.$noteTitle = document.querySelector('#note-title');
    this.$noteText = document.querySelector('#note-text');
	this.$formButtons = document.querySelector('#form-buttons');
	this.$formCloseButton = document.querySelector('#form-close-button');
	this.$modal = document.querySelector(".modal"); // taking class so .
    this.$modalTitle = document.querySelector(".modal-title");
    this.$modalText = document.querySelector(".modal-text");
    this.$modalCloseButton =document.querySelector(".modal-close-button");
    this.$colorTooltip = document.querySelector('#color-tooltip');

    this.render();
    this.addEventListeners();
  }

  addEventListeners() {
    document.body.addEventListener('click', event => { // When you click you get event from this
      this.handleFormClick(event); // Call Handle click and pass through event
      this.selectNote(event);
      this.openModal(event);
      this.deleteNote(event);

    });

    document.body.addEventListener('mouseover', event =>{
    	this.openTooltip(event);
    });

    document.body.addEventListener('mouseout', event =>{
    	this.closeTooltip(event);
    });


     // Making position fixed on mouseover
    this.$colorTooltip.addEventListener('mouseover', function () {
    	this.style.display ='flex';

    })

    this.$colorTooltip.addEventListener('mouseout', function() {
    	this.style.display ='none';

    });

    // change background onclick

    this.$colorTooltip.addEventListener('click', event => {
    	const color = event.target.dataset.color;
    	if(color) {
    		this.editNoteColor(color);
    	}
    })


    // Listens for the enter or the submit button
    this.$form.addEventListener('submit', event => {
    	event.preventDefault();
    	const title = this.$noteTitle.value;
    	const text = this.$noteText.value;
    	const hasNote = title || text;

    	if(hasNote){
    		// add note
    		this.addNote({title, text}); // Passed as a single argument If kept in curly bracket order does not matters
    	}

    });

    // Listens for the click on the close button

    this.$formCloseButton.addEventListener('click', event => {
    	event.stopPropagation();
    	this.closeForm();
    });

    // Listens for the Modal close button

    this.$modalCloseButton.addEventListener('click', event =>{
    	this.closeModal(event);
    });
  }

  handleFormClick(event) {
    const isFormClicked = this.$form.contains(event.target); // contains holds true or false

	const title = this.$noteTitle.value;
   	const text = this.$noteText.value;
   	const hasNote = title || text;

    if (isFormClicked) {
      this.openForm();
    } else if(hasNote){
    	this.addNote({title, text}); // adds Note when clicked outside the box
    } else {
      this.closeForm();
    }
  }

  openForm() {
    this.$form.classList.add('form-open');
    this.$noteTitle.style.display = 'block';
    this.$formButtons.style.display = 'block';
  }

  closeForm() {
    this.$form.classList.remove('form-open');
    this.$noteTitle.style.display = 'none';
    this.$formButtons.style.display = 'none';
    this.$noteTitle.value = ''; // clears the note text after one submit
    this.$noteText.value ='';
  }

  openModal(event){
  	if(event.target.matches('.toolbar-delete')) return;

  	if(event.target.closest('.note')) {
  		this.$modal.classList.toggle('open-modal');
  		this.$modalTitle.value = this.title;
  		this.$modalText.value = this.text;
  	}
  }

  closeModal(event) {
  	this.editNote();
  	this.$modal.classList.toggle('open-modal');
  }

  openTooltip(event) {
  	if (!event.target.matches('.toolbar-color')) return;
  	this.id = event.target.dataset.id; // this methods gives the id without creating another
  	const noteCoords = event.target.getBoundingClientRect(); // This property  gives the specific co-ordinates
  	const horizontal = noteCoords.left;
  	const vertical = window.scrollY - 20;
  	this.$colorTooltip.style.transform = `translate(${horizontal}px, ${vertical}px`;
  	this.$colorTooltip.style.display = 'flex';

  }

  closeTooltip(event) {
  	if (!event.target.matches('.toolbar-color')) return;
  	this.$colorTooltip.style.display ='none';
  }

  addNote(note){
  	const newNote = {
  		title: note.title,
  		text: note.text,
  		color: 'white',
  		id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id +1 : 1
  	};
  	// Preserving Arrays without changing
  	this.notes = [...this.notes, newNote];
  	this.render();
  	this.closeForm();
  }

  editNote() {
  	const title = this.$modalTitle.value;
  	const text = this.$modalText.value;
  	this.notes = this.notes.map(note =>
  		note.id === Number(this.id) ? { ...note, title, text} : note
  	);
  	this.render();
  }


  editNoteColor(color) {
  	this.notes = this.notes.map(note =>
  		note.id === Number(this.id) ? { ...note, color} : note
  	);
  	this.render();

  }

  selectNote(event){
  	const $selectedNote = event.target.closest('.note');
  	if(!$selectedNote) return;
  	const [$noteTitle, $noteText] =$selectedNote.children;
  	this.title =$noteTitle.innerText;
  	this.text=$noteText.innerText;
  	this.id = $selectedNote.dataset.id;
  }

  deleteNote(event) {
  	event.stopPropagation();
  	if(!event.target.matches('.toolbar-delete')) return;
  	const id = event.target.dataset.id;
  	this.notes = this.notes.filter(note => note.id !== Number(id));
 	this.render();

  }

  render(){
  	this.saveNotes();
  	this.displayNotes();
  }

  saveNotes() {
  	localStorage.setItem('notes', JSON.stringify(this.notes))
  }

  displayNotes() {
  	const hasNotes = this.notes.length > 0;
  	this.$placeholder.style.display = hasNotes ? 'none' : 'flex';

    this.$notes.innerHTML = this.notes.map(note => `
        <div style="background: ${note.color};" class="note" data-id=${note.id}>
          <div class="${note.title && 'note-title'}">${note.title}</div>
          <div class="note-text">${note.text}</div>
          <div class="toolbar-container">
            <div class="toolbar">
              <img class="toolbar-color"  data-id =${note.id} src="https://icon.now.sh/palette">
              <img  data-id =${note.id} class="toolbar-delete" src="https://icon.now.sh/delete">
            </div>
          </div>
        </div>
     `).join(""); // .join removes comma which is present while remove the property
  }
}

new App();
