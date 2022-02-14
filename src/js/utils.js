
export const Utils = {
    
    //Calculates the mid coordinate between the two endpoints
    midPosition: function(coord) {
        let x = coord.x1 + coord.x2;
        let y = coord.y1 + coord.y2;
        return{x: x/2, y: y/2};
    },


    // Calculates the length of the wall from the endpoints
    wallLength: function(coord) {
        let a, b, c;

        // Checks origo
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
    },


    // Calculates angle of the wall
    wallAngle: function(wall) {
        let a, b, angle;

        if (wall.x1 === wall.x2) {
            angle = Math.PI / 2;
        }
        else if (wall.y1 === wall.y2) {
            angle = 0;
        }
        else if (wall.y1 > wall.y2 && wall.x1 > wall.x2) {
            a = wall.y1 - wall.y2;
            b = wall.x1 - wall.x2;
            angle = Math.atan(a/b);
        }
        else if (wall.y1 > wall.y2 && wall.x2 > wall.x1) {
            a = wall.y1 - wall.y2;
            b = wall.x2 - wall.x1;
            angle = -(Math.atan(a/b));
        }
        else if (wall.y2 > wall.y1 && wall.x1 > wall.x2) {
            a = wall.y2 - wall.y1;
            b = wall.x1 - wall.x2;
            angle = -(Math.atan(a/b));
        }
        else if (wall.y2 > wall.y1 && wall.x2 > wall.x1) {
            a = wall.y2 - wall.y1;
            b = wall.x2 - wall.x1;
            angle = Math.atan(a/b);
        }
        let grad = angle * (180/Math.PI);
        return angle;
    },


    // Checks the largest number from coordinates and calculates gridsize
    gridSize: function(walls) {
        let largest;
        if (walls.length > 0) {
            largest = walls[0].x1;
            for (let wall of walls) {
                for (let k of Object.keys(wall)) {
                    let abs = Math.abs(wall[k]);
                    if (abs > largest) {
                        largest = abs;
                    }
                }
            }
        }
        else {
            largest = 100;
        }
        return (Math.ceil(largest/100) * 100)*2;
    }
}