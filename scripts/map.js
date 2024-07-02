// Unfinished
/* The map is a two-dimensional plane
 * You can travel between any two locations with a straight line drawn between them
 * Routes have varying costs, some may be inaccessible
 * Travel time is linearly proportional to distance, calculated by the Pythagorean Theorem
 * Travel time can be reduced by better equipment or vehicles
 */

const canvas = $("#map-canvas")[0];
const ctx = canvas.getContext("2d");
const RADIUS = 7;

ctx.prototype.circle = function (x, y) {
  this.beginPath();
  this.arc(x, y, RADIUS, 0, 2 * Math.PI);
  this.stroke();
}
ctx.prototype.line = function (x1, y1, x2, y2) {
  this.beginPath();
  this.moveTo(x1, y1);
  this.lineTo(x2, y2);
  this.stroke();
}

export default class Map {
  constructor() {
    this.canvas = canvas;
    this.ctx = ctx;
    this.nodes = [];
    this.routes = [];
  }

  renderRoutes() {
    this.routes.forEach((route) => {
      this.ctx.line(route.start.x, route.start.y, route.end.x, route.end.y);
    });
  }
  renderLocations() {
    this.nodes.forEach((node) => {
      this.ctx.circle(node.x, node.y);
    });
  }
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  render() {
    renderRoutes();
    renderLocations();
  }

  newNode(x, y, id=Date.now()) {
    this.nodes.push({
      id: id.toString(),
      x: x,
      y: y
    });
  }
  newRoute(id1, id2, cost, access=false) {
    this.routes.push({
      start: id1,
      end: id2,
      length: Math.sqrt((id2.x-id1.x)**2 + (id2.y-id1.y)**2),
      cost: cost,
      access: access
    });
  }
}
