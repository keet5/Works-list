import Table from './js/Table.js';
import ModalWindow from './js/ModalWindow.js';
import Button from './js/Button.js';
import Worker from './js/Worker.js';
import Header from './js/Header.js';

const header = new Header();
const table = new Table();
const buttonAdd = new Button('+', { class: 'button-add' });
const modalWindow = new ModalWindow(buttonAdd, table);

//
document.body.appendChild(header.element);
document.body.appendChild(table.element);
document.body.appendChild(buttonAdd.element);
document.body.appendChild(modalWindow.element);
getAllWorkers();

// global
window.modalWindowPermission = true;

// events
header.addEvent('input', event => {
    table.search(header.value);
});


buttonAdd.addEvent('click', event => {
    showModalWindow();
});


modalWindow.addEvent('submit', event => {
    event.preventDefault();
    let worker = modalWindow.currentWorker;

    let body = new FormData(modalWindow.form.element);

    if (worker) {
        editWorker(worker, modalWindow.value, body);
    } else {
        createWorker(modalWindow.value, body);
    }
    showButtonAdd();

});

modalWindow.addEvent('reset', event => {
    showButtonAdd();
});

modalWindow.form.buttonRemove.addEvent('click', event => {
    showButtonAdd();
})

modalWindow.addEvent('click', event => {
    if (event.target === modalWindow.element) {
        showButtonAdd();
    }
});

function showModalWindow(date = null) {
    if (window.modalWindowPermission) {
        buttonAdd.hide();
        modalWindow.show(date);
        document.body.style.overflow = 'hidden';
    }
}

function showButtonAdd() {
    modalWindow.reset();
    modalWindow.hide();
    buttonAdd.show();
    document.body.style.overflow = '';
}

async function getAllWorkers() {
    const response = await fetch('/workers');

    if (response.ok) {
        const workers = await response.json();
        for (let data of workers) {
            const id = data.id;
            delete data.id;
            data['remoute-work'] = data['remoute-work'] == 1 ? true : false;

            let photo = await fetch('/worker-photo/' + id);
            photo = await photo.blob();
            data.photo = photo.size ? URL.createObjectURL(photo) : './img/photo.jpg';
            const worker = new Worker(data, id);
            worker.row.addEvent('click', event => {
                showModalWindow(worker);
            });
            table.add(worker);
        }
    } else {
        throw new Error(response.status);
    }

}

async function createWorker(data, body) {
    const response = await fetch('/new-worker', {
        method: 'POST',
        headers: {
            enctype: 'multipart/form-data'
        },
        body
    });

    if (response.ok) {
        let id = await response.json();
        let worker = new Worker(data, id);
        worker.row.addEvent('click', event => {
                showModalWindow(worker);
        });
        table.add(worker);
    } else {
        throw new Error(response.status);
    }
}

async function editWorker(worker, data, body) {
    const response = await fetch('/edit-worker/' + worker.id, {
        method: 'PUT',
        headers: {
            enctype: 'multipart/form-data'
        },
        body
    });

    if (response.ok)
        worker.value = data;
    else
        throw new Error(response.status)
}