const core = require('alb3rt-core'),
    logger = core.logger,
    registry = require('../../registry'),
    CONFIG = core.config,
    STATUS_CODE = CONFIG.CONSTANTS.HTTP_CODE,
    FILE_ID = 'resources/registry';

module.exports = new class Alb3rtRegistryResourcesRegistry {

    get(request, response) {
        core.api.responder.send(response, {
            status: STATUS_CODE.OK,
            data: registry.devices
        });
    }

    post(request, response) {
        let data = request.body;

        if (!data) {
            logger.error(FILE_ID, 'No required body in request, aborting...');
            core.api.responder.reject(response);
            return;
        }

        if (data.json) {
            data = core.api.parser.parsePostData(data.json);
        }

        const result = registry.register(data);

        core.api.responder.send(response, {
            status: result ? STATUS_CODE.OK : STATUS_CODE.CONFLICT
        });
    }

    delete(request, response) {
        let data = request.body;

        if (!data) {
            logger.error(FILE_ID, 'No required body in request, aborting...');
            core.api.responder.reject(response);
            return;
        }

        if (data.json) {
            data = core.api.parser.parsePostData(data.json);
        }

        const result = registry.unregister(data);

        core.api.responder.send(response, {
            status: result ? STATUS_CODE.OK : STATUS_CODE.CONFLICT
        });
    }
};
