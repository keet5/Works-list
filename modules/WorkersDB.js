const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('models/workers.sqlite');

db.serialize(() => {
    const sql = `
        CREATE TABLE IF NOT EXISTS workers (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            name CHAR(30),
            surname CHAR(30),
            birthday DATE,
            city CHAR(30),
            street CHAR(30),
            build CHAR(30),
            flat INT(4),
            "remoute-work" BIT,
            job CHAR(30),
            photo DATA
        )`;
    
    db.run(sql, error => {
        if (error)
            console.log(error.message)
    });
});

class Workers {
    static getList(fun) {
        db.all('SELECT id, name, surname, birthday, city, street, build, flat, "remoute-work", job FROM workers', fun);
    }

    static getImage(id, fun) {
        db.get('SELECT photo FROM workers WHERE id = ?', id, fun);
    }

    static find(id, fun) {
        db.get('SELECT * FROM workers WHERE id = ?', id, fun);
    }

    static create(data, fun) {
        const sql = `INSERT INTO workers(name, surname, birthday, city, street, build, flat, "remoute-work", job, photo) 
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        db.run(sql, data.name, data.surname, data.birthday, data.city, data.street, data.build, data.flat, data["remoute-work"], data.job, data.photo, fun);
    }

    static delete(id, fun) {
        db.run('DELETE FROM workers WHERE id = ?', id, fun);
    }

    static edit(id, data, fun) {
        const sql = `UPDATE workers SET name = ?, surname = ?, birthday = ?, city = ?, street = ?, build = ?, flat = ?, "remoute-work" = ?, job = ? WHERE id = ?`;
        db.run(sql,  data.name, data.surname, data.birthday, data.city, data.street, data.build, data.flat, data['remoute-work'], data.job, id, fun);
    }

    static editPhoto(id, photo, fun) {
        db.run(`UPDATE workers SET photo = ? WHERE id = ?`, photo, id, fun);
    }

    static deleteTable() {
        db.run('DROP TABLE workers', error => {
            if (error)
                console.log(error.message);
            else
                console.log('table was dropped');
        });
    }
}

module.exports = db;
module.exports.Workers = Workers;