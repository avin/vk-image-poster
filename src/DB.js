import path from 'path';
const sqlite3 = require('sqlite3').verbose();

export default class DB {
    constructor() {
        const file = path.join('storage', 'db.sqlite');
        this.rawDB = new sqlite3.Database(file);
    }

    async init() {
        await this._runCustomAsync(
            'CREATE TABLE IF NOT EXISTS posted_images (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, file_name STRING)',
        );
    }

    _runCustomAsync = (sql, params) =>
        new Promise((resolve, reject) => {
            this.rawDB.run(sql, params, function(err) {
                if (err) {
                    const responseObj = {
                        error: err,
                    };
                    reject(responseObj);
                } else {
                    const responseObj = {
                        statement: this,
                    };
                    resolve(responseObj);
                }
            });
        });

    _allCustomAsync = (sql, params) =>
        new Promise((resolve, reject) => {
            this.rawDB.all(sql, params, function cb(err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

    /**
     * Получить все названия файлов из базы
     *
     * @returns {Promise.<*>}
     */
    async getPostedImagesList() {
        try {
            const sql = 'SELECT file_name FROM posted_images';
            return await this._allCustomAsync(sql, []);
        } catch (e) {
            throw new Error(e);
        }
    }

    /**
     * Проверить наличие названия файла в базе
     *
     * @param fileName
     * @returns {Promise.<boolean>}
     */
    async isPostedImageExist(fileName) {
        try {
            const sql = 'SELECT id FROM posted_images WHERE file_name=(?) LIMIT 1';
            const res = await this._allCustomAsync(sql, [fileName]);
            return !!res.length;
        } catch (e) {
            throw new Error(e);
        }
    }

    /**
     * Добавить название файла в базу
     *
     * @param fileName
     * @returns {Promise.<void>}
     */
    async insertPostedImage(fileName) {
        try {
            const recordExist = await this.isPostedImageExist(fileName);
            if (!recordExist) {
                const sql = 'INSERT INTO posted_images(file_name) VALUES (?)';
                await this._runCustomAsync(sql, [fileName]);
            }
        } catch (e) {
            throw new Error(e);
        }
    }
}