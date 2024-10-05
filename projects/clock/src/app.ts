let bgImgPath = "bg2.jpg"
let showDate = true;
let showSeconds = true;
// state = 0 means show date, time and seconds
// state = 1 means show time and seconds
// state = 2 means show time and not seconds
let state = 0

const clockSpan = span()
    .styleAttr(`
        padding: 5px;
        border-radius: 5px;
        background-color: rgba(255, 255, 255, 0.75);
        box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
    `) as Span

    clockSpan.setOnClick(e => {
    if (++state == 3) {
        state = 0
    }

    switch(state) {
        case 0:
            showDate = true;
            showSeconds = true;
            break;
        case 1: 
            showDate = false;
            break;
        case 2:
            showSeconds = false;
            break;
    }

    update()
})

function padWithZero(n: number){
    return n.toString().padStart(2, "0")
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function update()
{
    let date = new Date();
    let text = ""

    if (showDate) {
        const year = date.getFullYear();
        const month = months[date.getMonth()];
        const day = date.getDate();

        text += `${year} ${month} ${day} `
    }

    const hour = padWithZero(date.getHours())
    const min = padWithZero(date.getMinutes())
    text += `${hour}:${min}`

    if (showSeconds) {
        const sec = padWithZero(date.getSeconds())
        text += `:${sec}`
    }

    clockSpan.textContent(text)
}

const theFlex = flex()
.addChild(clockSpan)
.styleAttr(`
    background-size: cover;
    background-position: center;
    background-image: url("${bgImgPath}");
    height:100%;
    font-family: monospace;
    font-size: 16px;
`)

page().children([theFlex]);

window.oncontextmenu = e => {
    e.preventDefault()
    const newPath = prompt("background image url")

    if (newPath === null) return;   // pressed cancel

    var style = (theFlex.target as HTMLDivElement).style

    if (newPath) {
        style.backgroundImage = `url("${newPath}")`
    } else {
        style.backgroundImage = `url("${bgImgPath}")`
    }
}

update()
setInterval (() => update(), 1000)
