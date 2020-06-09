import HTMLConstructor from './HTMLConstructor.js';
import Button from './Button.js';

export default class ModalWindow extends HTMLConstructor {
    constructor() {
        let form = new Form();

        super({
            tag: 'div',
            attr: {
                class: 'modal-window'
            },
            children: [
                form
            ]
        });

        this.hide();
        this.form = form;
        this.worker = false;
        
        this.form.buttonRemove.addEvent('click', event => {
            this.form.buttonRemove.hide();
            this.worker.delete();
            event.preventDefault(); 
        });
    }

    reset() {
        this.form.reset();
    }

    show(worker) {
        this.worker = worker;
       
        if (worker) {
            this.form.buttonRemove.show();
            this.form.value = worker.data;
        }
        super.show();
    }

    get value() {
        return this.form.value;
    }

    get currentWorker() {
        let buf = this.worker;
        this.worker = false;
        return buf;
    }
}

class Form extends HTMLConstructor {
    constructor() {
        const fields = [
            ['name', 'text', 'Имя', true],
            ['surname', 'text', 'Фамилия', true],
            ['birthday', 'date', 'Дата Рождения', true],
            ['city', 'text', 'Город', true],
            ['street', 'text', 'Улица', false ],
            ['build', 'text', 'Дом', false],
            ['flat', 'text', 'Квартира', false],
        ].reduce((obj, [name, type, text, required]) => {
            let input;
            if (required) 
                input = new Label({ name, type, required }, text);
            else 
                input = new Label({ name, type }, text);


            obj[name] = input;
            return obj;
        }, {});

        fields['remoute-work'] = new Label(new InputCheckbox({
            name: 'remoute-work',
            type: 'checkbox'
        }), 'Удаленная работа');

        fields['job'] = new Label(new Select('job', ['техник', 'программист', 'бухгалтер']), 'Должность'); // должность
        fields['photo'] = new LabelPhoto({
            type: 'file',
            name: 'photo'
        });

        let buttonRemove = new Button('Удалить');
        buttonRemove.hide();

        super({
            tag: 'form',
            children: [
                new Fieldset([
                    fields['photo']
                ], 'modal-window__photo'),
                new Fieldset([
                    fields['name'],
                    fields['surname'],
                    fields['birthday'],
                    fields['job'],
                    fields['remoute-work']
                ]),
                new Fieldset([
                    fields['city'],
                    fields['street'],
                    fields['build'],
                    fields['flat']
                ], ''),
                new Fieldset([
                    new Input({
                        type: 'submit',
                        value: 'Сохранить'
                    }),
                    new Input({
                        type: 'reset',
                        value: 'Отмена'
                    }),
                    buttonRemove
                ], 'modal-window__control')
            ]
        });
        this.fields = fields;
        this.buttonRemove = buttonRemove;

        

    }

    get value() {
        let result = {};
        let names = Object.keys(this.fields);
        for (let name of names) {
            result[name] = this.fields[name].input.value;
        }

        return result;
    }

    set value(data) {
        for (let name in data) {
            this.fields[name].input.value = data[name];
        }
    }

    reset() {
        this.element.reset();
        this.fields.photo.input.reset();
        Object.values(this.fields).forEach(field => {
            field.input.removeClass('highlight');
        });
    }
}

class Fieldset extends HTMLConstructor {
    constructor(children, className = '') {
        super({
            tag: 'fieldset',
            attr: {
                class: className
            },
            children
        });
    }
}

class Label extends HTMLConstructor {
    constructor(attr, text) {
        let input = (attr instanceof HTMLConstructor) ? attr : new Input(attr);
        super({
            tag: 'label',
            text,
            children: [
                input
            ]
        });
        this.input = input;
    }
}

class Input extends HTMLConstructor {
    constructor(attr) {
        super({
            tag: 'input',
            attr
        });
    }

    get value() {
        return this.element.value;
    }

    set value(n) {
        this.element.value = n;
    }
}

class InputPhoto extends Input {
    constructor({ type, name }, src = 'img/photo.jpg') {
        super({
            type,
            name
        });
        this.img = document.createElement('img');
        this.img.src = src;

        this.element.addEventListener('input', event => {
            this.img.src = URL.createObjectURL(this.element.files[0]);
        });
    }

    get value() {
        return this.img.src;
    }

    set value(value) {
        this.img.src = value;
    }

    reset() {
        this.img.src = 'img/photo.jpg';
    }
}

class LabelPhoto extends HTMLConstructor {
    constructor({ type, name }, src) {
        let input = new InputPhoto({ type, name }, src);

        super({
            tag: 'label',
            children: [
                {
                    element: input.img,
                },
                {
                    element: input
                }
            ]
        });
        this.input = input;
    }
}

class InputCheckbox extends Input {
    get value() {
        return this.element.checked
    }

    set value(n) {
        this.element.checked = n;
    }
}

class Select extends HTMLConstructor {
    constructor(name, options) {
        const children = options.map(value => ({
            tag: 'option',
            text: value,
            attr: { value }
        }))

        super({
            tag: 'select',
            attr: { name },
            children,
        });
    }

    get value() {
        return this.element.value;
    }

    set value(n) {
        this.element.value = n;
    }
}

