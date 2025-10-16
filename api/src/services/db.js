import Database from 'better-sqlite3';
import path from 'path';

export const db = new Database(path.resolve('pokedex.db'), { fileMustExist: false });

export function setupDatabase() {
    db.exec(`
    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      members TEXT NOT NULL
    );
  `);
    console.log('Base de datos SQLite conectada y tabla "teams" asegurada.');
}

setupDatabase();