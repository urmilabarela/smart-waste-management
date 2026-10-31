
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const file = path.join(__dirname, 'data', 'users.json');

rl.question('Enter a new admin password: ', async (password) => {
    try {
        if (password.length < 8) {
            console.log('Password must be at least 8 characters.');
            return;
        }

        const users = JSON.parse(fs.readFileSync(file, 'utf8'));

        const admin = users.find(
            user => user.email === 'umabarde613@gmail.com'
        );

        if (!admin) {
            console.log('Admin account not found.');
            return;
        }

        admin.password = await bcrypt.hash(password, 10);
        admin.role = 'admin';

        fs.writeFileSync(file, JSON.stringify(users, null, 2));

        console.log('Admin account updated successfully!');
    } catch (error) {
        console.log('Error:', error.message);
    } finally {
        rl.close();
    }
});
