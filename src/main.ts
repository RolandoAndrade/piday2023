import './style.css'
import {pi} from "./chudnovsky";

document.querySelector<HTMLDivElement>('#container')!.innerHTML = ``

let digitsOfPi = 1000;
let currentDigit = 2;

let addElement: HTMLDivElement = undefined!;

function createDigit(digit: string, className: string = `c${digit}`) {
    const element = document.createElement("div");
    element.textContent = digit
    element.classList.add(className)
    document.querySelector<HTMLDivElement>('#container')!.appendChild(element);
    return element;
}

function addButton() {
    if (!addElement) {
        addElement = document.createElement("div");
        addElement.addEventListener('click', async () => {
            const PI = await pi(++digitsOfPi);
            showDigits(PI);
        })
    }

    addElement.textContent = '+'
    addElement.classList.add('cplus')
    document.querySelector<HTMLDivElement>('#container')!.appendChild(addElement);
    return addElement;
}

function removeAddButton() {
    if (addElement) document.querySelector<HTMLDivElement>('#container')!.removeChild(addElement);
}

function showDigits(PI: string) {
    removeAddButton();
    for (; currentDigit < PI.length; currentDigit++) {
        createDigit(PI[currentDigit])
    }
    addButton();

}

createDigit('3')
createDigit('.', 'cdot')

pi(digitsOfPi).then(PI => {
    showDigits(PI)
});


