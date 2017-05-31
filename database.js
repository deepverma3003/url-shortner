const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/urls';

const client = new pg.Client(connectionString);
client.connect();
const query = client.query(
  'CREATE TABLE items(id SERIAL PRIMARY KEY, url VARCHAR(40) not null, new_url VARCHAR(40))');
query.on('end', () => { client.end(); });