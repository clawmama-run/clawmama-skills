#!/usr/bin/env python3
import argparse, sqlite3, pathlib
SCHEMA = """
CREATE TABLE IF NOT EXISTS companies (id TEXT PRIMARY KEY, name TEXT NOT NULL, website TEXT, industry TEXT, notes TEXT);
CREATE TABLE IF NOT EXISTS jobs (id TEXT PRIMARY KEY, company_id TEXT, title TEXT NOT NULL, url TEXT, source TEXT, location TEXT, description TEXT, fit_score INTEGER, priority TEXT, stage TEXT, next_action TEXT, next_action_due TEXT, notes TEXT);
CREATE TABLE IF NOT EXISTS contacts (id TEXT PRIMARY KEY, company_id TEXT, name TEXT NOT NULL, title TEXT, email TEXT, linkedin_url TEXT, relationship_type TEXT, last_contacted_at TEXT, next_follow_up_at TEXT, notes TEXT);
CREATE TABLE IF NOT EXISTS applications (id TEXT PRIMARY KEY, job_id TEXT NOT NULL, applied_at TEXT, application_method TEXT, resume_version TEXT, current_stage TEXT, outcome TEXT, follow_up_date TEXT, notes TEXT);
CREATE TABLE IF NOT EXISTS interviews (id TEXT PRIMARY KEY, application_id TEXT NOT NULL, interview_type TEXT, scheduled_at TEXT, prep_notes TEXT, debrief_notes TEXT, follow_up_sent INTEGER DEFAULT 0, outcome TEXT);
CREATE TABLE IF NOT EXISTS star_stories (id TEXT PRIMARY KEY, title TEXT NOT NULL, competencies TEXT, situation TEXT, task TEXT, action TEXT, result TEXT, learning TEXT, metrics TEXT);
CREATE TABLE IF NOT EXISTS weekly_reviews (id TEXT PRIMARY KEY, week_start TEXT, week_end TEXT, applications_submitted INTEGER, referrals_requested INTEGER, interviews_completed INTEGER, rejections_received INTEGER, offers_received INTEGER, key_wins TEXT, bottlenecks TEXT, next_week_priorities TEXT);
"""
def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--db', default='data/job_search.sqlite'); args=ap.parse_args()
    pathlib.Path(args.db).parent.mkdir(parents=True, exist_ok=True)
    con=sqlite3.connect(args.db); con.executescript(SCHEMA); con.commit(); con.close()
    print(f"initialized {args.db}")
if __name__=='__main__': main()
