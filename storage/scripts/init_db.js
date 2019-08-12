const sqlite3 = require("sqlite3").verbose();
const { jwt_generator } = require("./generate_jwt");

const DB_PATH = '../data.db';

// Define and init new DB
const db = new sqlite3.Database(DB_PATH, function(err) {
    if (err) {
        console.log(err);
        return
    }
    console.log('Connected to ' + DB_PATH + ' database.');
});

/*
// Define scheme
dbSchema = `CREATE TABLE IF NOT EXISTS Users (
        id varchar UNIQUE,
        name varchar UNIQUE,
        access_token varchar UNIQUE
    );

    CREATE TABLE IF NOT EXISTS Files (
        id integer UNIQUE,
        name varchar,
        size int,
        created_at date,
        updated_at date,
        deleted_at date,
        access_type text,
        path varchar,
        username varchar,
        access_token varchar
    );`;

db.exec(dbSchema, function(err) {
    if (err) {
        console.log(err)
    }
});

// Define users
const user1Id = 'qAzef32F';
const user1Name = 'user1';
const user1Token = jwt_generator(user1Id);

const user2Id = 'hT9Lmdx';
const user2Name = 'user2';
const user2Token = jwt_generator(user2Id);

// Define sql to insert users
const user1_sql = `INSERT INTO Users VALUES ('${user1Id}','${user1Name}','${user1Token}')`;
const user2_sql = `INSERT INTO Users VALUES ('${user2Id}','${user2Name}','${user2Token}')`;

// Insert users
const db_action = function(sql) {
    db.run(sql, function(err) {
        if (err) {
            return console.log(err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
    })
};

db_action(user1_sql);
db_action(user2_sql);

 */

const users_sql = `SELECT * FROM Users`;


// Get users data for testing
db.all(users_sql, [], function(err, rows) {
    if (err) {
        throw err;
    }
    rows.forEach(function(row) {
        console.log(row);
    });
});



// db.all(`SELECT * FROM Files`, [], function (err, rows) {
//     if (err) {
//         throw err;
//     } else {
//         rows.forEach(function (row) {
//             console.log(row)
//         })
//     }
// });

/* Experimenting with Promise
let getUserToken = function(username) {
    return new Promise(function(resolve, reject) {
        const sql = `SELECT * FROM Users as user WHERE user.name = '${username}'`;
        //const sql = `SELECT * FROM Users`;
        db.get(sql, function (err, row) {
            if (err) {
                reject(err.message)
            } else {
                let single_row = {id: row.id, username: row.name, token: row.access_token};
                //let rows_obj = {statement: this, rows: rows};
                resolve(single_row);
            }
        })
    })
};

user_data = getUserToken('user1');
user_data.then(function (result) {
    console.log(result)
});

 */

db.close();