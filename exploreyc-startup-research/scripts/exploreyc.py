#!/usr/bin/env python3
"""ExploreYC API helper (stdlib only).

Query the ExploreYC startup/company dataset (https://www.exploreyc.com/)
from the command line. Requires an API key in EXPLOREYC_API_KEY for all
commands that call the API. `export-url` only builds a URL and needs no key.

Environment:
  EXPLOREYC_API_KEY   required for API calls
  EXPLOREYC_BASE_URL  optional, default https://api.exploreyc.com/api/v1

Examples:
  python3 exploreyc.py auth-check
  python3 exploreyc.py search --query fintech --limit 10 --source yc
  python3 exploreyc.py companies --search ai --batch "Summer 2024" --limit 20
  python3 exploreyc.py company --slug stripe
  python3 exploreyc.py stats
  python3 exploreyc.py export-url --format csv --industry Fintech
"""

import argparse
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

DEFAULT_BASE_URL = "https://api.exploreyc.com/api/v1"
EXPORT_BASE_URL = "https://api.exploreyc.com"

RATE_LIMIT_HINT = (
    "Rate limit reached. ExploreYC plans: Free 5/day, Starter 500/day, "
    "Pro 5,000/day, Enterprise custom. For larger analyses, use the "
    "ExploreYC export feature (CSV/JSON) and analyze locally instead of "
    "issuing one API call per question."
)


def base_url():
    return os.environ.get("EXPLOREYC_BASE_URL", DEFAULT_BASE_URL).rstrip("/")


def api_key():
    key = os.environ.get("EXPLOREYC_API_KEY", "").strip()
    if not key:
        sys.stderr.write(
            "error: EXPLOREYC_API_KEY is not set.\n"
            "Get a key from https://www.exploreyc.com/api-docs and run:\n"
            "  export EXPLOREYC_API_KEY=your_key\n"
        )
        sys.exit(2)
    return key


def api_get(path, params=None):
    query = {k: v for k, v in (params or {}).items() if v is not None}
    url = base_url() + path
    if query:
        url += "?" + urllib.parse.urlencode(query)
    req = urllib.request.Request(
        url,
        headers={
            "Authorization": "Bearer " + api_key(),
            "Accept": "application/json",
            "User-Agent": "clawmama-exploreyc-skill/1.0",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as err:
        body = ""
        try:
            body = err.read().decode("utf-8", "replace")[:500]
        except Exception:
            pass
        if err.code == 401:
            sys.stderr.write(
                "error: 401 unauthorized - the API key was rejected. "
                "Check EXPLOREYC_API_KEY.\n"
            )
        elif err.code == 429:
            sys.stderr.write("error: 429 too many requests - " + RATE_LIMIT_HINT + "\n")
        else:
            sys.stderr.write("error: HTTP %d from %s\n" % (err.code, url))
        if body:
            sys.stderr.write(body + "\n")
        sys.exit(1)
    except urllib.error.URLError as err:
        sys.stderr.write("error: could not reach %s: %s\n" % (url, err.reason))
        sys.exit(1)
    except json.JSONDecodeError:
        sys.stderr.write("error: %s did not return valid JSON\n" % url)
        sys.exit(1)


def emit(data, compact):
    if compact:
        print(json.dumps(data, ensure_ascii=False, separators=(",", ":")))
    else:
        print(json.dumps(data, ensure_ascii=False, indent=2))


def build_export_url(fmt, params):
    query = {k: v for k, v in params.items() if v is not None}
    url = "%s/api/export/%s" % (EXPORT_BASE_URL, fmt)
    if query:
        url += "?" + urllib.parse.urlencode(query)
    return url


def add_filter_args(parser):
    parser.add_argument("--source", choices=["yc", "a16z", "all"],
                        help="data source (default: all)")
    parser.add_argument("--batch", help='batch name, e.g. "Summer 2024"')
    parser.add_argument("--industry", help="industry filter")
    parser.add_argument("--country", help="country filter")
    parser.add_argument("--search", help="free-text search filter")
    parser.add_argument("--is-hiring", action="store_true", default=None,
                        help="only companies that are hiring")
    parser.add_argument("--top-company", action="store_true", default=None,
                        help="only top companies")


def main(argv):
    top = argparse.ArgumentParser(
        prog="exploreyc.py",
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    top.add_argument("--compact", action="store_true", help="single-line JSON output")
    sub = top.add_subparsers(dest="command", required=True)

    sub.add_parser("auth-check", help="verify the API key by calling /sources")
    sub.add_parser("sources", help="list data sources and company counts")
    sub.add_parser("stats", help="dataset statistics")
    sub.add_parser("batches", help="list batches")
    sub.add_parser("industries", help="list industries")
    sub.add_parser("countries", help="list countries")

    p_search = sub.add_parser("search", help="full-text search across companies")
    p_search.add_argument("--query", required=True, help="search terms")
    p_search.add_argument("--limit", type=int, help="results per page (1-100)")
    p_search.add_argument("--offset", type=int, help="pagination offset")
    p_search.add_argument("--source", choices=["yc", "a16z", "all"], help="data source")

    p_companies = sub.add_parser("companies", help="list/filter companies")
    add_filter_args(p_companies)
    p_companies.add_argument("--limit", type=int, help="results per page (1-100, default 50)")
    p_companies.add_argument("--offset", type=int, help="pagination offset")

    p_company = sub.add_parser("company", help="fetch one company by id or slug")
    group = p_company.add_mutually_exclusive_group(required=True)
    group.add_argument("--id", help="company id")
    group.add_argument("--slug", help="company slug")

    p_export = sub.add_parser(
        "export-url",
        help="build an export URL (no API call; verify auth semantics "
             "against ExploreYC docs before automating)",
    )
    p_export.add_argument("--format", choices=["csv", "json"], default="csv")
    add_filter_args(p_export)

    args = top.parse_args(argv)

    if args.command in ("auth-check", "sources"):
        data = api_get("/sources")
        if args.command == "auth-check":
            emit({"ok": True, "sources": data}, args.compact)
        else:
            emit(data, args.compact)
    elif args.command in ("stats", "batches", "industries", "countries"):
        emit(api_get("/" + args.command), args.compact)
    elif args.command == "search":
        emit(api_get("/search", {
            "q": args.query, "limit": args.limit,
            "offset": args.offset, "source": args.source,
        }), args.compact)
    elif args.command == "companies":
        emit(api_get("/companies", {
            "search": args.search, "batch": args.batch,
            "industry": args.industry, "country": args.country,
            "source": args.source,
            "is_hiring": "true" if args.is_hiring else None,
            "top_company": "true" if args.top_company else None,
            "limit": args.limit, "offset": args.offset,
        }), args.compact)
    elif args.command == "company":
        if args.id:
            emit(api_get("/companies/" + urllib.parse.quote(args.id)), args.compact)
        else:
            emit(api_get("/companies/slug/" + urllib.parse.quote(args.slug)), args.compact)
    elif args.command == "export-url":
        url = build_export_url(args.format, {
            "search": args.search, "batch": args.batch,
            "industry": args.industry, "country": args.country,
            "source": args.source,
            "is_hiring": "true" if args.is_hiring else None,
            "top_company": "true" if args.top_company else None,
        })
        emit({
            "export_url": url,
            "note": "Export endpoint auth semantics may differ from the v1 API; "
                    "verify against ExploreYC docs before automating.",
        }, args.compact)


if __name__ == "__main__":
    main(sys.argv[1:])
