import HTMLConstructor from './HTMLConstructor.js';
import Button from './Button.js';

export default class Header extends HTMLConstructor {
    constructor() {
        const search = new Search();

        super({
            tag: 'header',
            children: [
                search
            ]
        });

        this.addEvent('submit', event => {
            event.preventDefault();
        });

        this.search = search;
    }

    get value() {
        return this.search.value
    }
}



class Search extends HTMLConstructor {
    constructor() {
        super({
            tag: 'form',
            children: [
                {
                    tag: 'label',
                    children: [
                        {
                            tag: 'input',
                            attr: {
                                type: 'search'
                            },
                        }
                    ]
                }

            ]
        });

        this.search = this.element.children[0].children[0];
    }

    get value() {
        return this.search.value
    }
}