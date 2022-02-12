
export const Dom = {

    wheelZoom: function(camera) {
        document.addEventListener( 'mousewheel', (event) => {
            if (event.target.localName === "canvas") {
                camera.position.z +=event.deltaY/10;
                camera.position.y -=event.deltaY/50; 
            }
        });
    },


    wallInput: function(callback) {
        const addBtn = document.getElementById("addWallBtn");
        const x1 = document.getElementById("x1");
        const y1 = document.getElementById("y1");
        const x2 = document.getElementById("x2");
        const y2 = document.getElementById("y2");
        addBtn.addEventListener("click", () => {
            let newWall = {x1: parseInt(x1.value), y1: parseInt(y1.value), x2: parseInt(x2.value), y2: parseInt(y2.value)};
            if (!Object.values(newWall).includes("")) {
                callback(newWall);
                x1.value = x2.value;
                y1.value = y2.value;
                x2.value = "";
                y2.value = "";
            }
        });
    },


    makeWallList: function(walls) {
        if (walls.length > 0) {
            document.getElementById("addRoomDiv").style.display = "block";
        }
        const wallList = document.getElementById("wallList");
        wallList.innerHTML = "";
        for (let i=0; i < walls.length; i++) {
            let w = walls[i];
            let text = "" + i + ". " + "(" + w.x1 +"; " + w.y1 + "), (" + w.x2 + "; " + w.y2 + ")";
            const listItem = document.createElement("li");
            const textnode = document.createTextNode(text);
            const checkBox = document.createElement("input");
            checkBox.setAttribute("type", "checkbox");
            checkBox.setAttribute("class", "addRoomCB");
            checkBox.setAttribute("id", i);
            listItem.appendChild(textnode);
            listItem.appendChild(checkBox);
            wallList.appendChild(listItem);
        }
    },


    makeRoom: function(callback) {
        const makeBtn = document.getElementById("addRoom");
        const cB = document.getElementsByClassName("addRoomCB");
        let wallIndexes = [];
        makeBtn.addEventListener("click", () => {
            for (let box of cB) {
                if (box.checked) {
                    wallIndexes.push(parseInt(box.id));
                    box.checked = false;
                }
            }
            if (wallIndexes.length > 2) {
                callback(wallIndexes);
            }
        })
    }
}