# patent_mcp_server tool map

Reviewed upstream commit: `67ff3136491a52637ef97dd0093b10542f488097`.

The server registers 61 tools. Thirty-six are active; twenty-five compatibility tools intentionally return `API_UNAVAILABLE`. Always inspect the current MCP descriptions because upstream availability can change.

## Active no-key or usually no-key tools

### Patent Public Search (PPUBS)

- `ppubs_search_patents` — granted U.S. patent search.
- `ppubs_search_applications` — published application search.
- `ppubs_get_full_document` — full document data.
- `ppubs_get_patent_by_number` — fetch by patent number.
- `ppubs_download_patent_pdf` — download a patent PDF.

PPUBS relies on an internal USPTO web application protocol rather than a stable public versioned API. Expect occasional breakage or throttling.

### Federal trademark search and assignment

- `tm_search_trademarks` — search federal records by wording, owner, goods/services, class, and status.
- `tm_get_trademark` — retrieve one indexed trademark record.
- `tm_search_assignments` — search recorded trademark assignments.
- `get_trademark_class_info` — explain Nice classes 1–45.
- `get_trademark_status_code` — explain USPTO trademark status codes.

`tmsearch.uspto.gov` is an undocumented internal interface and can be blocked by AWS WAF. It covers federal records, not state or common-law rights.

## Active tools requiring `USPTO_API_KEY`

### Open Data Portal

- `odp_get_application`
- `odp_get_application_metadata`
- `odp_get_continuity`
- `odp_get_assignment`
- `odp_get_adjustment`
- `odp_get_attorney`
- `odp_get_foreign_priority`
- `odp_get_transactions`
- `odp_get_documents`
- `odp_search_applications`
- `odp_search_datasets`
- `odp_get_dataset`

### PTAB

- `ptab_search_proceedings`
- `ptab_get_proceeding`
- `ptab_get_documents`
- `ptab_search_decisions`
- `ptab_get_decision`
- `ptab_search_appeals`
- `ptab_get_appeal`

## Active tools requiring `TSDR_API_KEY`

- `tsdr_get_trademark_status`
- `tsdr_list_trademark_documents`
- `tsdr_download_trademark_documents`
- `tsdr_get_trademark_image`

A USPTO ODP key may not authorize TSDR. Request the TSDR product separately.

## Utility tools

- `check_api_status` — summarize source availability and credential state.
- `get_cpc_info` — explain a CPC class.
- `get_status_code` — explain a patent application status code.

## Compatibility-only tool families

Do not choose these as the primary path unless the MCP reports they have become active:

- PatentsView tools — upstream API closed in 2026-03.
- Office Action tools — upstream API discontinued.
- Enriched Citation tools — upstream API discontinued.
- Patent Litigation tools — no equivalent ODP API; bulk data may be the only source.

When one returns `API_UNAVAILABLE`, preserve the message and follow its suggested replacement. Do not turn an unavailable response into an empty-result claim.

PTAB tools concern patents. They do not search Trademark Trial and Appeal Board (TTAB) disputes. The upstream server does not expose a comprehensive TTAB search API.

## Coverage statement for reports

Use wording like:

> Searched USPTO federal patent/trademark sources through patent_mcp_server on YYYY-MM-DD. The search does not cover U.S. Copyright Office records, state trademarks, common-law use, company names, domains, marketplaces, app stores, social media, or non-U.S. registers unless separately stated.
