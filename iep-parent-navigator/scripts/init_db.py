#!/usr/bin/env python3
import argparse, sqlite3
from pathlib import Path
p=argparse.ArgumentParser(); p.add_argument('--db', default='iep_binder.sqlite'); args=p.parse_args()
Path(args.db).parent.mkdir(parents=True, exist_ok=True)
con=sqlite3.connect(args.db)
con.executescript("""
CREATE TABLE IF NOT EXISTS child_profile(id INTEGER PRIMARY KEY, name TEXT, grade TEXT, strengths TEXT, concerns TEXT, notes TEXT);
CREATE TABLE IF NOT EXISTS documents(id INTEGER PRIMARY KEY, title TEXT, type TEXT, date TEXT, summary TEXT, source TEXT);
CREATE TABLE IF NOT EXISTS accommodations(id INTEGER PRIMARY KEY, need TEXT, current_support TEXT, requested_support TEXT, evidence TEXT, status TEXT);
CREATE TABLE IF NOT EXISTS services(id INTEGER PRIMARY KEY, service TEXT, minutes TEXT, provider TEXT, status TEXT, notes TEXT);
CREATE TABLE IF NOT EXISTS meetings(id INTEGER PRIMARY KEY, date TEXT, purpose TEXT, attendees TEXT, notes TEXT);
CREATE TABLE IF NOT EXISTS communications(id INTEGER PRIMARY KEY, date TEXT, contact TEXT, topic TEXT, summary TEXT, follow_up TEXT);
CREATE TABLE IF NOT EXISTS tasks(id INTEGER PRIMARY KEY, due_date TEXT, task TEXT, owner TEXT, status TEXT DEFAULT 'open');
""")
con.commit(); con.close(); print(f'initialized {args.db}')
