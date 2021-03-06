const FILE_ID = 'registry',
    core = require('alb3rt-core'),
    http = core.http,
    logger = core.logger,
    CONFIG = core.config;

module.exports = new class Registry {
    constructor() {
        this.$devices = [];
    }

    findDevice(name) {
        return this.$devices.filter(device => {
            return device.NAME === name;
        });
    }

    register(data) {
        const exists = this.findDevice(data.NAME).length > 0;
        let result;

        if (!exists) {
            logger.log(FILE_ID, `Adding device: ${data.NAME}`);
            this.$devices.push(data);
            this.updateDb();
            result = true;
        } else {
            logger.warn(FILE_ID, `Device ${data.NAME} already registered. Aborting...`);
            result = false;
        }

        return result;
    }

    unregister(data) {
        const exists = this.findDevice(data.NAME).length > 0;
        let result;

        if (exists) {
            logger.log(FILE_ID, `Removing device: ${data.NAME}`);
            this.$devices = this.$devices.filter(device => {
                return device.ID !== data.ID;
            });
            this.updateDb();
            result = true;
        } else {
            result = false;
            logger.warn(FILE_ID, `Device ${data.NAME} not registered. Aborting...`);
        }

        return result;
    }

    get devices() {
        return [].concat([CONFIG.APP], this.$devices);
    }

    updateDb() {
        http.post({
            url: `http://${CONFIG.URL.DB_GATEWAY}/api/devices`,
            body: this.devices
        }).then(() => {
            logger.log(FILE_ID, `Current devices stored in database.`);
        }).catch((error) => {
            logger.error(FILE_ID, `Current devices not stored in database! ${error}`);
        });
    }
};
