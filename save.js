var socket = io.connect("http://24.16.255.56:8888");

socket.on("load", function(data) {
    let state = data['data'];
    let background = new Background(game.gameEngine);
    game.gameEngine.entities = [];
    background.r = state.background.r;
    background.g = state.background.g;
    background.b = state.background.b;
    game.gameEngine.addEntity(background);
    for(i in state.bacteria) {
        let bData = state.bacteria[i];
        let bacteria = new Bacteria(game.gameEngine, bData.x, bData.y, bData.radius, bData.color);
        bacteria.yv = bData.yv;
        bacteria.xv = bData.xv;
        game.gameEngine.addEntity(bacteria);
    }
    game.start();
});

function save() {
    let bacteria = game.gameEngine.entities.filter(x => x instanceof Bacteria)
        .map(x => x.getState());
    
    let background = game.gameEngine.background.getState();
    let state = {
        bacteria: bacteria,
        background: background
    }
    socket.emit("save", {
        studentname: "Myles Haynes",
        statename: "myleshaynes",
        data: state
    });
    console.log("saved");
}

function load() {
    console.log("Loading!");
    socket.emit("load", {
        studentname: "Myles Haynes",
        statename: "myleshaynes"
    });
}