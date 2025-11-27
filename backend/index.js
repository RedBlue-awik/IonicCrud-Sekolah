require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- Koneksi Database ---
async function getConnection() {
    return await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
}

// --- Middleware Autentikasi ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- Middleware Role Guru ---
const guruOnly = (req, res, next) => {
    if (req.user.role !== 'guru') return res.status(403).json({ message: 'Akses ditolak: Hanya untuk guru' });
    next();
};

// --- ROUTES ---
// --- LOGIN ---
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const connection = await getConnection();
    try {
        const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) return res.status(400).json({ message: 'User tidak ditemukan' });
        const user = rows[0];
        if (password !== user.password) {
            return res.status(400).json({ message: 'Password salah' });
        }
        const token = jwt.sign({ id: user.id, role: user.role, id_guru: user.id_guru, id_siswa: user.id_siswa }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, role: user.role });
    } catch (error) {
        res.status(500).send('Error server');
    } finally {
        await connection.end();
    }
});

// --- DASHBOARD ---
app.get('/api/dashboard', authenticateToken, async (req, res) => {
    const connection = await getConnection();
    try {
        const [totalSiswa] = await connection.execute('SELECT COUNT(*) as count FROM siswa');
        const [totalGuru] = await connection.execute('SELECT COUNT(*) as count FROM guru');
        const [totalKelas] = await connection.execute('SELECT COUNT(*) as count FROM kelas');
        const [totalMapel] = await connection.execute('SELECT COUNT(*) as count FROM mata_pelajaran');
        res.json({
            totalSiswa: totalSiswa[0].count,
            totalGuru: totalGuru[0].count,
            totalKelas: totalKelas[0].count,
            totalMapel: totalMapel[0].count
        });
    } catch (error) {
        res.status(500).send('Error mengambil data dashboard');
    } finally {
        await connection.end();
    }
});

// --- CRUD JURUSAN ---
app.get('/api/jurusan', authenticateToken, async (req, res) => {
    const connection = await getConnection();
    try {
        const [rows] = await connection.execute('SELECT * FROM jurusan ORDER BY nama_jurusan ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).send('Error mengambil data jurusan');
    } finally {
        await connection.end();
    }
});

// --- CRUD KELAS ---
app.get('/api/kelas', authenticateToken, async (req, res) => {
    const connection = await getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT k.id, k.tingkatan, k.nama_kelas, j.nama_jurusan, k.id_jurusan
            FROM kelas k
            LEFT JOIN jurusan j ON k.id_jurusan = j.id
            ORDER BY k.tingkatan, k.nama_kelas ASC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).send('Error mengambil data kelas');
    } finally {
        await connection.end();
    }
});

app.post('/api/kelas', authenticateToken, guruOnly, async (req, res) => {
    const { tingkatan, nama_kelas, id_jurusan } = req.body;
    const connection = await getConnection();
    try {
        const [result] = await connection.execute('INSERT INTO kelas (tingkatan, nama_kelas, id_jurusan) VALUES (?, ?, ?)', [tingkatan, nama_kelas, id_jurusan]);
        res.json({ message: 'Kelas berhasil ditambahkan', id: result.insertId });
    } catch (error) {
        res.status(500).send('Error menambah kelas');
    } finally {
        await connection.end();
    }
});

app.put('/api/kelas/:id', authenticateToken, guruOnly, async (req, res) => {
    const { id } = req.params;
    const { tingkatan, nama_kelas, id_jurusan } = req.body;
    const connection = await getConnection();
    try {
        await connection.execute('UPDATE kelas SET tingkatan = ?, nama_kelas = ?, id_jurusan = ? WHERE id = ?', [tingkatan, nama_kelas, id_jurusan, id]);
        res.json({ message: 'Kelas berhasil diupdate' });
    } catch (error) {
        res.status(500).send('Error mengupdate kelas');
    } finally {
        await connection.end();
    }
});

app.delete('/api/kelas/:id', authenticateToken, guruOnly, async (req, res) => {
    const { id } = req.params;
    const connection = await getConnection();
    try {
        await connection.execute('DELETE FROM kelas WHERE id = ?', [id]);
        res.json({ message: 'Kelas berhasil dihapus' });
    } catch (error) {
        res.status(500).send('Error menghapus kelas');
    } finally {
        await connection.end();
    }
});

// --- CRUD MATA PELAJARAN ---
app.get('/api/mata-pelajaran', authenticateToken, async (req, res) => {
    const connection = await getConnection();
    try {
        const [rows] = await connection.execute('SELECT * FROM mata_pelajaran ORDER BY nama_mapel ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).send('Error mengambil data mata pelajaran');
    } finally {
        await connection.end();
    }
});

app.post('/api/mata-pelajaran', authenticateToken, guruOnly, async (req, res) => {
    const { nama_mapel } = req.body;
    const connection = await getConnection();
    try {
        const [result] = await connection.execute('INSERT INTO mata_pelajaran (nama_mapel) VALUES (?)', [nama_mapel]);
        res.json({ message: 'Mata pelajaran berhasil ditambahkan', id: result.insertId });
    } catch (error) {
        res.status(500).send('Error menambah mata pelajaran');
    } finally {
        await connection.end();
    }
});

app.put('/api/mata-pelajaran/:id', authenticateToken, guruOnly, async (req, res) => {
    const { id } = req.params;
    const { nama_mapel } = req.body;
    const connection = await getConnection();
    try {
        await connection.execute('UPDATE mata_pelajaran SET nama_mapel = ? WHERE id = ?', [nama_mapel, id]);
        res.json({ message: 'Mata pelajaran berhasil diupdate' });
    } catch (error) {
        res.status(500).send('Error mengupdate mata pelajaran');
    } finally {
        await connection.end();
    }
});

app.delete('/api/mata-pelajaran/:id', authenticateToken, guruOnly, async (req, res) => {
    const { id } = req.params;
    const connection = await getConnection();
    try {
        await connection.execute('DELETE FROM mata_pelajaran WHERE id = ?', [id]);
        res.json({ message: 'Mata pelajaran berhasil dihapus' });
    } catch (error) {
        res.status(500).send('Error menghapus mata pelajaran');
    } finally {
        await connection.end();
    }
});

// --- CRUD GURU ---
app.get('/api/guru', authenticateToken, async (req, res) => {
    const connection = await getConnection();
    try {
        const [rows] = await connection.execute('SELECT * FROM guru ORDER BY nama_guru ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).send('Error mengambil data guru');
    } finally {
        await connection.end();
    }
});

app.post('/api/guru', authenticateToken, guruOnly, async (req, res) => {
    const { nip, nama_guru, username, password } = req.body;
    const connection = await getConnection();

    try {
        await connection.beginTransaction();

        const [result] = await connection.execute('INSERT INTO guru (nip, nama_guru) VALUES (?, ?)', [nip, nama_guru]);
        const guruId = result.insertId;

        await connection.execute(
            'INSERT INTO users (username, password, role, id_guru) VALUES (?, ?, ?, ?)',
            [username, password, 'guru', guruId] 
        );

        await connection.commit();
        res.json({ message: 'Guru dan akunnya berhasil ditambahkan', id: guruId });

    } catch (error) {
        await connection.rollback();
        console.error('Error menambah guru dan user:', error);
        res.status(500).send('Error menambah guru dan akunnya');
    } finally {
        await connection.end();
    }
});


app.put('/api/guru/:id', authenticateToken, guruOnly, async (req, res) => {
    const { id } = req.params;
    const { nip, nama_guru } = req.body;
    const connection = await getConnection();
    try {
        await connection.execute('UPDATE guru SET nip = ?, nama_guru = ? WHERE id = ?', [nip, nama_guru, id]);
        res.json({ message: 'Guru berhasil diupdate' });
    } catch (error) {
        res.status(500).send('Error mengupdate guru');
    } finally {
        await connection.end();
    }
});

app.delete('/api/guru/:id', authenticateToken, guruOnly, async (req, res) => {
    const { id } = req.params;
    const connection = await getConnection();
    try {
        await connection.execute('DELETE FROM guru WHERE id = ?', [id]);
        res.json({ message: 'Guru berhasil dihapus' });
    } catch (error) {
        res.status(500).send('Error menghapus guru');
    } finally {
        await connection.end();
    }
});

// --- CRUD SISWA ---
app.get('/api/siswa', authenticateToken, async (req, res) => {
    const connection = await getConnection();
    try {
        let query = `
            SELECT s.id, s.nis, s.nama_siswa, k.tingkatan, k.nama_kelas, j.nama_jurusan, s.id_kelas
            FROM siswa s
            LEFT JOIN kelas k ON s.id_kelas = k.id
            LEFT JOIN jurusan j ON k.id_jurusan = j.id
        `;
        const params = [];
        if (req.user.role === 'siswa') {
            query += ' WHERE s.id = ?';
            params.push(req.user.id_siswa);
        }
        query += ' ORDER BY s.nama_siswa ASC';
        const [rows] = await connection.execute(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).send('Error mengambil data siswa');
    } finally {
        await connection.end();
    }
});

app.post('/api/siswa', authenticateToken, guruOnly, async (req, res) => {
    const { nis, nama_siswa, id_kelas, username, password } = req.body;
    const connection = await getConnection();

    try {
        await connection.beginTransaction();

        const [result] = await connection.execute('INSERT INTO siswa (nis, nama_siswa, id_kelas) VALUES (?, ?, ?)', [nis, nama_siswa, id_kelas]);
        const siswaId = result.insertId;

        await connection.execute(
            'INSERT INTO users (username, password, role, id_siswa) VALUES (?, ?, ?, ?)',
            [username, password, 'siswa', siswaId] 
        );

        await connection.commit();
        res.json({ message: 'Siswa dan akunnya berhasil ditambahkan', id: siswaId });

    } catch (error) {
        await connection.rollback();
        console.error('Error menambah siswa dan user:', error);
        res.status(500).send('Error menambah siswa dan akunnya');
    } finally {
        await connection.end();
    }
});


app.put('/api/siswa/:id', authenticateToken, guruOnly, async (req, res) => {
    const { id } = req.params;
    const { nis, nama_siswa, id_kelas } = req.body;
    const connection = await getConnection();
    try {
        await connection.execute('UPDATE siswa SET nis = ?, nama_siswa = ?, id_kelas = ? WHERE id = ?', [nis, nama_siswa, id_kelas, id]);
        res.json({ message: 'Siswa berhasil diupdate' });
    } catch (error) {
        res.status(500).send('Error mengupdate siswa');
    } finally {
        await connection.end();
    }
});

app.delete('/api/siswa/:id', authenticateToken, guruOnly, async (req, res) => {
    const { id } = req.params;
    const connection = await getConnection();
    try {
        await connection.execute('DELETE FROM siswa WHERE id = ?', [id]);
        res.json({ message: 'Siswa berhasil dihapus' });
    } catch (error) {
        res.status(500).send('Error menghapus siswa');
    } finally {
        await connection.end();
    }
});

// --- CRUD PENGAJAR ---
app.get('/api/pengajar', authenticateToken, async (req, res) => {
    const connection = await getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT p.id, g.nama_guru, m.nama_mapel, k.tingkatan, k.nama_kelas
            FROM pengajar p
            JOIN guru g ON p.id_guru = g.id
            JOIN mata_pelajaran m ON p.id_mapel = m.id
            JOIN kelas k ON p.id_kelas = k.id
            ORDER BY g.nama_guru ASC, k.nama_kelas ASC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).send('Error mengambil data pengajar');
    } finally {
        await connection.end();
    }
});

app.post('/api/pengajar', authenticateToken, guruOnly, async (req, res) => {
    const { id_guru, id_mapel, id_kelas } = req.body;
    const connection = await getConnection();
    try {
        const [result] = await connection.execute('INSERT INTO pengajar (id_guru, id_mapel, id_kelas) VALUES (?, ?, ?)', [id_guru, id_mapel, id_kelas]);
        res.json({ message: 'Penempatan guru berhasil ditambahkan', id: result.insertId });
    } catch (error) {
        res.status(500).send('Error menambah penempatan guru');
    } finally {
        await connection.end();
    }
});

app.put('/api/pengajar/:id', authenticateToken, guruOnly, async (req, res) => {
    const { id } = req.params;
    const { id_guru, id_mapel, id_kelas } = req.body;
    const connection = await getConnection();
    try {
        await connection.execute('UPDATE pengajar SET id_guru = ?, id_mapel = ?, id_kelas = ? WHERE id = ?', [id_guru, id_mapel, id_kelas, id]);
        res.json({ message: 'Penempatan guru berhasil diupdate' });
    } catch (error) {
        res.status(500).send('Error mengupdate penempatan guru');
    } finally {
        await connection.end();
    }
});

app.delete('/api/pengajar/:id', authenticateToken, guruOnly, async (req, res) => {
    const { id } = req.params;
    const connection = await getConnection();
    try {
        await connection.execute('DELETE FROM pengajar WHERE id = ?', [id]);
        res.json({ message: 'Penempatan guru berhasil dihapus' });
    } catch (error) {
        res.status(500).send('Error menghapus penempatan guru');
    } finally {
        await connection.end();
    }
});


app.listen(port, () => {
    console.log(`Server backend berjalan di http://localhost:${port}`);
});