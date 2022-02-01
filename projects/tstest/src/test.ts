
new Greeter("Chad");
console.log("hello, world");

page().children([
    span().textContent("hello, world!"),
    flex()
        .addChild(span().textContent("flex child"))
        .styleAttr(`
            background-color: lightgray;
            border: 1px solid gray;
            border-radius: 5px;
            height: 200px;
            width: 200px;
        `),
    img()
        .src("https://preview.redd.it/oxyqpcs96mg31.jpg?auto=webp&s=004a439f920e0e01e3216083b75d56542f66cbe6")
        .styleAttr(`width: 600px;`)
]);