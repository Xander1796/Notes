"use strict";

const overlay = document.querySelector(".overlay");

const notesContainer = document.querySelector("#notes-container");

const searchInput = document.querySelector(".search-input");
const searchMessage = document.querySelector(".search-message");
const searchMessageText = document.querySelector(".search-message p");
const closeSearch = document.querySelector(".close-search");
const homeActions = document.querySelector(".home-actions");

const homeSection = document.querySelector("#home");
const homeDeleteNote = document.querySelector(".home-delete-note");
const homeNewNote = document.querySelector(".home-new-note");
const homeActionButton = document.querySelectorAll(".home-action-button");
const infoWhenDeletingNote = document.querySelector(".info-when-deleting-note");
const noNotesMessage = document.querySelector(".no-notes-message");
const editNoteSection = document.querySelector("#edit-note");
const editNoteContent = document.querySelector(".edit-note-content");
const editNoteDate = document.querySelector(".edit-note-date");

const footer = document.querySelector("footer");

const scrollToTop = function () {
  window.scrollTo({ top: 0 });
};

//METHODS FOR DATE

const getCurrentTime = function () {
  const date = new Date();

  return `Today, ${
    date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
  }:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`;
};

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const monthsOfYear = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getDate = function () {
  const date = new Date();

  return `${daysOfWeek[date.getDay()]}, ${
    date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`
  } ${monthsOfYear[date.getMonth()]} ${date.getFullYear()}`;
};

const updateDate = function (note) {
  const date = getDate();

  if (note.date === date) {
    return note.time;
  } else {
    return note.date;
  }
};

//SETTING LOCAL STORAGE

if (!localStorage.getItem("firstVisit")) {
  localStorage.setItem("firstVisit", "true");

  const firstNote = [
    {
      id: "0",
      content: "Hello there, I am your first note.",
      time: getCurrentTime(),
      date: getDate(),
    },
  ];

  localStorage.setItem("notesStorage", JSON.stringify(firstNote));
} else {
  localStorage.setItem("firstVisit", "false");
}

let notesStorage = JSON.parse(localStorage.getItem("notesStorage"));

let updateNotesStorage = function () {
  localStorage.setItem("notesStorage", JSON.stringify(notes));
};

let notes = notesStorage;

const checkIfThereAreNotes = function () {
  if (notes.length === 0) {
    noNotesMessage.classList.add("visible");
    noNotesMessage.classList.remove("hidden");
  } else {
    noNotesMessage.classList.remove("visible");
    noNotesMessage.classList.add("hidden");
  }

  if (searchInput.value !== "" && notes.length === 0) {
    noNotesMessage.classList.remove("visible");
    noNotesMessage.classList.add("hidden");
  }
};

checkIfThereAreNotes();

//COMUTING BETWEEN SECTIONS

const sections = [homeSection, editNoteSection];
let activeSection = homeSection;

const toggleSectionVisibility = function () {
  scrollToTop();

  sections.forEach((section) => {
    section.classList.remove("hidden");
    section.classList.add("hidden");
  });
  activeSection.classList.remove("hidden");
  activeSection.classList.add("visible");
};

let selectedNotesForRemoval = [];

const newNoteObject = function (id, content, time, date) {
  notes.push({
    id: id,
    content: content,
    time: time,
    date: date,
  });
};

const checkIfThereAreLineBreaks = function (note) {
  // Removing all the divs

  let cleanNote = note.content
    .replaceAll("<div>", "<br>")
    .replaceAll("</div>", "<br>");

  // Getting rid of the line breaks and selecting the first occurence of a text string

  cleanNote = cleanNote
    .split("<br>")
    .filter((a) => a.trim())[0]
    .trim();

  return cleanNote;
};

const notesMarkup = function (note, date) {
  notesContainer.insertAdjacentHTML(
    "afterbegin",
    `
         <li id="${note.id}" class="note-wrapper">
            <button class="edit-note">
                  <svg id="Outline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22.853,1.148a3.626,3.626,0,0,0-5.124,0L1.465,17.412A4.968,4.968,0,0,0,0,20.947V23a1,1,0,0,0,1,1H3.053a4.966,4.966,0,0,0,3.535-1.464L22.853,6.271A3.626,3.626,0,0,0,22.853,1.148ZM5.174,21.122A3.022,3.022,0,0,1,3.053,22H2V20.947a2.98,2.98,0,0,1,.879-2.121L15.222,6.483l2.3,2.3ZM21.438,4.857,18.932,7.364l-2.3-2.295,2.507-2.507a1.623,1.623,0,1,1,2.295,2.3Z"/>
                  </svg>
                  Edit
            </button>
         
            <div class="note">
                  <div class="note-and-date">
                     <p class="note-content">${checkIfThereAreLineBreaks(
                       note
                     )}</p>
                     <span class="note-date">${date}</span>
                  </div>

                  <button class="delete-note delete-note-inactive">
                     <svg viewBox="0 0 15 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path class="checkmark-path" d="M1 4L6 9L14.5 0.5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                     </svg>     
                  </button>
            </div>
         </li>          
      `
  );
};

const initInsertNotes = function () {
  for (let i = 0; i < notes.length; i++) {
    let date = updateDate(notes[i]);
    notesMarkup(notes[i], date);
  }
};

initInsertNotes();

const addNoteToRemovalArray = function (selectedNoteId) {
  selectedNotesForRemoval.push(selectedNoteId);
};

const removeNoteFromRemovalArray = function (selectedNoteId) {
  selectedNotesForRemoval = selectedNotesForRemoval.filter((id) => {
    if (id !== selectedNoteId) {
      return selectedNoteId;
    } else {
      return;
    }
  });
};

const infoWhenDeletingNoteFunction = function () {
  if (selectedNotesForRemoval.length > 0) {
    infoWhenDeletingNote.querySelector(".notes-selected-number").textContent =
      selectedNotesForRemoval.length <= 1
        ? `${selectedNotesForRemoval.length} note selected`
        : `${selectedNotesForRemoval.length} notes selected`;

    infoWhenDeletingNote.classList.remove("info-when-deleting-note-inactive");

    homeDeleteNote.classList.remove("home-action-button-inactive");
    homeNewNote.classList.add("home-action-button-inactive");
  }

  if (selectedNotesForRemoval.length <= 0) {
    infoWhenDeletingNote.classList.add("info-when-deleting-note-inactive");

    homeDeleteNote.classList.add("home-action-button-inactive");
    homeNewNote.classList.remove("home-action-button-inactive");
  }
};

const noNotesSelected = function () {
  selectedNotesForRemoval = [];

  notesContainer
    .querySelectorAll(".delete-note")
    .forEach((note) => note.classList.remove("delete-note-active"));
  notesContainer
    .querySelectorAll(".delete-note")
    .forEach((note) => note.classList.add("delete-note-inactive"));

  infoWhenDeletingNote.classList.add("info-when-deleting-note-inactive");

  homeDeleteNote.classList.add("home-action-button-inactive");
  homeNewNote.classList.remove("home-action-button-inactive");

  searchInputActive();
};

const deleteSelectedNotes = function () {
  //THIS FUNCTION LOOPS THROUGH THE NOTES DELETING THE SELECTED NOTES FROM BOTH LOCAL STORAGE AND FROM THE DOM

  const allNotes = notesContainer.querySelectorAll(".note-wrapper");

  for (let i = 0; i < selectedNotesForRemoval.length; i++) {
    for (let j = 0; j < notes.length; j++) {
      if (notes[j].id === selectedNotesForRemoval[i]) {
        notes.splice(j, 1);

        updateNotesStorage();
      }
    }

    for (let k = 0; k < allNotes.length; k++) {
      if (selectedNotesForRemoval[i] === allNotes[k].id) {
        allNotes[k].style.visibility = "hidden";
        allNotes[k].style.marginTop = `-${
          allNotes[k].getBoundingClientRect().height
        }px`;
        allNotes[k].addEventListener("transitionend", function () {
          allNotes[k].remove();
        });
      }
    }
  }

  noNotesSelected();
};

const focusOnNoteBlock = () => {
  setTimeout(() => {
    editNoteContent.focus();
  }, 100);
};

const formatingEditSectionForNewNote = function () {
  editNoteContent.innerHTML = "";

  editNoteSection.querySelector(".edit-note-date").innerHTML = getCurrentTime();
};

let noteThatIsBeingEditedIndex;

const isBeingEdited = function (note) {
  editNoteContent.innerHTML = note.content;
  editNoteDate.innerHTML = updateDate(notes[noteThatIsBeingEditedIndex]);

  editNoteContent.dataset.isNew = "false";
};

const searchInputInactive = function () {
  searchInput.setAttribute("readonly", "readonly");
  searchInput.classList.add("not-allowed");
};

const searchInputActive = function () {
  searchInput.removeAttribute("readonly");
  searchInput.classList.remove("not-allowed");
};

const animationForNewOrEditedNote = function () {
  const targetedNote = notesContainer.querySelectorAll(".note-and-date")[0];
  if (targetedNote) {
    targetedNote.classList.add("new-or-edited-note-anim");

    targetedNote.addEventListener("animationend", function () {
      targetedNote.classList.remove("new-or-edited-note-anim");
    });
  }
};

let selectedNote;

homeSection.addEventListener("click", function (e) {
  if (e.target.closest(".delete-note")) {
    const deleteNote = e.target.closest(".delete-note");
    deleteNote.classList.toggle("delete-note-inactive");
    deleteNote.classList.toggle("delete-note-active");

    selectedNote = deleteNote.closest(".note-wrapper");

    if (deleteNote.classList.contains("delete-note-active")) {
      addNoteToRemovalArray(selectedNote.id);

      searchInputInactive();
    }

    if (deleteNote.classList.contains("delete-note-inactive")) {
      removeNoteFromRemovalArray(selectedNote.id);

      searchInputActive();
    }

    infoWhenDeletingNoteFunction();
  }

  if (e.target.closest(".close-search")) {
    searchInput.value = "";
    searchInputFunction();
  }

  if (e.target.closest(".edit-note") || e.target.closest(".note-and-date")) {
    if (homeDeleteNote.classList.contains("home-action-button-inactive")) {
      scrollToTop();

      selectedNote = e.target.closest(".note-wrapper");

      const targetedNote = notes.find(
        (note) => note.id === e.target.closest(".note-wrapper").id
      );
      const indexOfTargetedNote = notes.indexOf(targetedNote);

      noteThatIsBeingEditedIndex = indexOfTargetedNote;

      isBeingEdited(notes[indexOfTargetedNote]);

      activeSection = editNoteSection;
      toggleSectionVisibility();
      focusOnNoteBlock();
    }
  }

  if (e.target.dataset.action === "cancel") {
    noNotesSelected();
  }

  if (e.target.dataset.action === "delete") {
    deleteSelectedNotes();
    checkIfThereAreNotes();
  }

  if (e.target.dataset.action === "select-all") {
    document.querySelectorAll(".delete-note").forEach((el) => {
      if (!el.classList.contains("delete-note-active")) {
        selectedNote = el.closest(".note-wrapper");
        el.classList.remove("delete-note-inactive");
        el.classList.add("delete-note-active");
        addNoteToRemovalArray(selectedNote.id);
      }
    });
    infoWhenDeletingNoteFunction();
  }

  if (
    e.target.closest(".home-delete-note") &&
    !e.target
      .closest(".home-delete-note")
      .classList.contains("home-action-button-inactive")
  ) {
    deleteSelectedNotes();

    checkIfThereAreNotes();
  }

  if (
    e.target.closest(".home-new-note") &&
    !e.target
      .closest(".home-new-note")
      .classList.contains("home-action-button-inactive")
  ) {
    scrollToTop();

    const allNotesAnimations = [
      ...notesContainer.querySelectorAll(".note-and-date"),
    ];
    allNotesAnimations.forEach((anim) =>
      anim.classList.remove("new-or-edited-note-anim")
    );

    editNoteContent.dataset.isNew = "true";

    formatingEditSectionForNewNote();

    activeSection = editNoteSection;
    toggleSectionVisibility();
    focusOnNoteBlock();
  }
});

const editNote = function () {
  notes[noteThatIsBeingEditedIndex].content = editNoteContent.innerHTML;
  notes[noteThatIsBeingEditedIndex].time = getCurrentTime();
  notes[noteThatIsBeingEditedIndex].date = getDate();

  selectedNote.remove();
  notesMarkup(
    notes[noteThatIsBeingEditedIndex],
    updateDate(notes[noteThatIsBeingEditedIndex])
  );

  let editedNote = notes[noteThatIsBeingEditedIndex];
  notes = notes.filter(
    (note) => note.id !== notes[noteThatIsBeingEditedIndex].id
  );
  notes.push(editedNote);

  updateNotesStorage();

  animationForNewOrEditedNote();
};

const newNoteId = function () {
  if (notes.length === 0) return "0";
  if (notes.length > 0) {
    const allNotesIds = notes.map((note) => Number(note.id));
    return (Math.max(...allNotesIds) + 1).toString();
  }
};

newNoteId();

const newNote = function () {
  newNoteObject(
    newNoteId(),
    editNoteContent.innerHTML,
    editNoteDate.innerHTML,
    getDate()
  );

  checkIfThereAreNotes();

  notesMarkup(notes[notes.length - 1], getCurrentTime());

  updateNotesStorage();

  animationForNewOrEditedNote();
};

const removeEditedEmptyNote = function () {
  const allNotes = [...notesContainer.querySelectorAll(".note-wrapper")];
  const targetedNoteForDeleting = allNotes.filter(
    (note) => note.id === notes[noteThatIsBeingEditedIndex].id
  );

  targetedNoteForDeleting[0].remove();

  notes.splice(noteThatIsBeingEditedIndex, 1);

  updateNotesStorage();
};

editNoteSection.addEventListener("click", function (e) {
  if (
    e.target.closest(".edit-note-close-button") &&
    editNoteContent.dataset.isNew === "false"
  ) {
    let isEqual =
      editNoteContent.innerHTML.trim() ===
      notes[noteThatIsBeingEditedIndex].content;

    if (!isEqual) {
      overlay.classList.add("visible");
      overlay.classList.remove("hidden");
    } else if (isEqual) {
      activeSection = homeSection;
      toggleSectionVisibility();
    }
  }

  if (
    e.target.closest(".edit-note-close-button") &&
    editNoteContent.dataset.isNew === "true"
  ) {
    let isEmpty = editNoteContent.innerText.trim() === "";

    if (!isEmpty) {
      overlay.classList.add("visible");
      overlay.classList.remove("hidden");
    } else if (isEmpty) {
      activeSection = homeSection;
      toggleSectionVisibility();
    }
  }

  if (
    e.target.closest(".edit-note-finish-edit") &&
    editNoteContent.dataset.isNew === "true"
  ) {
    let isEmpty = editNoteContent.innerText.trim() === "";
    activeSection = homeSection;
    toggleSectionVisibility();

    if (!isEmpty) {
      newNote();
    }
  }

  if (
    e.target.closest(".edit-note-finish-edit") &&
    editNoteContent.dataset.isNew === "false"
  ) {
    let isEqual =
      editNoteContent.innerHTML.trim() ===
      notes[noteThatIsBeingEditedIndex].content;
    let isEmpty = editNoteContent.innerText.trim() === "";

    if (!isEqual && !isEmpty) {
      editNote();
      activeSection = homeSection;
      toggleSectionVisibility();
    }

    if (!isEmpty && isEqual) {
      activeSection = homeSection;
      toggleSectionVisibility();
    }

    if (isEmpty) {
      overlay.classList.add("visible");
      overlay.classList.remove("hidden");
    }
  }
});

overlay.addEventListener("click", function (e) {
  if (e.target.classList.contains("overlay")) {
    this.classList.remove("visible");
    this.classList.add("hidden");
  }

  if (e.target.closest(".edit-permission-popup-button-yes")) {
    let isEmpty = editNoteContent.innerText.trim() === "";
    let isNew = editNoteContent.dataset.isNew === "true";

    if (isNew) {
      newNote();
    } else if (!isNew && isEmpty) {
      removeEditedEmptyNote();
      checkIfThereAreNotes();
    } else if (
      !isNew &&
      editNoteContent.innerHTML.trim() !==
        notes[noteThatIsBeingEditedIndex].content &&
      !isEmpty
    ) {
      editNote();
    }

    if (searchInput.value.length > 0 && notes.length === 0) {
      searchInput.value = "";
      searchInputFunction();
    }

    if (searchInput.value.length > 0 && notes.length > 0) {
      searchInputFunction();
    }
  }

  if (e.target.closest(".edit-permission-popup-button")) {
    this.classList.remove("visible");
    this.classList.add("hidden");
    activeSection = homeSection;
    toggleSectionVisibility();
  }
});

let query;
let filteredSearchResults;

const hideDeleteButtonsWhenSearching = function (query) {
  const allDeleteButtons = [...notesContainer.querySelectorAll(".delete-note")];
  if (query.length > 0) {
    allDeleteButtons.forEach((button) => button.classList.add("hidden"));
  } else {
    allDeleteButtons.forEach((button) => button.classList.remove("hidden"));
  }
};

const checkSearchQueryLength = function () {
  query = searchInput.value.toLowerCase();

  if (query.length > 0) {
    searchMessage.classList.remove("hidden");
    closeSearch.classList.remove("hidden");
    homeActions.classList.add("hidden");
  } else if (query.length <= 0) {
    searchMessage.classList.add("hidden");
    closeSearch.classList.add("hidden");
    homeActions.classList.remove("hidden");
  }
};

const filterSearchResults = function () {
  filteredSearchResults = notes.filter((character) => {
    return character.content.toLowerCase().includes(query);
  });

  if (filteredSearchResults.length < 1)
    searchMessageText.innerHTML = "No note was found.";
  if (filteredSearchResults.length > 1)
    searchMessageText.innerHTML = `${filteredSearchResults.length} notes were found.`;
  if (filteredSearchResults.length === 1)
    searchMessageText.innerHTML = "1 note was found.";
};

const displaySearchResults = function () {
  notesContainer.innerHTML = "";

  for (let i = 0; i < filteredSearchResults.length; i++) {
    let date = updateDate(filteredSearchResults[i]);
    notesMarkup(filteredSearchResults[i], date);
  }
};

const searchInputFunction = function () {
  scrollToTop();

  checkIfThereAreNotes();

  checkSearchQueryLength();

  filterSearchResults();

  displaySearchResults();

  hideDeleteButtonsWhenSearching(query);
};

searchInput.addEventListener("input", searchInputFunction);

// TEXT FORMATTING COMANDS WHEN EDITING NOTE
const editNoteActions = document.querySelector(".edit-note-actions");
const formatNoteButtons = document.querySelectorAll(
  ".edit-note-actions button"
);
const noteFontColorSvg = document.querySelector(
  ".edit-note-actions .change-color"
);
const noteFontColorInput = document.querySelector(
  ".edit-note-actions .change-color input"
);
const toggleNoteActionsBar = document.querySelector(".toggle-note-actions-bar");

toggleNoteActionsBar.addEventListener("click", () => {
  toggleNoteActionsBar.classList.toggle("expand");
  toggleNoteActionsBar.classList.toggle("collapse");
  editNoteActions.classList.toggle("expand");
  editNoteActions.classList.toggle("collapse");
});

formatNoteButtons.forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    const command = btn.dataset.element;

    if (command === "createLink") {
      e.preventDefault();
      let url = prompt("Enter the name of the link:", "https://");
      document.execCommand(command, false, url);
    } else if (command === "copy" || command === "cut") {
      const selection = document.getSelection();
      navigator.clipboard.writeText(selection);
      if (command === "cut") selection.deleteFromDocument();
    } else if (command === "paste") {
      let text = await navigator.clipboard.readText();

      let sel = window.getSelection();
      let range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
    } else {
      document.execCommand(command, false, null);
    }
  });
});

noteFontColorInput.addEventListener("input", () => {
  noteFontColorSvg.style.fill = noteFontColorInput.value;
  document.execCommand("foreColor", false, noteFontColorInput.value);
});

document.querySelector(".download-note-btn").addEventListener("click", () => {
  const a = document.createElement("a");
  const blob = new Blob([editNoteContent.innerText]);
  const dataUrl = URL.createObjectURL(blob);
  a.href = dataUrl;
  let documentName = prompt("Name of the document:", "Untitled");
  a.download = documentName;
  if (documentName) a.click();
});

document.querySelector(".font-size-range").addEventListener("input", (e) => {
  document.execCommand("fontSize", null, e.target.value);
});

editNoteContent.addEventListener("blur", (e) => {
  e.preventDefault();
  editNoteContent.focus();
});

//OPTIONS FOR DELETING WHEN A NOTE IS SELECTED
const btnDeletingOptions = document.querySelector(".btn-deleting-options");
const deletingOptionsBtns = document.querySelectorAll(
  ".deleting-options button"
);

deletingOptionsBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    btnDeletingOptions.classList.remove("open");
  });

  btn.addEventListener("blur", () => {
    setTimeout(() => {
      if (!document.activeElement.closest(".info-when-deleting-note")) {
        btnDeletingOptions.classList.remove("open");
      }
    }, 0);
  });
});

btnDeletingOptions.addEventListener("click", () => {
  btnDeletingOptions.classList.toggle("open");
});

btnDeletingOptions.addEventListener("blur", () => {
  setTimeout(() => {
    if (!document.activeElement.closest(".info-when-deleting-note")) {
      btnDeletingOptions.classList.remove("open");
    }
  }, 0);
});
