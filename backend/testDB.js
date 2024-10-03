const db = require('./db/dbConfig');

async function testDatabaseConnection() {
  try {
    // Test the connection
    const connectionResult = await db.query('SELECT NOW()');
    console.log('Database connection successful. Current time:', connectionResult.rows[0].now);

    // Test if tables were created
    const tablesResult = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables in the database:');
    tablesResult.rows.forEach(row => console.log(row.table_name));

    // Test if users table has data
    const usersResult = await db.query('SELECT COUNT(*) FROM users');
    console.log('Number of users in the database:', usersResult.rows[0].count);

  } catch (error) {
    console.error('Error testing database:', error);
  } finally {
    // Close the database connection pool
    await db.pool.end();
  }
}

testDatabaseConnection();