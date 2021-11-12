const noteApi = " http://localhost:3000/notebook";
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

const pageBody = document.querySelector("body");

// Main App

class NotebookApp {
  constructor() {
    this.data;
    this.selected = false;
    this.sidebarNotes;
  }

  // Methods

  // 1 - Fetch Notebook title and date to the Sidebar card.

  fetchCard = async () => {
    const response = await fetch(noteApi);
    const result = await response.json();
    this.data = result.sort((a, b) => {
      if (a.date > b.date) {
        return -1;
      } else if (a.date < b.date) {
        return 1;
      }
    });

    // map the data to the card
    const renderCards =
      this.data &&
      this.data.map((note) => {
        return ` <div class="sidebar-card" onclick="onNoteSelect(${note.id})" tabindex="-1">
        <div class="sidebar-card__body">
          <h2>${note.title}</h2>
          <p>${note.date}</p>
        </div>

        <i class="note-delete fas fa-trash-alt"></i>
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
    const noteData = await fetch(`${noteApi}/${id}`);
    const noteResult = await noteData.json();

    textArea.value = noteResult.note;
    noteTitle.innerHTML = noteResult.title;
  };
  // 3 - Add Note Method

  addNote = async (title, date) => {
    await fetch(noteApi, {
      method: "POST",
      body: JSON.stringify({
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
  };
}

// Create App

const app = new NotebookApp();

// Fetch Notebook
app.fetchCard();

// Toggle Selected note

const onNoteSelect = (id) => {
  noteBody.classList.remove("hidden");
  app.sidebarNotes.forEach((card) => {
    card.addEventListener("focus", () => {
      card.classList.add("note-selected");
    });
    card.addEventListener("blur", () => {
      card.classList.remove("note-selected");
    });
  });
  // Window
  window.scrollTo(0, 0);
  //fetch

  app.fetchSelectedNote(id);
};

// Add Note event
addBtn.addEventListener("click", () => {
  modalBg.classList.remove("modal-hide");
  newNoteModal.classList.remove("modal-hide");
  pageBody.classList.add("no-scroll");
  // newNoteInput.focus();
});
[modalBg, cancelBtn, createBtn].forEach((node) => {
  node.addEventListener("click", () => {
    modalBg.classList.add("modal-hide");
    newNoteModal.classList.add("modal-hide");
    pageBody.classList.remove("no-scroll");
  });
});

// Create New Note

createBtn.addEventListener("click", () => {
  const newNoteTitle = newNoteInput.value;
  const createdDate = new Date().toLocaleString({
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  app.addNote(newNoteTitle, createdDate);

  noteBody.classList.remove("hidden");
  textArea.focus();
  app.sidebarNotes[0].classList.add("note-selected");
});
