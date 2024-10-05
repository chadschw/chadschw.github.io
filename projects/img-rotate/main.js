
const rot = document.getElementById("rotate");

let yRot = 0;
let yStep = 0.1;

let xRot = 0;
let xStep = 0.05;

// function Render() {
//     xRot += xStep;
//     yRot += yStep;

//     rot.style.transform = `
//         perspective(75em)
//         rotateX(${xRot}deg)
//         rotateY(${yRot}deg)
//     `;

//     requestAnimationFrame(Render);
// }

// Render();

let mouseDown = false;

window.onpointerdown = e => mouseDown = true;
window.onpointerup = e => mouseDown = false;

window.onpointermove = e => {
    if (!mouseDown) {
        return;
    }

    xRot += -e.movementY/5;
    yRot += e.movementX/5;
    
    rot.style.transform = `
        perspective(75em)
        translate3d(0px, 0px, -1500px)
        rotateX(${xRot}deg)
        rotateY(${yRot}deg)
        translate3d(0px, 0px, 1000px)
    `;
}