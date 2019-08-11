const sqlite3 = require("sqlite3").verbose();

const db_path = './storage/data.db';
const db = new sqlite3.Database(db_path, function(err) {
    if (err) {
        console.log(err);
        return
    }
    console.log('Connected to ' + db_path + ' database.');
});

module.exports = {
    db_path,
    db,
};
