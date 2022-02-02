
const minRadius = 2;
const maxRadius = 5;

const minTtl = 100;
const maxTtl = 300;

const minAdd = 1;
const maxAdd = 3;

const maxVel = 2;
const xAcc = 0.0;
const yAcc = 0.05; 

let mouseX = 0;
let mouseY = 0;

let circles: Circle[] = [];

window.onmousemove = e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

window.ontouchmove = e => {
    mouseX = e.touches[0].clientX;
    mouseY = e.touches[0].clientY;
}

let mouseDown = false;
window.onmousedown = e => mouseDown = true;
window.onmouseup = e => mouseDown = false;
window.ontouchstart = e => mouseDown = true;
window.ontouchend = e => mouseDown = false;

function AddCircles(num: number) {
    for (let i = 0; i < num; i++) {
        const radius = randBetween(minRadius, maxRadius);
        const ttl = randBetween(minTtl, maxTtl)
        const circle = new Circle(mouseX - radius, mouseY - radius, radius, ttl, maxVel, xAcc, yAcc);
        circles.push(circle);
        document.body.appendChild(circle.target);
    }
}

function Render() {
    let toRemove: Circle[] = [];

    for (let circle of circles) {
        if (--circle.ttl === 0) {
            toRemove.push(circle);
            continue;
        }

        circle.Move();
    }

    toRemove.forEach(circle => {
        document.body.removeChild(circle.target);
        circles.splice(circles.indexOf(circle), 1);
    });

    if (mouseDown) {
        //if (circles.length < 200) {
            AddCircles(randBetween(minAdd, maxAdd));
        //}
    }
    
    requestAnimationFrame(Render);
}

Render();