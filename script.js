// import * as THREE from './node_modules/three/build/three.module'
// import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'

import * as THREE from 'https://cdn.skypack.dev/three@0.137.5';


const WALL_HEIGHT = 30;
const WALL_THICKNESS = 5;

const WALL_NUM = 4;
let WALLS = [
    // {x1: -50, y1: -20, x2: 40, y2: -40},
    // {x1: 40, y1: -40, x2: 120, y2: -10},
    // {x1: 120, y1: -10, x2: 100, y2: 100},
    // {x1: 100, y1: 100, x2: 0, y2: 100},
    // {x1: 0, y1: 100, x2: -50, y2: -20}
    // {x1: 100, y1: 0, x2: 0, y2: 100},
    // {x1: 0, y1: 0, x2: 100, y2: 100}
];
const ROOMS = 0;
let WALL_INDEX = [
    // [0, 1, 2, 3, 4]
];

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(50, -60, WALL_HEIGHT+100);
camera.lookAt(50, 50, 0);

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setClearColor("#dedede");
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

document.addEventListener( 'mousewheel', (event) => {
    camera.position.z +=event.deltaY/10;
});

window.addEventListener("resize", () => {
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth, innerHeight;

    // camera.updateProjectionMatrix();
});


function makeWalls() {
    for (let i=0; i < WALLS.length; i++) {
        let a, b, angle;
        let wall = WALLS[i];
        let wallLen = wallLength(wall);
        let pos = midPosition(wall);
        let color = 0xFFCC00 + i*1000;

        let geometry = new THREE.BoxGeometry(wallLen, WALL_THICKNESS, WALL_HEIGHT);
        let material = new THREE.MeshToonMaterial({color: color});
        let mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.set(pos.x, pos.y, WALL_HEIGHT/2);

        if (wall.x1 === wall.x2) {
            mesh.rotation.set(0, 0, Math.PI/2);
        }
        else if (wall.y1 === wall.y2) {
            mesh.rotation.set(0, 0, 0);
        }
        else if (wall.y1 > wall.y2 && wall.x1 > wall.x2) {
            a = wall.y1 - wall.y2;
            b = wall.x1 - wall.x2;
            angle = Math.atan(a/b);
            mesh.rotation.set(0, 0, angle);
        }
        else if (wall.y1 > wall.y2 && wall.x2 > wall.x1) {
            a = wall.y1 - wall.y2;
            b = wall.x2 - wall.x1;
            angle = Math.atan(a/b);
            mesh.rotation.set(0, 0, -angle);
        }
        else if (wall.y2 > wall.y1 && wall.x1 > wall.x2) {
            a = wall.y2 - wall.y1;
            b = wall.x1 - wall.x2;
            angle = Math.atan(a/b);
            mesh.rotation.set(0, 0, -angle);
        }
        else if (wall.y2 > wall.y1 && wall.x2 > wall.x1) {
            a = wall.y2 - wall.y1;
            b = wall.x2 - wall.x1;
            angle = Math.atan(a/b);
            mesh.rotation.set(0, 0, angle);
        }
        
        scene.add(mesh);
    }
}


//Calculate the coordinate between the two endpoints.
function midPosition(coord) {
    let x = coord.x1 + coord.x2;
    let y = coord.y1 + coord.y2;
    return{x: x/2, y: y/2};

}

// Calculate the length of the wall from the endpoints.
function wallLength(coord) {
    let a, b, c;

    // Check origo
    if (coord.x1 === 0 && coord.y1 === 0) {
        a = coord.x2;
        b = coord.y2;
    }
    else if (coord.x2 === 0 && coord.y2 === 0) {
        a = coord.x1;
        b = coord.y1;
    }
    else {
        a = coord.x2-coord.x1;
        b = coord.y2-coord.y1;
    }
    c = (a*a) + (b*b);
    return Math.sqrt(c);
}


const gridHelper = new THREE.GridHelper( 200, 50 );
gridHelper.rotation.set(Math.PI/2, 0, 0);
scene.add( gridHelper );

var light = new THREE.PointLight(0xFFFFFF, 1, 500);
light.position.set(20, -60, WALL_HEIGHT+100);
scene.add(light);

var render = function() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

render();


function makeFloor() {
    for (let i=0; i < WALL_INDEX.length; i++) {
        let shape = new THREE.Shape();
        let toFirstEndpoint = false;
        for (let j=0; j < WALL_INDEX[i].length; j++) {
            let wall = WALLS[WALL_INDEX[i][j]];
            if (j === 0) {
                shape.moveTo(wall.x1, wall.y1);
                shape.lineTo(wall.x2, wall.y2);
            }
            else {
                let lastWall = WALLS[WALL_INDEX[i][j-1]];
                shape.lineTo(lastWall.x1, lastWall.y1);
                shape.lineTo(lastWall.x2, lastWall.y2);
                
                
                // let aPoints = {x1: lastWall.x1, y1: lastWall.y1, x2: wall.x1, y2: wall.y1};
                // let aDistance = {len: wallLength(aPoints), points: aPoints};
                // let bPoints = {x1: lastWall.x1, y1: lastWall.y1, x2: wall.x2, y2: wall.y2};
                // let bDistance = {len: wallLength(bPoints), points: bPoints};
                // let cPoints = {x1: lastWall.x2, y1: lastWall.y2, x2: wall.x1, y2: wall.y1};
                // let cDistance = {len: wallLength(cPoints), points: cPoints};
                // let dPoints = {x1: lastWall.x2, y1: lastWall.y2, x2: wall.x2, y2: wall.y2};
                // let dDistance = {len: wallLength(dPoints), points: dPoints};
                
                // let list = [aDistance, bDistance, cDistance, dDistance];
                // let nearest = list[0];
                // for (let dist of list) {
                //     if (dist.len < nearest.len) {
                //         nearest = dist;
                //     }
                // }
                // if (aDistance > bDistance) {
                //     shape.lineTo(wall.x2, wall.y2);
                //     shape.lineTo(wall.x1, wall.y1);
                //     toFirstEndpoint = true;
                // }
                // else {
                //     shape.lineTo(wall.x1, wall.y1);
                //     shape.lineTo(wall.x2, wall.y2);
                //     toFirstEndpoint = false;
                // }
                // if (j === WALL_INDEX[i].length-1) {
                //     shape.moveTo(WALLS[WALL_INDEX[i][0]].x1, WALLS[WALL_INDEX[i][0]].y1);
                // }
            }

        }
        let geometry = new THREE.ShapeGeometry(shape);
        let material = new THREE.MeshBasicMaterial({ color: 0xfcba03 });
        let floor = new THREE.Mesh(geometry, material);
        scene.add(floor);
    }
}


function wallInput() {
    const addBtn = document.getElementById("addWallBtn");
    const x1 = document.getElementById("x1");
    const y1 = document.getElementById("y1");
    const x2 = document.getElementById("x2");
    const y2 = document.getElementById("y2");
    addBtn.addEventListener("click", () => {
        let newWall = {x1: parseInt(x1.value), y1: parseInt(y1.value), x2: parseInt(x2.value), y2: parseInt(y2.value)};
        if (!Object.values(newWall).includes("")) {
            WALLS.push(newWall);
            makeWallList();
            x1.value = "";
            y1.value = "";
            x2.value = "";
            y2.value = "";
        }
        makeWalls();
    });
}


function makeWallList() {
    if (WALLS.length > 0) {
        document.getElementById("addRoomDiv").style.display = "block";
    }
    const wallList = document.getElementById("wallList");
    wallList.innerHTML = "";
    for (let i=0; i < WALLS.length; i++) {
        let w = WALLS[i];
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
    makeWalls();
}


function makeRoom() {
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
            WALL_INDEX.push(wallIndexes);
            makeFloor();
        }
    })
}

makeWallList()
makeFloor();
wallInput();
makeRoom();






