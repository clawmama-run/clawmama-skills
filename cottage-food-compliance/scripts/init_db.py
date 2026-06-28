#!/usr/bin/env python3
import argparse, sqlite3
from pathlib import Path
p=argparse.ArgumentParser(); p.add_argument('--db', default='cottage_food.sqlite'); args=p.parse_args()
Path(args.db).parent.mkdir(parents=True, exist_ok=True)
con=sqlite3.connect(args.db)
con.executescript("""
CREATE TABLE IF NOT EXISTS seller(id INTEGER PRIMARY KEY, name TEXT, state TEXT, city TEXT, county TEXT, notes TEXT);
CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY, name TEXT, ingredients TEXT, process TEXT, storage TEXT, sales_channel TEXT, status TEXT);
CREATE TABLE IF NOT EXISTS rules(id INTEGER PRIMARY KEY, jurisdiction TEXT, topic TEXT, summary TEXT, source_url TEXT, reviewed_at TEXT);
CREATE TABLE IF NOT EXISTS tasks(id INTEGER PRIMARY KEY, due_date TEXT, task TEXT, status TEXT DEFAULT 'open');
CREATE TABLE IF NOT EXISTS sales(id INTEGER PRIMARY KEY, date TEXT, amount REAL, channel TEXT, product TEXT);
""")
con.commit(); con.close(); print(f'initialized {args.db}')
