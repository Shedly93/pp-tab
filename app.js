document.addEventListener("DOMContentLoaded", function () {
    const openModalButton = document.getElementById("ajou-modal");
    const modal = document.getElementById("modal");

    openModalButton.addEventListener("click", function () {
        modal.style.display = "block";
        console.log('Modal Affiché');
    });


    const closeModal = document.getElementById("closeModal");
    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
        console.log('Modal Fermé');
    });

    const addForm = document.getElementById("addForm");
    const editForm = document.getElementById("upForm");
    const tabBody = document.getElementById("tab-body");

    addForm.addEventListener("submit", function (e) {
        e.preventDefault();
        studentManager.saveStudent(e);
        modal.style.display = "none";
    });

    editForm.addEventListener("submit", function (e) {
        e.preventDefault();
        studentManager.updateStudent(e);
    });

    tabBody.addEventListener("click", function (event) {
        if (event.target.classList.contains("edit")) {
            const index = event.target.getAttribute("data-index");
            studentManager.editStudent(index);
        } else if (event.target.classList.contains("delete")) {
            const index = event.target.getAttribute("data-index");
            studentManager.deleteStudent(index);
        }
    });

    const studentManager = new StudentManager();
});

class StudentManager {
    constructor() {
        this.students = [];
        this.loadStudents();
        this.remplitab();
        this.addForm = document.getElementById('addForm');
        this.editForm = document.getElementById('upForm');
        this.editIndex = null;
    }

    loadStudents() {
        const storedStudents = JSON.parse(localStorage.getItem('students'));
        this.students = storedStudents || [];
    }

    resetForm(form) {
        form.reset();
    }

    saveStudent(e) {
        e.preventDefault();

        const nomPrenom = document.getElementById('nomPrenom').value;
        const noteDS1 = parseFloat(document.getElementById('noteDS1').value);
        const examen1 = parseFloat(document.getElementById('examen1').value);
        const noteDS2 = parseFloat(document.getElementById('noteDS2').value);
        const examen2 = parseFloat(document.getElementById('examen2').value);

        const moyenne1 = (noteDS1 + examen1) / 2;
        const moyenne2 = (noteDS2 + examen2) / 2;
        const moyenneFinale = (moyenne1 + moyenne2) / 2;

        if (!isNaN(noteDS1) && !isNaN(examen1) && !isNaN(noteDS2) && !isNaN(examen2)) {
            const student = {
                nomPrenom,
                noteDS1,
                examen1,
                noteDS2,
                examen2,
                moyenne1,
                moyenne2,
                moyenneFinale,
            };

            this.students.push(student);
            localStorage.setItem('students', JSON.stringify(this.students));

            alert('Étudiant ajouté avec succès');
            this.remplitab();
            this.resetForm(this.addForm);
        } else {
            alert('Veuillez vérifier les champs.');
        }
    }

    remplitab() {
        const tabBody = document.getElementById('tab-body');
        tabBody.innerHTML = '';

        this.students.forEach((student, index) => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${student.nomPrenom}</td>
                <td>${student.noteDS1}</td>
                <td>${student.examen1}</td>
                <td>${student.noteDS2}</td>
                <td>${student.examen2}</td>
                <td>${student.moyenne1}</td>
                <td>${student.moyenne2}</td>
                <td>${student.moyenneFinale}</td>
                <td>
                <button type="button" class="edit" data-index="${index}">Modifier</button>
                </td>
                <td>
                    <button class="delete" data-index="${index}">Supprimer</button>
                </td>
            `;

            tabBody.appendChild(newRow);
          const editButton = newRow.querySelector(".edit");
          editButton.addEventListener("click", () => {
              this.editStudent(index);
          });
        });
    }

    editStudent(index) {
        this.editIndex = index;
        const student = this.students[index];

        document.getElementById('EnomPrenom').value = student.nomPrenom;
        document.getElementById('EnoteDS1').value = student.noteDS1;
        document.getElementById('Eexamen1').value = student.examen1;
        document.getElementById('EnoteDS2').value = student.noteDS2;
        document.getElementById('Eexamen2').value = student.examen2;

        // Ajoutez des console.log pour le débogage
        console.log('Edit Student Clicked');
        console.log('Edit Index:', index);
    }

    updateStudent(e) {
        e.preventDefault();

        if (this.editIndex === null) {
            alert('Aucun étudiant sélectionné pour la mise à jour.');
            return;
        }

        const nomPrenom = document.getElementById('EnomPrenom').value;
        const noteDS1 = parseFloat(document.getElementById('EnoteDS1').value);
        const examen1 = parseFloat(document.getElementById('Eexamen1').value);
        const noteDS2 = parseFloat(document.getElementById('EnoteDS2').value);
        const examen2 = parseFloat(document.getElementById('Eexamen2').value);

        const moyenne1 = (noteDS1 + examen1) / 2;
        const moyenne2 = (noteDS2 + examen2) / 2;
        const moyenneFinale = (moyenne1 + moyenne2) / 2;

        if (!isNaN(noteDS1) && !isNaN(examen1) && !isNaN(noteDS2) && !isNaN(examen2)) {
            const updatedStudent = {
                nomPrenom,
                noteDS1,
                examen1,
                noteDS2,
                examen2,
                moyenne1,
                moyenne2,
                moyenneFinale,
            };

            this.students[this.editIndex] = updatedStudent;
            localStorage.setItem('students', JSON.stringify(this.students));

            alert('Étudiant mis à jour avec succès');
            this.remplitab();
            this.resetForm(this.editForm);
            this.editIndex = null;
        } else {
            alert('Veuillez vérifier les champs.');
        }
    }

    deleteStudent(index) {
        if (confirm('Voulez-vous vraiment supprimer cet étudiant ?')) {
            this.students.splice(index, 1);
            localStorage.setItem('students', JSON.stringify(this.students));
            this.remplitab();
            alert('Étudiant supprimé avec succès');
        }
    }
}
