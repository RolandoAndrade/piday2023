import './style.css'
import {pi} from "./chudnovsky";

document.querySelector<HTMLDivElement>('#container')!.innerHTML = ``

let digitsOfPi = 1002;
let currentDigit = 2;
let lastPi = '';

let addElement: HTMLDivElement = undefined!;

function createDigit(digit: string, className: string = `c${digit}`, digitNumber: number | undefined = undefined) {
    const element = document.createElement("div");
    element.textContent = digit
    element.classList.add(className)
    element.classList.add('piDigit')
    if (digitNumber) {
        const digitCount = document.createElement("div");
        digitCount.textContent = `${digitNumber}`
        digitCount.classList.add('digitCount')
        element.appendChild(digitCount);
    }
    document.querySelector<HTMLDivElement>('#container')!.appendChild(element);
    return element;
}

function changeTitle() {
    document.querySelector<HTMLDivElement>('#digit-counter')!.textContent = `${currentDigit - 2} Digits of PI`
}

function addButton() {
    if (!addElement) {
        addElement = document.createElement("div");
        addElement.addEventListener('click', async () => {
            digitsOfPi++;
            if (lastPi.length < digitsOfPi) {
                lastPi = await pi(digitsOfPi * 2);
            }
            showDigits(lastPi);
        })
    }

    addElement.textContent = '+'
    addElement.classList.add('piDigit')
    addElement.classList.add('cplus')
    document.querySelector<HTMLDivElement>('#container')!.appendChild(addElement);
    return addElement;
}

function removeAddButton() {
    if (addElement) document.querySelector<HTMLDivElement>('#container')!.removeChild(addElement);
}

function showDigits(PI: string) {
    removeAddButton();
    for (; currentDigit < digitsOfPi; currentDigit++) {
        createDigit(PI[currentDigit], undefined, currentDigit-1)
    }
    changeTitle();
    addButton();

}

createDigit('3')
createDigit('.', 'cdot')

pi(digitsOfPi * 2).then(PI => {
    lastPi = PI;
    showDigits(PI)
});



