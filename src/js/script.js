import * as THREE from 'https://cdn.skypack.dev/three@0.137.5';
import { Utils } from './utils.js';
import { Dom } from './dom.js';




const WALL_HEIGHT = 40;
const WALL_THICKNESS = 5;

let WALL_NUM = 0;

const WALLS = [
    {x1: -10, y1: -10, x2: 100, y2: -10},
    {x1: 100, y1: -10, x2: 100, y2: 110},
    {x1: 100, y1: 110, x2: -20, y2: 100},
    {x1: -20, y1: 100, x2: -10, y2: -10}
];
const WALL_INDEX = [
    
];
let ROOMS = WALL_INDEX.length;

const scene = new THREE.Scene();

const canvas = document.getElementById("canvas");
const WIDTH = 900;
const HEIGHT = 800;

const camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 1000);
camera.position.set(0, 0, WALL_HEIGHT+200);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor("#dedede");
renderer.setSize(WIDTH, HEIGHT);

canvas.appendChild(renderer.domElement);

const light = new THREE.PointLight(0xFFFFFF, 1, 500);
light.position.set(20, -60, WALL_HEIGHT+100);
scene.add(light);

const render = function() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

render();

Dom.wheelZoom(camera);

Dom.wallInput((wall) => {
    WALLS.push(wall);
    makeWall(wall, WALLS.length-1);
    wallList();
});

Dom.makeRoom((wallIndexes) => {
    WALL_INDEX.push(wallIndexes);
    makeFloor();
});

init();


function init() {
    wallList();
    makeWalls();
    makeFloor();
    makeGrid();
}


function wallList() {
    Dom.makeWallList(WALLS, 
        (i) => {
        deleteWall(i);
        },
        (wall) => {
            cameraLook(wall);
        }
    );
}


function makeWalls() {
    for (let i=0; i < WALLS.length; i++) {
        makeWall(WALLS[i], i);
    }
}


function makeWall(wall, index) {
    let wallLen = Utils.wallLength(wall);
    let pos = Utils.midPosition(wall);

    let color = 0xFFCC00 + index*1000;      // set wall color
    let geometry = new THREE.BoxGeometry(wallLen, WALL_THICKNESS, WALL_HEIGHT);
    let material = new THREE.MeshToonMaterial({color: color});

    let mesh = new THREE.Mesh(geometry, material);
    mesh.name = "wallMesh";
    mesh.id2 = index;
    mesh.position.set(pos.x, pos.y, WALL_HEIGHT/2);

    Utils.rotateMesh(wall, mesh);
    makeGrid();
    scene.add(mesh);
    cameraLook(wall);
}


function makeGrid() {
    let grid = scene.getObjectByName("grid");
    scene.remove(grid);
    let size = Utils.gridSize(WALLS);
    const gridHelper = new THREE.GridHelper( size, size/10 );
    gridHelper.name = "grid";
    gridHelper.rotation.set(Math.PI/2, 0, 0);
    scene.add( gridHelper );
}


function makeFloor() {
    for (let i=0; i < WALL_INDEX.length; i++) {
        let shape = new THREE.Shape();
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
            }
        }
        let geometry = new THREE.ShapeGeometry(shape);
        const texture = new THREE.TextureLoader().load( 'assets/floor2.jpg', () => {
            let material = new THREE.MeshBasicMaterial({ map: texture });
            let floor = new THREE.Mesh(geometry, material);
            floor.name = "floor";
            floor.id2 = WALL_INDEX.length-1;
            scene.add(floor);
        } );
    }
}


function deleteWall(i) {
    let delMesh;
    scene.traverse((object) => {
        if (object.name === "wallMesh" && object.id2 === i) {
            WALLS.splice(i, 1);
            delMesh = object;
            wallList();
        }
    });
    delRoomByWall(i);
    scene.remove(delMesh);
    newId(i);
}


function newId(i) {
    scene.traverse( function(object) {
        if (object.name === "wallMesh" && object.id2 > i) {
            object.id2--;
        }
    });
}


function delRoomByWall(index) {
    for (let i=0; i < WALL_INDEX.length; i++) {
        if (WALL_INDEX[i].includes(index)) {
            WALL_INDEX.splice(i, 1);
            ROOMS = WALL_INDEX.length;
            let delMesh;
            scene.traverse((object) => {
                if (object.name === "floor" && object.id2 === i) {
                    delMesh = object;
                }
            });
            scene.remove(delMesh);
        }
    }
}


function cameraLook(wall) {
    let len = Utils.wallLength(wall);
    let pos = Utils.midPosition(wall);
    camera.position.set(pos.x-(len/2)-60, pos.y-100, WALL_HEIGHT+200);
    camera.lookAt(pos.x, pos.y, WALL_HEIGHT);
    camera.rotation.z = -0.4;
}