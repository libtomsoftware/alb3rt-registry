const core = require('alb3rt-core'),
    registry = require('./resources/registry');

module.exports = new class Alb3rtRegistryApi {
    constructor() {
        core.api.extend('registry', registry);
    }
};
