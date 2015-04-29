"use strict";

var chai = require("chai");
chai.should();
chai.use(require("chai-things"));
chai.use(require("chai-as-promised"));

global.expect = chai.expect;
global.equations = global.eqns = require("../src/index.js");
