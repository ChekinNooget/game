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

ctx.__proto__.circle = function (x, y) {
  this.beginPath();
  this.arc(x, y, RADIUS, 0, 2 * Math.PI);
  this.stroke();
}
ctx.__proto__.line = function (x1, y1, x2, y2) {
  this.beginPath();
  this.moveTo(x1, y1);
  this.lineTo(x2, y2);
  this.stroke();
}

export default class Map {
  constructor() {
    this.canvas = canvas;
    this.ctx = ctx;
    this.nodes = {};
    this.routes = [];
  }

  renderRoutes() {
    this.routes.forEach((route) => {
      this.ctx.line(route.start.x, route.start.y, route.end.x, route.end.y);
    });
  }
  renderLocations() {
    Object.values(this.nodes).forEach((node) => {
      this.ctx.circle(node.x, node.y);
    });
  }
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  render() {
    this.renderRoutes();
    this.renderLocations();
  }

  newNode(x, y, id=Date.now()) {
    this.nodes[id.toString()] = {
      x: x,
      y: y,
      routes: {}
    };
  }
  newRoute(id1, id2, cost, access=false) {
    const route = {
      start: this.nodes[id1],
      end: this.nodes[id2],
      length: Math.sqrt((id2.x-id1.x)**2 + (id2.y-id1.y)**2),
      cost: cost,
      access: access
    };
    this.routes.push(route);
    this.nodes[id1].routes[id2] = route;
    this.nodes[id2].routes[id1] = route;
  }
  fillEmptyRoutes(cost, access=false) {
    const nodes = Object.keys(this.nodes);
    nodes.forEach((key) => {
      nodes.filter((n) => !Object.keys(this.nodes[key].routes).concat([key]).includes(n)).forEach((id) => {
        this.newRoute(key, id, cost, access);
      });
    });
  }
}
