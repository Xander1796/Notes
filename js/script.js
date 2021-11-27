'use strict';

// document.querySelector('.delete-note').addEventListener('click', function() {
//    this.classList.toggle('delete-note-active')
//    this.classList.toggle('delete-note-inactive')
// });

const notesContainer = document.querySelector('#notes-container');
const homeSection = document.querySelector('#home');
const homeDeleteNote = document.querySelector('.home-delete-note');
const infoWhenDeletingNote = document.querySelector('.info-when-deleting-note');
const searchSection = document.querySelector('#home-section');


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

const notes = [{
   id: '0',
   content: "Hello there, this is your first note.",
   time: getCurrentTime(),
   date: getDate(),
   selectedForRemoving: false,
},
{
   id: '1',
   content: "Hello there, this is your second note.",
   time: getCurrentTime(),
   date: getDate(),
   selectedForRemoving: false, 
},

{
   id: '2',
   content: "Hello there, this is your third note.",
   time: getCurrentTime(),
   date: getDate(),
   selectedForRemoving: false, 
}
]

let selectedNotesForRemoval = [];

      
const newNote = function(id, content, time,  date) {
   notes.push({
      id: id,
      content: content,
      date: date,
      time: time,
      selectedForRemoving: false
   });
};


   const notesMarkup = function (note, date) {
      notesContainer.insertAdjacentHTML('afterbegin', `
         <div id="${note.id}" class="note-wrapper">
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
         </div>          
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
         infoWhenDeletingNote.querySelector('.notes-selected-number').textContent = selectedNotesForRemoval.length <= 1 ? `${selectedNotesForRemoval.length} item selected` : `${selectedNotesForRemoval.length} items selected`;

         infoWhenDeletingNote.classList.remove('info-when-deleting-note-inactive');

         homeDeleteNote.classList.remove('home-delete-note-inactive');
      };

      if(selectedNotesForRemoval.length <= 0) {
         infoWhenDeletingNote.classList.add('info-when-deleting-note-inactive');

         homeDeleteNote.classList.add('home-delete-note-inactive');
      };
   }


   const noNotesSelected = function() {
         selectedNotesForRemoval = [];

         notesContainer.querySelectorAll('.delete-note').forEach(note => note.classList.remove('delete-note-active'));
         notesContainer.querySelectorAll('.delete-note').forEach(note => note.classList.add('delete-note-inactive'));

         infoWhenDeletingNote.classList.add('info-when-deleting-note-inactive');

         homeDeleteNote.classList.add('home-delete-note-inactive');
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


   homeSection.addEventListener('click', function(e) {
      let selectedNote;
      
      if(e.target.classList.contains('delete-note') || e.target.closest('.delete-note')) {
         const deleteNote = e.target.closest('.delete-note');
         deleteNote.classList.toggle('delete-note-inactive');
         deleteNote.classList.toggle('delete-note-active');

         selectedNote = deleteNote.closest('.note-wrapper');

         if(deleteNote.classList.contains('delete-note-active')) {
            addNoteToRemovalArray(selectedNote.id);
         };

         if(deleteNote.classList.contains('delete-note-inactive')) {
            removeNoteFromRemovalArray(selectedNote.id);
         };

         infoWhenDeletingNoteFunction();
         
      };
  
      if(e.target.classList.contains('cancel-note-deleting') || e.target.closest('.cancel-note-deleting')) {
         noNotesSelected();
      }
      console.log(e.target)

      if(e.target.classList.contains('home-delete-note') || e.target.closest('.home-delete-note')) {
         deleteSelectedNotes();
         console.log('uu')
      }

   });





