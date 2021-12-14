const noteApi = " http://localhost:3000/notebook";
const darkModeApi = "http://localhost:3000/dark";

const apiUrl =
  "https://script.google.com/macros/s/AKfycbypWYG3Dbw1eziCA-kdMw0U1s0YG5NLMp0vbSQKc6Q242msTIhjEmKd_YPIG6K4qNT0rw/exec";
const noteSheet = "notebook";
const darkModeSheet = "dark";

//Selectors
const pageHeader = document.querySelector(".notebook-header");
const notebookContainer = document.querySelector(".notebook-sidebar");
const textArea = document.querySelector(".note__text-area");
const noteBody = document.querySelector(".notebook-body");
const noteTitle = document.querySelector(".note-body__title");
const addBtn = document.querySelector(".add-note__btn");
const modalBg = document.querySelector(".modal-bg");
const newNoteModal = document.querySelector(".add-note__modal");
const newNoteInput = document.querySelector(".add-note__input");
const cancelBtn = document.querySelector(".modal-cancel");
const createBtn = document.querySelector(".modal-save");
const deleteModal = document.querySelector(".delete-note__modal");
const deleteYesBtn = document.querySelector(".modal-yes");
const deleteNoBtn = document.querySelector(".modal-no");
const editModal = document.querySelector(".edit-note__modal");
const editInput = document.querySelector(".edit-note__input");
const editCancel = document.querySelector(".edit-cancel");
const editSave = document.querySelector(".edit-save");
const saveBtn = document.querySelector(".note-save__btn");
const shareBtn = document.querySelector(".note-share");
// select options
const fontFamily = document.querySelector("#font-family");
const fontSize = document.querySelector("#font-size");

const pageBody = document.querySelector("body");

//
const darkModeToggler = document.querySelector("#dark-mode");
const notebookHeader = document.querySelector(".notebook-header");
const notebookHeaderTitle = document.querySelector(".notebook-header__title");
const notebookTools = document.querySelector(".notebook-body__tools");
const backArrow = document.querySelector(".fa-arrow-left");

let maxSize = window.matchMedia("(max-width: 690px)");
// page reload

const refresh = () => {
  fetchDarkMode();
};

// Main App

class NotebookApp {
  constructor() {
    this.data = [];
    this.selected = false;
    this.sidebarNotes;
    this.selectedId;
    this.selectedFontSize = "16px";
    this.noteStorage = window.localStorage;
  }

  // Methods

  // 1 - Fetch Notebook title and date to the Sidebar card.

  fetchCard = () => {
    const resultArray = JSON.parse(this.noteStorage.getItem("notebook"));

    this.data =
      resultArray &&
      resultArray.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });

    const renderCards =
      this.data &&
      this.data.map((note) => {
        return ` <div class="sidebar-card" onclick="onNoteSelect(${note.id})" tabindex="-1" data-id = ${note.id}>
<div class="sidebar-card__body">
<h2>${note.title}</h2>
<p>${note.date}</p>
</div >

<i class="note-edit fas fa-pencil-alt" onclick="onToggleEdit(${note.id}, '${note.title}')"></i>
<i class="note-delete fas fa-trash-alt" onclick="onToggleDelete(${note.id})"></i></div>

</div>`;
      });

    // Render to the DOM
    notebookContainer.innerHTML = this.data && renderCards.join("");
    const sidebarCard = notebookContainer.querySelectorAll(".sidebar-card");

    // Convert NodeList to Array

    this.sidebarNotes = Array.from(sidebarCard);
  };

  // Render Method

  // 2 - On Note Selection

  fetchSelectedNote = (id) => {
    const noteResult = this.data.filter((note) => id === note.id)[0];

    textArea.value = noteResult.note;
    noteTitle.innerHTML = noteResult.title;
    this.selectedId = id;
    textArea.style.fontSize = noteResult.fontSize;
    textArea.style.fontFamily = noteResult.fontFamily;

    // display selected font-size to the ui
    const fontSizeOptions = fontSize.options;
    for (let size, i = 0; (size = fontSizeOptions[i]); i++) {
      if (size.value == noteResult.fontSize) {
        fontSize.selectedIndex = i;
        break;
      }
    }

    // display selected font-family to the ui
    const fontFamilyOptions = fontFamily.options;
    for (let family, j = 0; (family = fontFamilyOptions[j]); j++) {
      if (family.value == noteResult.fontFamily) {
        fontFamily.selectedIndex = j;
      }
    }

    // Style Selection

    this.sidebarNotes.forEach((card) => {
      if (card.getAttribute("data-id") == id) {
        card.classList.add("note-selected");
      } else {
        card.classList.remove("note-selected");
      }
    });
  };
  // 3 - Add Note Method

  addNote = (id, title, date) => {
    const objData = {
      id: id,
      title: title,
      date: date,
      note: "",
      selected: true,
      fontFamily: "sans-serif",
      fontSize: "16px",
    };
    if (!this.data) {
      this.data = [objData];
      this.noteStorage.setItem("notebook", JSON.stringify(this.data));
    } else {
      this.data = [...this.data, objData];
      this.noteStorage.setItem("notebook", JSON.stringify(this.data));
    }
  };

  // 4 - Delete Note Method

  deleteNote = (id) => {
    this.data = this.data.filter((note) => id !== note.id);
    this.noteStorage.setItem("notebook", JSON.stringify(this.data));
  };

  // 5 - Update title

  updateTitle = (title, date) => {
    // console.log(this.selectedId);
    const noteToUpdate = this.data.find((note) => this.selectedId === note.id);

    noteToUpdate.title = title;
    noteToUpdate.date = date;
    const otherNotes = this.data.filter((note) => this.selectedId !== note.id);
    this.data = [...otherNotes, noteToUpdate];
    this.noteStorage.setItem("notebook", JSON.stringify(this.data));

    noteTitle.textContent = title;
  };

  // 6 - Save Note

  saveNote = async (id, note, date, size, family) => {
    const [noteSelected] = this.data.filter((note) => id === note.id);

    noteSelected.date = date;
    noteSelected.note = note;
    noteSelected.fontSize = size;
    noteSelected.fontFamily = family;

    const otherNotes = this.data.filter((note) => note.id !== id);
    this.data = [...otherNotes, noteSelected];
    this.noteStorage.setItem("notebook", JSON.stringify(this.data));
  };
}

// Create App

const app = new NotebookApp();

// Fetch Notebook

// // //

// Toggle Selected note

function onNoteSelect(id) {
  noteBody.classList.remove("hidden");

  // Window

  if (maxSize.matches) {
    const rect = noteBody.getBoundingClientRect();

    pageHeader.classList.add("hide-element");
    noteBody.classList.remove("hide-element");

    window.scrollTo(rect.left, 0);
    notebookContainer.classList.add("hide-element");
  } else {
    window.scrollTo(0, 0);

    pageHeader.classList.remove("hide-element");
  }

  //fetch
  app.fetchSelectedNote(id);

  // save note function
  const onSaveNote = () => {
    if (id === app.selectedId) {
      const updatedNote = textArea.value;
      const noteUpdatedDate = new Date().toLocaleString({
        weekday: "short",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
      const newFontSize = fontSize.value;
      const newFontFamily = fontFamily.value;
      app.saveNote(
        id,
        updatedNote,
        noteUpdatedDate,
        newFontSize,
        newFontFamily
      );
    }
  };
  saveBtn.addEventListener("click", () => {
    onSaveNote();
  });

  // Helper Function for saving a note when a user stops typing.
  const debounce = function (fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  };

  textArea.addEventListener(
    "keyup",
    debounce(() => {
      onSaveNote();
    }, 1000)
  );

  fontSize.addEventListener("change", () => {
    textArea.style.fontSize = fontSize.value;
  });

  // font-family
  fontFamily.addEventListener("change", () => {
    textArea.style.fontFamily = fontFamily.value;
  });
}

// Add Note event
addBtn.addEventListener("click", () => {
  modalBg.classList.remove("modal-hide");
  newNoteModal.classList.remove("modal-hide");
  pageBody.classList.add("no-scroll");
  // newNoteInput.focus();
});
[
  modalBg,
  cancelBtn,
  createBtn,
  deleteNoBtn,
  deleteYesBtn,
  editCancel,
  editSave,
].forEach((node) => {
  node.addEventListener("click", () => {
    modalBg.classList.add("modal-hide");
    newNoteModal.classList.add("modal-hide");
    pageBody.classList.remove("no-scroll");
    //delete Modal
    deleteModal.classList.add("modal-hide");
    //edit modal
    editModal.classList.add("modal-hide");
  });
});

// Create New Note

createBtn.addEventListener("click", () => {
  const newId = Date.now();
  const newNoteTitle = newNoteInput.value;
  const createdDate = new Date().toLocaleString({
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  app.addNote(newId, newNoteTitle, createdDate);

  noteBody.classList.remove("hidden");
  textArea.focus();

  // window
  noteBody.classList.add("hidden");

  // refresh page
  refresh();
});

// DELETE A NOTE

const onToggleDelete = (id) => {
  deleteModal.classList.remove("modal-hide");
  modalBg.classList.remove("modal-hide");
  pageBody.classList.add("no-scroll");

  // Delete Event
  deleteYesBtn.addEventListener("click", () => {
    app.deleteNote(id);
    noteTitle.innerHTML = "";

    // window
    noteBody.classList.add("hide-element");
    pageHeader.classList.remove("hide-element");

    window.scrollTo(0, 0);
    notebookContainer.classList.remove("hide-element");

    // refresh page
    refresh();
  });
};

// EDIT NOTE TITLE

const onToggleEdit = (id, title) => {
  editModal.classList.remove("modal-hide");
  editInput.value = title;
  editInput.focus();
  modalBg.classList.remove("modal-hide");
  pageBody.classList.add("no-scroll");

  // update event
  editSave.addEventListener("click", () => {
    const updatedTitle = editInput.value;
    const updatedDate = new Date().toLocaleString({
      weekday: "short",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    app.updateTitle(updatedTitle, updatedDate);

    // refresh page
    refresh();
  });
};

// Save note

// font-size

// Dark-Mode

// Dark Mode toggling

const onToggleDarkMode = () => {
  if (darkModeToggler.checked) {
    pageBody.classList.add("dark-mode-1");
    app.sidebarNotes &&
      app.sidebarNotes.forEach((card) => {
        card.classList.add("dark-mode-2");
      });
    notebookHeader.classList.add("dark-mode-2");
    notebookHeaderTitle.classList.add("dark-mode__title");
    notebookTools.classList.add("dark-mode__tools");
    textArea.classList.add("dark-mode__note");
    fontFamily.classList.add("dark-mode__inputs");
    fontSize.classList.add("dark-mode__inputs");
    saveBtn.classList.add("dark-mode__inputs");
    newNoteModal.classList.add("dark-mode__inputs");
    editModal.classList.add("dark-mode__inputs");
    deleteModal.classList.add("dark-mode__inputs");
    newNoteInput.classList.add("dark-mode__inputs");
    editInput.classList.add("dark-mode__inputs");
  } else {
    pageBody.classList.remove("dark-mode-1");
    app.sidebarNotes &&
      app.sidebarNotes.forEach((card) => {
        card.classList.remove("dark-mode-2");
      });
    notebookHeader.classList.remove("dark-mode-2");
    notebookHeaderTitle.classList.remove("dark-mode__title");
    notebookTools.classList.remove("dark-mode__tools");
    textArea.classList.remove("dark-mode__note");
    fontFamily.classList.remove("dark-mode__inputs");
    fontSize.classList.remove("dark-mode__inputs");
    saveBtn.classList.remove("dark-mode__inputs");
    newNoteModal.classList.remove("dark-mode__inputs");
    editModal.classList.remove("dark-mode__inputs");
    deleteModal.classList.remove("dark-mode__inputs");
    newNoteInput.classList.remove("dark-mode__inputs");
    editInput.classList.remove("dark-mode__inputs");
  }
};

// dark mode Api
const fetchDarkMode = async () => {
  const darkResponse = window.localStorage.getItem("dark");
  const darkData = JSON.parse(darkResponse);
  await app.fetchCard();
  darkModeToggler.checked = darkData && darkData.darkMode;
  onToggleDarkMode();
  // console.log(darkData);
};

// Update Dark-mode Api

const updateDarkMode = (checked) => {
  const darkData = {
    darkMode: checked,
  };
  window.localStorage.setItem("dark", JSON.stringify(darkData));
};

// Toogle Dark-mode

darkModeToggler.addEventListener("change", () => {
  onToggleDarkMode();
  updateDarkMode(darkModeToggler.checked);
});

// Share Note

const shareData = {
  title: noteTitle.innerHTML,
  text: textArea.value,
  url: "",
};

shareBtn.addEventListener("click", async () => {
  if (navigator.share)
    try {
      await navigator.share(shareData);
    } catch (error) {
      alert(`Error: ${error}`);
    }
});

// Small screen responsive 690px

const responsivePage = (size) => {
  if (size.matches) {
    // console.log("small screen");
    notebookContainer.style.width = "80%";
    noteBody.classList.add("hide-element");
    backArrow.classList.remove("hide-element");
    // onClick
  } else {
    notebookContainer.style.width = "360px";
    noteBody.style.width = "75%";
    noteBody.classList.remove("hide-element");
    backArrow.classList.add("hide-element");
  }
};

responsivePage(maxSize);
maxSize.addEventListener("change", responsivePage);

fetchDarkMode();

// Back Arrow onClick

backArrow.addEventListener("click", () => {
  window.scrollTo(0, 0);
  pageHeader.classList.remove("hide-element");
  noteBody.classList.add("hide-element");
  notebookContainer.classList.remove("hide-element");
});
