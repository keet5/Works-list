import HTMLConstructor from './HTMLConstructor.js';
import Cell from './Cell.js';

export default class Worker {
    constructor(data, id) {
        this.data = data;
        this.row = new Row();
        this.row.value = data;
        this.id = id;
        Worker.loadedWorkers[id] = this;
    }

    set value(data) {
        this.data = data;
        this.row.value = data;
    }

    async delete() {
        let response = await fetch('/delete-worker/' + this.id, {
            method: 'DELETE',
        });

        if (response.ok) {
            this.row.remove();
            delete Worker.loadedWorkers[this.id];
        } else {
            throw new Error(response.status);
        }
    }

    static loadedWorkers = {};
}

export class Row extends HTMLConstructor {
    constructor() {
        let cells = [];
        cells[0] = new TdImg(1);
        for (let i = 1; i < 8; i++) {
            cells[i] = new Td(i + 1);
        }

        super({
            tag: 'tr',
            children: cells
        });

        this.cells = cells;
        this.data;
    }

    set value(data) {
        this.data = data;
        this.age = new Date(new Date() - new Date(data.birthday) - - new Date('0000-01-01')).getFullYear();
        this.birthday = data.birthday.split('-').reverse().join('.');
        this.address = `${data.city} ${data.street} ${data.build} ${data.flat}`;
       
        [
            data.photo,
            data.name,
            data.surname,
            this.birthday,
            this.age,
            data.job,
            data['remoute-work'] ? '✔' : '✗',
            this.address
        ].forEach((i, n) => {
            this.cells[n].value = i;
        });
    }

    get value() {
        return this.data;
    }

    get sortData() {
        return [
            this.data.name,
            this.data.surname,
            -this.age,
            this.age,
            this.data.job,
            this.data['remoute-work'],
            this.address
        ]
    }

    get forSearch() {
        return '' +  this.data.name + this.data.surname + this.birthday + this.age + this.data.job + this.address;
    }

    
    static table;
}

class Td extends Cell {
    constructor(n) {
        super('td', n);
    }

    set value(val) {
        this.element.textContent = val;
    }
}

class TdImg extends Td {
    constructor(n) {
        super(n);
        this.img = document.createElement('img');
        this.img.alt = '';
        this.addChild(this.img);
    }

    set value(val) {
        this.img.src = val;
    }
}
