const noteApi = " http://localhost:3000/notebook";
const sheetApi = "https://sheetdb.io/api/v1/gkn02l70kt1ao";
//Selectors
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

const pageBody = document.querySelector("body");

// page reload
const pageReload = () => {
  setTimeout(() => {
    window.location.reload();
  }, 500);
};

// Main App

class NotebookApp {
  constructor() {
    this.data;
    this.selected = false;
    this.sidebarNotes;
    this.selectedId;
  }

  // Methods

  // 1 - Fetch Notebook title and date to the Sidebar card.

  fetchCard = async () => {
    const response = await fetch(sheetApi);

    const result = await response.json();

    this.data = result.sort((a, b) => {
      if (a.date > b.date) {
        return -1;
      } else if (a.date < b.date) {
        return 1;
      }
    });

    // map the data to the card
    const renderCards = this.data.map((note) => {
      return ` <div class="sidebar-card" onclick="onNoteSelect(${note.Id})" tabindex="-1">
        <div class="sidebar-card__body">
          <h2>${note.title}</h2>
          <p>${note.date}</p>
        </div >
        
        <i class="note-edit fas fa-pencil-alt" onclick="onToggleEdit(${note.Id}, '${note.title}')"></i>
        <i class="note-delete fas fa-trash-alt" onclick="onToggleDelete(${note.Id})"></i></div>
        
      </div>`;
    });

    // Render to the DOM
    notebookContainer.innerHTML = renderCards.join();
    const sidebarCard = notebookContainer.querySelectorAll(".sidebar-card");

    // Convert NodeList to Array
    const sidebarCardsArray = Array.from(sidebarCard);
    this.sidebarNotes = sidebarCardsArray;
  };

  // 2 - On Note Selection

  fetchSelectedNote = async (id) => {
    const noteData = await fetch(`${sheetApi}/search?Id=${id}`);
    const [noteResult] = await noteData.json();

    textArea.value = noteResult.note;
    noteTitle.innerHTML = noteResult.title;
    this.selectedId = id;
  };
  // 3 - Add Note Method

  addNote = async (id, title, date) => {
    const newNoteData = await fetch(sheetApi, {
      method: "POST",
      body: JSON.stringify({
        Id: id,
        title: title,
        date: date,
        note: "",
        selected: true,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontSize: "16px",
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    const newResult = await newNoteData.json();
    console.log(newResult);
  };

  // 4 - Delete Note Method

  deleteNote = async (id) => {
    await fetch(`${sheetApi}/Id/${id}`, {
      method: "DELETE",
    });
  };

  // 5 - Update title

  updateTitle = async (id, title, date) => {
    await fetch(`${sheetApi}/Id/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        title: title,
        date: date,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
  };

  // 6 - Save Note

  saveNote = async (id, note, date) => {
    await fetch(`${sheetApi}/Id/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        note: note,
        date: date,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
  };
}

// Create App

const app = new NotebookApp();

// Fetch Notebook
app.fetchCard();

// // //

// Toggle Selected note

const onNoteSelect = (id) => {
  // console.log(id);
  noteBody.classList.remove("hidden");
  app.sidebarNotes.forEach((card) => {
    card.addEventListener("focus", () => {
      card.classList.add("note-selected");
      // Save event to the note
    });
    card.addEventListener("blur", () => {
      card.classList.remove("note-selected");
    });
  });
  // Window
  window.scrollTo(0, 0);
  //fetch
  app.fetchSelectedNote(id);
  saveBtn.addEventListener("click", () => {
    if (id === app.selectedId) {
      console.log(app.selectedId);
      const updatedNote = textArea.value;
      const noteUpdatedDate = new Date().toLocaleString({
        weekday: "short",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
      app.saveNote(id, updatedNote, noteUpdatedDate);
    }
  });
};

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
  app.sidebarNotes[0].classList.add("note-selected");

  // refresh page

  pageReload();
});

// DELETE A NOTE

const onToggleDelete = (id) => {
  deleteModal.classList.remove("modal-hide");
  modalBg.classList.remove("modal-hide");
  pageBody.classList.add("no-scroll");

  // Delete Event
  deleteYesBtn.addEventListener("click", () => {
    app.deleteNote(id);

    // refresh page
    pageReload();
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
    app.updateTitle(id, updatedTitle, updatedDate);
    // refresh page
    pageReload();
  });
};

// Save note
