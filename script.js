// import * as THREE from './node_modules/three/build/three.module'
// import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'

import * as THREE from 'https://cdn.skypack.dev/three@0.137.5';


const WALL_HEIGHT = 30;
const WALL_THICKNESS = 5;

const WALL_NUM = 4;
const WALLS = [
    {x1: 0, y1: 0, x2: 100, y2: 0},
    {x1: 100, y1: 0, x2: 100, y2: 100},
    {x1: 100, y1: 100, x2: 0, y2: 100},
    {x1: 0, y1: 100, x2: 0, y2: 0},
    // {x1: 100, y1: 0, x2: 0, y2: 100},
    // {x1: 0, y1: 0, x2: 100, y2: 100}
];
const ROOMS = 1;
const WALL_INDEX = [
    [0, 1, 2, 3]
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
        a = coord.y1-coord.x1;
        b = coord.y2-coord.x2;
    }
    c = (a*a) + (b*b);
    console.log(Math.sqrt(c));
    return Math.sqrt(c);
}


const gridHelper = new THREE.GridHelper( 200, 50 );
gridHelper.rotation.set(Math.PI/2, 0, 0);
scene.add( gridHelper );

var light = new THREE.PointLight(0xFFFFFF, 1, 500);
light.position.set(20, -60, WALL_HEIGHT+100);
scene.add(light);

const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(100, 100),
    new THREE.MeshBasicMaterial({ color: 0xfcba03 })
)
floor.position.set(50, 50, 0);
console.log(floor);
scene.add(floor);

makeWalls();

var render = function() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

render();


