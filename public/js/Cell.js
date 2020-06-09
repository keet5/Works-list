import HTMLConstructor from './HTMLConstructor.js';

export default class Cell extends HTMLConstructor {
    constructor(tag, n) {
        super({ tag });
        this.n = n;

        const areaControl = 6;
        let sideControl = 0;
        
        this.element.addEventListener('mousedown', event => {
            if (sideControl && event.button == 0) {
                const element = this.element;
                const startPosition = event.clientX;
                let e0, e1;
                document.body.style.cursor = 'col-resize';
                window.modalWindowPermission = false;
                
                if (sideControl == 1) {
                    e1 = document.querySelector(`.workers-list th:nth-child(${this.n})`);
                    e0 = e1.previousSibling;
                } else {
                    e0 = document.querySelector(`.workers-list th:nth-child(${this.n})`);
                    e1 = e0.nextSibling;
                }
                
                const width0 = e0.getBoundingClientRect().width;
                const width1 = e1.getBoundingClientRect().width;
                window.addEventListener('mousemove', changeWidth);
                
                
                function changeWidth(event) {
                    if (event.buttons == 0) {  
                        document.body.style.cursor = '';
                        window.removeEventListener('mousemove', changeWidth);
                        window.modalWindowPermission = true;
                    } else {
                        e0.style.width = width0 - (startPosition - event.clientX) + 'px';
                        e1.style.width = width1 + (startPosition - event.clientX) + 'px';
                    }
                }
            }
        });

        this.element.addEventListener('mousemove', event => {
            const position = this.element.getBoundingClientRect();
            const leftSide = event.clientX - position.x < areaControl;
            const rightSide = position.width - (event.clientX - position.x) < areaControl;

            if (leftSide && this.element.previousSibling) {
                sideControl = 1;
                showPointer();
            } else if (rightSide && this.element.nextSibling) {
                sideControl = 2;
                showPointer();
            } else {
                sideControl = 0;
                hidePointer();
            }
        });

        this.element.addEventListener('mouseout', event => {
            hidePointer();
        })

        const showPointer = () => {
            this.element.style.cursor = 'col-resize';
        }

        const hidePointer = () => {    
            this.element.style.cursor = '';
        }
    }
}