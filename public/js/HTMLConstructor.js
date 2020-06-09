export default class HTMLConstructor {
    constructor(obj) {
        if (obj instanceof Element) {
            this.element = obj;
        } else if (obj instanceof HTMLConstructor) {
            this.element = obj.element
        } else {

            if (obj.tag)
                this.element = document.createElement(obj.tag);
            else if (obj.element) {
                this.element = obj.element.element ? obj.element.element : obj.element;
            }
            
            
            this.element.textContent = obj.text;


            if (obj.children) {
                obj.children.forEach(child => {
                    let newElem = new HTMLConstructor(child);
                    this.element.appendChild(newElem.element);
                })
            }

            for (let attr in obj.attr) {
                this.element.setAttribute(attr, obj.attr[attr])
            }
        }
    }

    addChild(element) {
        if (element)
            this.element.appendChild(element instanceof Element ? element : element.element);
        return this;
    }

    addParent(element) {
        element.addChild(this.element);
        this.element = element.element;
    }

    show() {
        this.element.style.display = '';
    }

    hide() {
        this.element.style.display = 'none';
    }

    addEvent(event, fun) {
        this.element.addEventListener(event, fun); 
    }

    hasClass(className) {
        return Array.from(this.element.classList).indexOf(className) == -1 ? false : true;
    }

    addClass(className) {
        if (!this.hasClass(className))
            this.element.className += ` ${className}`;
    }

    removeClass(className) {
        if (this.hasClass(className))
            this.element.className = this.element.className.replace(new RegExp(`\\b${className}\\b`, 'g'), '')
    }

    remove() {
        this.element.remove();
    }
}

