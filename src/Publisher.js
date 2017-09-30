import fs from 'fs-extra';
import path from 'path';
import * as _ from 'lodash';
import config from '../config';
import recursiveReaddir from "recursive-readdir";

export default class Publisher {
    constructor(options) {
        this.db = options.db;
        this.vk = options.vk;
        this.vkAccount = options.vkAccount;
    }

    async _postImage(fileName) {
        const photos = await this.vk.upload.album({
            album_id: config.vk.albumId,
            source: [fs.createReadStream(fileName)],
        });

        const photoId = _.get(photos, '0.id');

        await this.vk.api.wall.post({
            owner_id: this.vkAccount.user,
            attachments: `photo${this.vkAccount.user}_${photoId}`,
        });
    }

    async publish() {
        let images = await recursiveReaddir(path.join('storage', 'images'));
        images = _.shuffle(images);

        for (const fileName of images) {
            if (_.startsWith(fileName, '.')) {
                continue;
            }
            const imagePosted = await this.db.isPostedImageExist(fileName);
            if (!imagePosted) {
                await this._postImage(fileName);
                await this.db.insertPostedImage(fileName);
                break;
            }
        }
    }
}
