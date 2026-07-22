---
name: uspto-patent-trademark-research
description: "Research United States patents and USPTO federal trademarks through the patent_mcp_server MCP. Use for patent searches, federal trademark knockout searches, status and classification checks, ownership/assignment research, and evidence-backed research briefs. Does not cover U.S. Copyright Office records, state marks, common-law rights, or legal opinions."
license: MIT
metadata:
  author: clawmama
  version: "1.0.0"
  homepage: "https://github.com/riemannzeta/patent_mcp_server"
---

# USPTO Patent & Federal Trademark Research

Use this Skill to operate the open-source [`patent_mcp_server`](https://github.com/riemannzeta/patent_mcp_server) MCP by Michael Frank Martin from Hermes Agent. It supports research against USPTO patent and federal trademark sources. Treat the results as research evidence and issue-spotting, not legal advice or a registration/clearance opinion.

## Scope

This Skill can help with:

- searching published U.S. patents and patent applications;
- retrieving patent documents and basic bibliographic details;
- searching USPTO federal trademark records by wording, owner, goods/services, class, or live/dead status;
- checking trademark classes and USPTO status codes;
- retrieving authoritative TSDR status, documents, and images when a TSDR key is configured;
- reviewing USPTO-recorded trademark assignment and recordation history;
- preparing a cited research brief and a focused question list for a U.S. attorney.

This Skill does **not** provide:

- U.S. Copyright Office registration or ownership searches;
- state trademark searches;
- common-law trademark, business-name, domain, marketplace, app-store, or social-media clearance;
- a legal conclusion about registrability, validity, infringement, freedom to operate, or litigation risk;
- a guarantee that USPTO internal website APIs will remain stable.

## Runtime setup

The Catalog Agent installs a pinned copy automatically. For manual installation, keep it isolated:

```bash
python3 -c 'import sys; assert (3, 10) <= sys.version_info < (3, 14), "Python 3.10-3.13 required"'
VERSION_SHA="67ff3136491a52637ef97dd0093b10542f488097"
VENV="$HOME/.local/share/clawmama/patent-mcp-server-$VERSION_SHA"
python3 -m venv "$VENV"
"$VENV/bin/python" -m pip install --upgrade pip
"$VENV/bin/python" -m pip install \
  "git+https://github.com/riemannzeta/patent_mcp_server.git@$VERSION_SHA"
mkdir -p "$HOME/.local/bin"
ln -sfn "$VENV/bin/patent-mcp-server" "$HOME/.local/bin/patent-mcp-server"
```

Register the stdio MCP with Hermes. The current CLI asks whether to enable the discovered tools, so answer the prompt explicitly in unattended environments:

```bash
printf 'y\n' | hermes mcp add uspto-research \
  --command "$HOME/.local/bin/patent-mcp-server"
hermes mcp test uspto-research
```

Restart Hermes after adding or changing an MCP. The tools appear with the prefix `mcp_uspto_research_`.

### Optional credentials

The server has useful no-key search paths, but some authoritative tools need separate USPTO credentials:

- `USPTO_API_KEY`: USPTO Open Data Portal and PTAB tools.
- `TSDR_API_KEY`: authoritative trademark status, documents, and images.
- `TMSEARCH_WAF_TOKEN`: an optional short-lived token from the user's own authorized USPTO browser session, only when permitted and necessary. Never obtain, share, or reuse another person's token, bypass a challenge, or automate around an access-control decision.

The Catalog does not collect or embed user credentials. Add optional USPTO credentials only as a user-side post-install step using a private terminal and the current Hermes credential/configuration workflow. Hermes MCP configuration may persist environment values in the user's local Hermes configuration, so inspect its location and permissions before entering a secret. Never enter secrets in shared shells, recordings, tickets, reports, prompts, source files, or public content. Do not register empty values; rotate or remove stale credentials promptly.

After configuring credentials, run:

```bash
hermes mcp test uspto-research
```

If USPTO rejects automated access, stop or retry later and use an authorized public alternative. Respect USPTO terms, rate limits, and automated-access policies.

## Tool selection

See `references/tool-map.md` for the full decision map. Prefer active tools and avoid the 25 compatibility tools that report `API_UNAVAILABLE`.

### Federal trademark first pass

1. Clarify the proposed wording, goods/services, target customers, and relevant Nice classes.
2. Use `tm_search_trademarks` for a broad federal knockout search.
3. Search exact wording, close spelling variants, spacing variants, and meaningful shared terms separately.
4. Filter by live/dead status when useful, but do not discard dead records without explaining why.
5. Use `tm_get_trademark` for a selected record.
6. Use `tsdr_get_trademark_status` and TSDR document tools when the official USPTO record retrieved at the stated time matters and `TSDR_API_KEY` is configured.
7. Use `tm_search_assignments` to inspect recorded ownership changes.
8. Compare wording, sound, appearance, commercial impression, goods/services, classes, owner, and status without declaring legal confusion.

### Patent first pass

1. Convert the user's invention into concepts, components, functions, synonyms, likely CPC classes, and a date boundary.
2. Use `ppubs_search_patents` and `ppubs_search_applications` for no-key searches.
3. Use title/abstract/claims queries separately when precision matters.
4. Retrieve promising documents with `ppubs_get_patent_by_number`, `ppubs_get_full_document`, or the PDF tool.
5. When `USPTO_API_KEY` is configured, use ODP tools for application metadata, continuity, transactions, documents, assignments, attorney, and priority records.
6. Record query strings, dates, source, identifiers, and why each result may be relevant.
7. Never call a search complete merely because no exact phrase matched.

## Research workflow

1. **Define the question.** Record jurisdiction, asset type, intended use, date range, owner/applicant names, wording or invention concepts, and desired output.
2. **State coverage.** Say which USPTO sources and tools will be used, which credentials are available, and what remains outside scope.
3. **Run multiple queries.** Do not rely on one exact-string search.
4. **Inspect records.** Open the strongest candidates and distinguish search-index data from authoritative status/documents.
5. **Cross-check identifiers.** Preserve patent/application numbers, trademark serial/registration numbers, owners, classes, dates, and URLs where available.
6. **Separate facts from analysis.** Label observed record facts, similarity/relevance observations, missing evidence, and professional-review questions.
7. **Deliver a bounded brief.** Use `templates/research-brief.md` and include the search date and limitations.

## Output requirements

A useful brief contains:

- research question and scope;
- sources, tools, credentials used, and search date;
- exact queries and filters;
- a concise candidate table with stable identifiers;
- record facts separated from analyst observations;
- unresolved gaps and searches not performed;
- a clear statement that the output is not legal advice;
- next steps, including when attorney review is appropriate.

For trademark work, explicitly state that USPTO federal results do not cover state or common-law rights. For patent work, explicitly state that keyword research is not a legal prior-art opinion or freedom-to-operate analysis.

## Failure handling

- If `tm_search_trademarks` returns WAF or transient errors, report the failure and retry later or use an authorized public alternative. Only consider a current `TMSEARCH_WAF_TOKEN` from the user's own authorized session when permitted; never bypass a challenge or access-control decision.
- If an ODP/PTAB tool returns 403, check whether `USPTO_API_KEY` is configured for the MCP subprocess.
- If a TSDR tool returns 401/404, confirm that the key is specifically authorized for TSDR; an ODP key may not work.
- If a tool returns `API_UNAVAILABLE`, switch to the replacement named in `references/tool-map.md` or mark the requested data unavailable.
- If the server cannot be reached, run `hermes mcp test uspto-research` and verify the pinned executable path.

## Safety and professional boundary

- Do not submit an unpublished invention's full claims, core formula, source code, customer secrets, or NDA-protected details as search terms. Abstract sensitive concepts first; for high-value confidential material, confirm the data-handling environment and consult patent counsel before searching.
- USPTO assignment recordation does not by itself establish transaction validity, a complete chain of title, or current beneficial ownership.
- PTAB is a patent tribunal and does not cover TTAB trademark disputes. This MCP does not provide a comprehensive TTAB search.
- Do not present search results as a legal clearance opinion, registration prediction, patentability opinion, infringement determination, or freedom-to-operate opinion.
- Do not claim comprehensive coverage when state, common-law, copyright, litigation, TTAB, marketplace, or non-U.S. sources were not searched.
- Do not infer ownership solely from a search-result card; inspect current status and assignment evidence when relevant.
- Do not submit applications, sign declarations, contact third parties, or take other legal actions without explicit user direction and appropriate professional review.
- Encourage consultation with a qualified U.S. intellectual-property attorney for filing decisions, deadlines, disputes, investment, licensing, or high-stakes launch decisions.

## Verification checklist

- [ ] The MCP executable is pinned to the reviewed upstream commit.
- [ ] `hermes mcp test uspto-research` succeeds.
- [ ] The selected tool is active rather than compatibility-only.
- [ ] Queries and search date are recorded.
- [ ] Stable USPTO identifiers are preserved.
- [ ] Facts, observations, gaps, and next steps are separated.
- [ ] Federal trademark coverage limitations are visible.
- [ ] Copyright capability is not claimed.
- [ ] No credentials appear in the output.
- [ ] The final brief states that it is research, not legal advice.

## Attribution

`patent_mcp_server` is maintained by Michael Frank Martin (`riemannzeta`) and licensed under MIT. ClawMama provides this operating Skill and Agent packaging and does not imply endorsement by USPTO or the upstream maintainer.
