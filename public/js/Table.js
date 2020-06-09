import HTMLConstructor from './HTMLConstructor.js';
import Cell from './Cell.js';
import Worker from './Worker.js';

export default class Table extends HTMLConstructor {
    constructor() {

        let thead = [
            'Имя',
            'Фамилия',
            'Дата Рождения',
            'Возраст',
            'Должность',
            'Удаленная Работа',
            'Aдрес Проживания'
        ].map((text, n) => {
            const sort = new Sort(text);
            sort.normal();
            const th = new Th(sort, n + 2);
            

            th.addEvent('click', event => {
                Sort.selectPanel(n + 2);
                this.sort();
            });
            return th;
        });
        thead.unshift(new ThWithoutSort('Превью', 1));


        let currentSort = 0;
        let tbody = new HTMLConstructor({
            tag: 'tbody'
        });

        super(
            {
                tag: 'main',
                children: [
                    {
                        tag: 'table',
                        attr: { class: 'workers-list' },
                        children: [
                            {
                                tag: 'thead',
                                children: [
                                    {
                                        tag: 'tr',
                                        children: thead
                                    }
                                ]
                            },
                            {
                                element: tbody
                            }
                        ]
                    }
                ]
            });
        this.tbody = tbody;
    }

    sort() {
        const funSorts = [
            (a, b) => a.row.sortData[Sort.currentPanel - 2] > b.row.sortData[Sort.currentPanel - 2],
            (a, b) => a.row.sortData[Sort.currentPanel - 2] < b.row.sortData[Sort.currentPanel - 2]
        ];

        const sortArr = Object.values(Worker.loaded).sort(funSorts[Sort.panel[Sort.currentPanel].status - 1]);
        sortArr.forEach(worker => {
            Worker.loaded[worker.id].row.remove();
            this.addForSort(worker);
        })
    }

    add(worker) {
        this.tbody.addChild(worker.row);
        if (Sort.currentPanel) {
            this.sort();
        }
    }

    addForSort(worker) {
        this.tbody.addChild(worker.row);
    }

    search(str) {
        Object.values(Worker.loaded).forEach(worker => {
            if (worker.row.forSearch.indexOf(str) !== -1) {
                worker.row.show();
            } else {
                worker.row.hide();
            }
        });
    }
}

class Th extends Cell {
    constructor(sort, n) {
        super('th', n);
        this.sort = sort;
        this.addChild(this.sort);
    }
}

class ThWithoutSort extends Cell {
    constructor(text, n) {
        super('th', n);
        this.element.textContent = text;
    }
}


class Sort extends HTMLConstructor {
    constructor(text) {
        const increase = new ButtonSort('▲', 'sort-increase', 1);
        const decrease = new ButtonSort('▼', 'sort-decrease', 2);

        super({
            tag: 'div',
            attr: {
                class: 'sort'
            },
            children: [
                {
                    tag: 'div',
                    text
                },
                {
                    tag: 'div',
                    attr: {
                        class: 'sort-buttons'
                    },
                    children: [
                        increase,
                        decrease
                    ]
                }
            ]
        });
        this.position = Sort.panel.push(this) - 1;

        this.decrease = decrease;
        this.increase = increase;
        this.status = 0;
    }

    normal() {
        this.status = 0;
        this.decrease.normal();
        this.increase.normal();
    }

    reversSort() {
        switch (this.status) {
            case 0:
                this.increase.select();
                this.status = 1;
                break;
            case 1:
                this.decrease.select();
                this.increase.normal();
                this.status = 2;
                break;
            case 2:
                this.increase.select();
                this.decrease.normal();
                this.status = 1;
            default:
                break;
        }
    }

    static panel = [{ normal: function () { return; } }, null];
    static currentPanel = 0;
    static selectPanel(n) {
        if (Sort.currentPanel != n) {
            Sort.panel[Sort.currentPanel].normal();
            Sort.currentPanel = n;
        }
        Sort.panel[Sort.currentPanel].reversSort();
    }
}

class ButtonSort extends HTMLConstructor {
    constructor(text, className, status) {
        super({
            tag: 'div',
            text,
            attr: {
                class: className
            }
        });
    }

    select() {
        this.element.style.opacity = 1;
    }

    normal() {
        this.element.style.opacity = .2;
    }
}

