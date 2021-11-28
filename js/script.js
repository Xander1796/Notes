'use strict';

// document.querySelector('.delete-note').addEventListener('click', function() {
//    this.classList.toggle('delete-note-active')
//    this.classList.toggle('delete-note-inactive')
// });

const notesContainer = document.querySelector('#notes-container');

const searchMessage = document.querySelector('.search-message');
const searchMessageText = document.querySelector('.search-message p');
const closeSearch = document.querySelector('.close-search');
const homeActions = document.querySelector('.home-actions');

const homeSection = document.querySelector('#home');
const homeDeleteNote = document.querySelector('.home-delete-note');
const homeNewNote = document.querySelector('.home-new-note');
const homeActionButton = document.querySelectorAll('.home-action-button');
const infoWhenDeletingNote = document.querySelector('.info-when-deleting-note');
const editNoteSection = document.querySelector('#edit-note');
const editNoteContent = document.querySelector('.edit-note-content');
const editNoteDate = document.querySelector('.edit-note-date');


const sections = [homeSection, editNoteSection];
let activeSection = homeSection;

const toggleSectionVisibility = function() {
   sections.forEach(section => section.classList.add('hidden'));
   activeSection.classList.remove('hidden');
}

toggleSectionVisibility();


const getCurrentTime = function() {
   const date = new Date();
   
   return `Today, ${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`;
};

const getDate = function() {
   const date = new Date();
   
   return `${date.getDate()}.${Number(date.getMonth() + 1)}.${date.getFullYear()}`;
};

const updateDate = function(note) {
   const date = getDate();

   if(note.date === date){
      return note.time;
   } else {
      return note.date;
   };
};

let notes = [{
   id: '0',
   content: "Hello there, this is your first note.",
   time: getCurrentTime(),
   date: getDate(),
   isBeingEdited: false,
},
{
   id: '1',
   content: "Hello there, this is your second note.",
   time: getCurrentTime(),
   date: getDate(),
   isBeingEdited: false, 
},

{
   id: '2',
   content: "Hello there, this is your third note.",
   time: getCurrentTime(),
   date: getDate(),
   isBeingEdited: false, 
}
]

let selectedNotesForRemoval = [];

      
const newNote = function(id, content, time,  date) {
   notes.push ({
      id: id,
      content: content,
      time: time,
      date: date,
      isBeingEdited: false
   });
};


   const notesMarkup = function (note, date) {
      notesContainer.insertAdjacentHTML('afterbegin', `
         <li id="${note.id}" class="note-wrapper">
            <button class="edit-note">
                  <svg id="Outline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22.853,1.148a3.626,3.626,0,0,0-5.124,0L1.465,17.412A4.968,4.968,0,0,0,0,20.947V23a1,1,0,0,0,1,1H3.053a4.966,4.966,0,0,0,3.535-1.464L22.853,6.271A3.626,3.626,0,0,0,22.853,1.148ZM5.174,21.122A3.022,3.022,0,0,1,3.053,22H2V20.947a2.98,2.98,0,0,1,.879-2.121L15.222,6.483l2.3,2.3ZM21.438,4.857,18.932,7.364l-2.3-2.295,2.507-2.507a1.623,1.623,0,1,1,2.295,2.3Z"/>
                  </svg>
                  Edit
            </button>
         
            <div class="note">
                  <div class="note-and-date">
                     <p class="note-content">${note.content}</p>
                     <span class="note-date">${date}</span>
                  </div>

                  <button class="delete-note delete-note-inactive">
                     <svg viewBox="0 0 15 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path class="checkmark-path" d="M1 4L6 9L14.5 0.5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                     </svg>     
                  </button>
            </div>
         </li>          
      `);
   };

   const insertNotes = function() {
      for(let i = 0; i < notes.length; i++) {
         let date = updateDate(notes[i]);
         notesMarkup(notes[i], date);
      }
   }

   insertNotes();



   const addNoteToRemovalArray = function(selectedNoteId) {
      selectedNotesForRemoval.push(selectedNoteId);
   };

   const removeNoteFromRemovalArray = function(selectedNoteId) {

      selectedNotesForRemoval = selectedNotesForRemoval.filter(id => {
         
         if(id !== selectedNoteId) {
            return selectedNoteId;
         } else {
            return;
         };
      });

   };

   const infoWhenDeletingNoteFunction = function() {
      if(selectedNotesForRemoval.length > 0) {
         infoWhenDeletingNote.querySelector('.notes-selected-number').textContent = selectedNotesForRemoval.length <= 1 ? `${selectedNotesForRemoval.length} note selected` : `${selectedNotesForRemoval.length} notes selected`;

         infoWhenDeletingNote.classList.remove('info-when-deleting-note-inactive');

         homeDeleteNote.classList.remove('home-action-button-inactive');
         homeNewNote.classList.add('home-action-button-inactive');
      };

      if(selectedNotesForRemoval.length <= 0) {
         infoWhenDeletingNote.classList.add('info-when-deleting-note-inactive');

         homeDeleteNote.classList.add('home-action-button-inactive');
         homeNewNote.classList.remove('home-action-button-inactive');
      };
   }


   const noNotesSelected = function() {
         selectedNotesForRemoval = [];

         notesContainer.querySelectorAll('.delete-note').forEach(note => note.classList.remove('delete-note-active'));
         notesContainer.querySelectorAll('.delete-note').forEach(note => note.classList.add('delete-note-inactive'));

         infoWhenDeletingNote.classList.add('info-when-deleting-note-inactive');

         homeDeleteNote.classList.add('home-action-button-inactive');
         homeNewNote.classList.remove('home-action-button-inactive');

         searchInputActive();
   };

   
   const deleteSelectedNotes = function() {
      const allNotes = notesContainer.querySelectorAll('.note-wrapper');

      for(let i = 0; i < selectedNotesForRemoval.length; i++) {

         for(let j = 0; j < notes.length; j++) {
            if(notes[j].id === selectedNotesForRemoval[i]) {
               notes.splice(j, 1);
            };
         };

         for(let k = 0; k < allNotes.length; k++) {
            if(selectedNotesForRemoval[i] === allNotes[k].id) allNotes[k].remove();
         }

      };

      noNotesSelected();

   };

   const formatingEditSectionForNewNote = function() {
      editNoteContent.innerText = '';

      editNoteSection.querySelector('.edit-note-date').innerText = getCurrentTime();
   }

   let noteThatIsBeingEditedIndex;

   const editNote = function(note) {
      editNoteContent.innerText = note.content;
      editNoteDate.innerText = updateDate(notes[noteThatIsBeingEditedIndex]);

      editNoteContent.dataset.isNew = 'false';
   };

   const searchInputInactive = function() {
      searchInput.setAttribute('readonly', 'readonly');
      searchInput.classList.add('not-allowed');
   }

   const searchInputActive = function() {
      searchInput.removeAttribute('readonly');
      searchInput.classList.remove('not-allowed');
   }


   let selectedNote;

   homeSection.addEventListener('click', function(e) {
      
      if(e.target.closest('.delete-note')) {
         const deleteNote = e.target.closest('.delete-note');
         deleteNote.classList.toggle('delete-note-inactive');
         deleteNote.classList.toggle('delete-note-active');

         searchInputInactive();

         selectedNote = deleteNote.closest('.note-wrapper');

         if(deleteNote.classList.contains('delete-note-active')) {
            addNoteToRemovalArray(selectedNote.id);
         };

         if(deleteNote.classList.contains('delete-note-inactive')) {
            removeNoteFromRemovalArray(selectedNote.id);
         };

         infoWhenDeletingNoteFunction();
         
      };

      if(e.target.closest('.close-search')) {
         searchInput.value = '';
         searchInputFunction();
      };

      if(e.target.closest('.edit-note') || e.target.closest('.note-and-date')) {

         if(homeDeleteNote.classList.contains('home-action-button-inactive')) {
            selectedNote = e.target.closest('.note-wrapper');
   
            const targetedNote = notes.find(note => note.id === e.target.closest('.note-wrapper').id);
            const indexOfTargetedNote = notes.indexOf(targetedNote);
   
            noteThatIsBeingEditedIndex = indexOfTargetedNote;
   
            editNote(notes[indexOfTargetedNote]);
   
   
            activeSection = editNoteSection;
            toggleSectionVisibility();
         }

      };
  
      if(e.target.closest('.cancel-note-deleting')) {
         noNotesSelected();
      }

      if(e.target.closest('.home-delete-note') && !e.target.closest('.home-delete-note').classList.contains('home-action-button-inactive')) {
         deleteSelectedNotes();
      }

      if(e.target.closest('.home-new-note') && !e.target.closest('.home-new-note').classList.contains('home-action-button-inactive')) {
         editNoteContent.dataset.isNew = 'true';

         formatingEditSectionForNewNote();

         activeSection = editNoteSection;
         toggleSectionVisibility();
      }

   });

   editNoteSection.addEventListener('click', function(e) {
      if(e.target.closest('.edit-note-finish-edit') || e.target.closest('.edit-note-close-button')) {

         activeSection = homeSection;
         toggleSectionVisibility();

         if(editNoteContent.innerText.trim() !== "" && editNoteContent.dataset.isNew === 'true') {

            const notesArrayItsEmpty = notes.length > 0;

            const newNoteId = notesArrayItsEmpty ? (Number(notes[notes.length - 1].id) + 1).toString() : '0';

            newNote(newNoteId, editNoteContent.innerText, editNoteDate.innerText,  getDate());

            notesMarkup(notes[notes.length - 1], getCurrentTime());
         }

         if(editNoteContent.dataset.isNew === 'false') {
            activeSection = homeSection;
            toggleSectionVisibility();

            if(editNoteContent.innerText.trim() !== notes[noteThatIsBeingEditedIndex].content) {
               notes[noteThatIsBeingEditedIndex].content = editNoteContent.innerText;
               notes[noteThatIsBeingEditedIndex].time = getCurrentTime();
               notes[noteThatIsBeingEditedIndex].date = getDate();

               
               selectedNote.remove();
               notesMarkup(notes[noteThatIsBeingEditedIndex], updateDate(notes[noteThatIsBeingEditedIndex]));

               let editedNote = notes[noteThatIsBeingEditedIndex];
               notes = notes.filter(note => note.id !== notes[noteThatIsBeingEditedIndex].id);
               notes.unshift(editedNote);
            }
         }
      }
   });


   const searchInput = document.querySelector('.search-input');
   let query;
   let filteredSearchResults;

   const checkSearchQueryLength = function() {
      query = searchInput.value.toLowerCase();

      if(query.length > 0) {
         searchMessage.classList.remove('hidden');
         closeSearch.classList.remove('hidden');
         homeActions.classList.add('hidden');
      } else if(query.length <= 0) {
         searchMessage.classList.add('hidden');
         closeSearch.classList.add('hidden');
         homeActions.classList.remove('hidden');
      };

   };

   const filterSearchResults = function() {
      filteredSearchResults = notes.filter((character) => {
         return character.content.toLowerCase().includes(query);
      });

      if(filteredSearchResults.length < 1) searchMessageText.innerText = 'No note was found.';
      if(filteredSearchResults.length > 1) searchMessageText.innerText = `${filteredSearchResults.length} notes were found.`;
      if(filteredSearchResults.length === 1) searchMessageText.innerText = '1 note was found.';
   }

   const displaySearchResults = function () {
      notesContainer.innerHTML = "";

      for(let i = 0; i < filteredSearchResults.length; i++) {
         let date = updateDate(filteredSearchResults[i]);
         notesMarkup(filteredSearchResults[i], date);
         console.log(filteredSearchResults[i]);
      };
   }

   const searchInputFunction = function() {
      console.log(searchInput.value)
      checkSearchQueryLength();

      filterSearchResults();
      
      displaySearchResults();
   };

   searchInput.addEventListener('input', searchInputFunction);




