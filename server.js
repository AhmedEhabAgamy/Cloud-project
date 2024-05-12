const express = require('express');
const cors = require('cors');
const mysql2 = require('mysql2/promise');

const app = express();
app.use(cors())
app.use(express.static("./frontend"))
const PORT = 3000;


async function connectToDatabase() {
    try {
        const connection = await mysql2.createConnection({
            host: 'db',
            user: 'root',
            password: 'root',
            database: 'student',
            port: 3306,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        console.log('Connected to MySQL database');
        return connection;
    } catch (err) {
        console.error('Error connecting to MySQL:', err);
        throw err; // Throw the error to handle it outside this function if needed
    }
}

async function createTable(connection){
    const createTableQuery = `
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT,
    cgpa DECIMAL(3,2) CHECK (cgpa>=0 AND cgpa<=4),
    additional_data TEXT
)`
    const insertQuery = `
INSERT INTO students (name, age, cgpa, additional_data) VALUES
('Ahmed Ehab', 20, 3.90, 'Likes studying'),
('Ahmed Mourad', 20, 3.90, 'Likes sports'),
('Marwan Tarek', 21, 3.90, 'Likes reading'),
('Yousef Mohamed', 20, 3.90, 'Likes tennis'),
('Adham Moataz', 20, 3.90, 'Likes video games')
`
    try {
        await connection.execute(createTableQuery);
        await connection.execute(insertQuery);
        console.log('Students table created or already exists');
    } catch (err) {
        console.error('Error creating students table:', err);
    }
}

app.get('/students', async (req, res) => {
    try {
        const connection = await connectToDatabase();
        await createTable(connection);
        const [rows, fields] = await connection.query('SELECT * FROM students');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching data from MySQL:', err);
        res.status(500).json({ error: 'Failed to fetch data from MySQL' });
    }
});

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
});


app.on("error", (err)=> {
    console.error('Error starting server:', err);
})



