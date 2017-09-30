import 'bluebird';
import DB from './DB';
import Publisher from './Publisher';
import config from '../config';
import * as _ from 'lodash';

import VK from 'vk-io';

(async () => {
    const db = new DB();
    await db.init();

    const vk = new VK({
        phone: config.vk.phone,
        pass: config.vk.pass,
    });

    const auth = vk.auth.android();

    const vkAccount = await auth.run();

    vk.setToken(vkAccount.token);

    const publisher = new Publisher({ vk, db, vkAccount });

    (async function makePost() {
        const now = new Date().getHours();
        if (now >= config.postTime.betweenHours[0] && now <= config.postTime.betweenHours[1]) {
            await publisher.publish();
        }

        setTimeout(async () => {
            await makePost();
        }, config.postTime.every * 1000 + _.random(config.postTime.randomOver[0] * 1000, config.postTime.randomOver[1] * 1000));
    })();
})();
