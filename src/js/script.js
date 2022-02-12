import * as THREE from 'https://cdn.skypack.dev/three@0.137.5';
import { Utils } from './utils.js';
import { Dom } from './dom.js';




const WALL_HEIGHT = 30;
const WALL_THICKNESS = 5;
let WALL_I = -1;
const WALL_NUM = 4;
const WALLS = [
    {x1: -10, y1: -10, x2: 90, y2: -10},
    {x1: 90, y1: -10, x2: 90, y2: 100},
    {x1: 90, y1: 100, x2: 0, y2: 100},
    {x1: 0, y1: 100, x2: -10, y2: -10},
    // {x1: 0, y1: 100, x2: -50, y2: -20},
    // {x1: 100, y1: 0, x2: 0, y2: 100}
    // {x1: 0, y1: 0, x2: 100, y2: 100}
];
const WALL_INDEX = [
    [0, 1, 2, 3]
];
const ROOMS = WALL_INDEX.length;

const scene = new THREE.Scene();

const canvas = document.getElementById("canvas");
const WIDTH = 900;
const HEIGHT = 800;

const camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 1000);
camera.position.set(50, -100, WALL_HEIGHT+200);
camera.lookAt(50, 50, 0);

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
    init();
});

Dom.makeRoom((wallIndexes) => {
    WALL_INDEX.push(wallIndexes);
    makeFloor();
});

init();


function init() {
    Dom.makeWallList(WALLS);
    makeWalls();
    makeFloor();
}


function makeWalls() {
    for (let i=WALL_I+1; i < WALLS.length; i++) {
        let wall = WALLS[i];
        let wallLen = Utils.wallLength(wall);
        let pos = Utils.midPosition(wall);
        let color = 0xFFCC00 + i*1000;
        let geometry = new THREE.BoxGeometry(wallLen, WALL_THICKNESS, WALL_HEIGHT);
        let material = new THREE.MeshToonMaterial({color: color});
        let mesh = new THREE.Mesh(geometry, material);
        mesh.name = "wallMesh";
        mesh.id2 = i;
        mesh.position.set(pos.x, pos.y, WALL_HEIGHT/2);
        Utils.rotateMesh(wall, mesh);
        WALL_I = i;
        scene.add(mesh);
    }
    makeGrid();
}


function makeGrid() {
    let size = Utils.gridSize(WALLS);
    const gridHelper = new THREE.GridHelper( size, size/10 );
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
        const texture = new THREE.TextureLoader().load( 'assets/floor.jpg', () => {
            console.log("texture-img size: ", texture.image.width, texture.image.height);
            let material = new THREE.MeshBasicMaterial({ map: texture });
            let floor = new THREE.Mesh(geometry, material);
            scene.add(floor);
        } );
        
        
    }
}