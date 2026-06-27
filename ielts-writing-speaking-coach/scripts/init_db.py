#!/usr/bin/env python3
import argparse, sqlite3, pathlib
SCHEMA="""
CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT, ielts_type TEXT, target_band REAL, current_band REAL, test_date TEXT, native_language TEXT, weekly_study_hours REAL);
CREATE TABLE IF NOT EXISTS practice_sessions (id TEXT PRIMARY KEY, user_id TEXT, skill TEXT, prompt_id TEXT, date TEXT DEFAULT CURRENT_TIMESTAMP, duration_minutes INTEGER, self_reflection TEXT, coach_summary TEXT);
CREATE TABLE IF NOT EXISTS writing_submissions (id TEXT PRIMARY KEY, user_id TEXT, session_id TEXT, task_type TEXT, prompt TEXT, response_text TEXT, word_count INTEGER, estimated_overall_band REAL, task_band REAL, coherence_band REAL, lexical_band REAL, grammar_band REAL, feedback_json TEXT, revised_response_text TEXT);
CREATE TABLE IF NOT EXISTS speaking_submissions (id TEXT PRIMARY KEY, user_id TEXT, session_id TEXT, speaking_part TEXT, prompt TEXT, transcript TEXT, audio_file_path TEXT, duration_seconds INTEGER, estimated_overall_band REAL, fluency_band REAL, lexical_band REAL, grammar_band REAL, pronunciation_band REAL, feedback_json TEXT);
CREATE TABLE IF NOT EXISTS mistake_log (id TEXT PRIMARY KEY, user_id TEXT, session_id TEXT, source_type TEXT, error_type TEXT, original_text TEXT, corrected_text TEXT, explanation TEXT, severity INTEGER, recurrence_count INTEGER DEFAULT 1, next_review_date TEXT, status TEXT DEFAULT 'new');
CREATE TABLE IF NOT EXISTS vocabulary_bank (id TEXT PRIMARY KEY, user_id TEXT, topic TEXT, word_or_phrase TEXT, definition TEXT, example_sentence TEXT, collocations TEXT, mastery_level INTEGER DEFAULT 1, next_review_date TEXT);
CREATE TABLE IF NOT EXISTS prompts (id TEXT PRIMARY KEY, module TEXT, task_type TEXT, topic TEXT, difficulty INTEGER, prompt_text TEXT, source_category TEXT);
"""
def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--db', default='data/ielts.sqlite'); args=ap.parse_args()
    pathlib.Path(args.db).parent.mkdir(parents=True, exist_ok=True)
    con=sqlite3.connect(args.db); con.executescript(SCHEMA); con.commit(); con.close(); print(f'initialized {args.db}')
if __name__=='__main__': main()
