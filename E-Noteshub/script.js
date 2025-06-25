let notes = JSON.parse(localStorage.getItem('notes')) || [];
const uploadedFiles = new Map();

document.getElementById("noteForm").addEventListener("submit", function (e) {
  e.preventDefault();
  
  const form = e.target;
  const department = form.department.value.trim();
  const subject = form.subject.value.trim();
  const topic = form.topic.value.trim();
  const description = form.description.value.trim();
  const file = form.fileUpload.files[0];
  
  if (!department || !subject || !topic || !description || !file) {
    alert("Please fill all fields and select a file");
    return;
  }
  
  const submitBtn = document.getElementById("submitBtn");
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Uploading...';
  
  setTimeout(() => {
    const fileId = Date.now().toString();
    uploadedFiles.set(fileId, file);
    
    notes.push({
      id: fileId,
      department,
      subject,
      topic,
      description,
      file: file.name,
      date: new Date().toLocaleDateString()
    });
    
    localStorage.setItem('notes', JSON.stringify(notes));
    form.reset();
    displayNotes(notes);
    
    submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Uploaded!';
    setTimeout(() => {
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit';
      submitBtn.disabled = false;
    }, 2000);
  }, 1000);
});

document.getElementById("searchInput").addEventListener("input", function() {
  const query = this.value.toLowerCase();
  const filtered = query ? notes.filter(n => 
    n.department.toLowerCase().includes(query) || 
    n.subject.toLowerCase().includes(query) || 
    n.topic.toLowerCase().includes(query) || 
    n.description.toLowerCase().includes(query)
  ) : notes;
  
  displayNotes(filtered);
});

function displayNotes(notesToDisplay) {
  const notesList = document.getElementById("notesList");
  notesList.innerHTML = notesToDisplay.length ? 
    notesToDisplay.map(note => `
      <div class="note-card">
        <div class="department-tag">${note.department}</div>
        <h3><i class="fa-solid fa-book"></i> ${note.topic}</h3>
        <p><strong>Subject:</strong> ${note.subject}</p>
        <p><strong>Date Added:</strong> ${note.date}</p>
        <p><strong>Description:</strong> ${note.description}</p>
        <button onclick="downloadFile('${note.id}', '${note.file}')" class="download-btn">
          <i class="fa-solid fa-download"></i> Download ${note.file}
        </button>
      </div>
    `).join('') : `
    <div class="empty-state">
      <i class="fa-solid fa-book-open"></i>
      <p>No notes found. ${document.getElementById("searchInput").value ? 'Try a different search.' : 'Be the first to upload notes!'}</p>
    </div>`;
}

function downloadFile(id, filename) {
  const file = uploadedFiles.get(id);
  if (file) {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  } else {
    alert('File not found! Please upload the file again.');
  }
}

displayNotes(notes);