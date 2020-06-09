import HTMLConstructor from './HTMLConstructor.js';

export default class Button extends HTMLConstructor {
    constructor(text, attr = {}) {
        super({
            tag: 'button',
            text,
            attr
        })
    }
}