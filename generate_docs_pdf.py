import os
import re
import subprocess
import sys
import time
import mistune

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

DOCS_DIR = os.path.abspath("docs")
EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

CSS_STYLES = """
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

@page {
    size: A4;
    margin: 20mm 18mm 20mm 18mm;
}

* {
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 10pt;
    line-height: 1.6;
    color: #334155;
    background-color: #ffffff;
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
}

/* Header Banner & Metadata */
.doc-header {
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 14px;
    margin-bottom: 22px;
}

.doc-tag {
    display: inline-block;
    background: #eef2ff;
    color: #4338ca;
    font-size: 8pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 3px 8px;
    border-radius: 6px;
    border: 1px solid #c7d2fe;
    margin-bottom: 8px;
}

h1 {
    font-size: 19pt;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.025em;
    line-height: 1.25;
    margin: 0 0 10px 0;
}

.doc-meta {
    font-size: 9pt;
    color: #64748b;
    line-height: 1.5;
}

.doc-meta strong {
    color: #1e293b;
}

h2 {
    font-size: 13.5pt;
    font-weight: 750;
    color: #0f172a;
    letter-spacing: -0.015em;
    margin-top: 24px;
    margin-bottom: 10px;
    padding-bottom: 5px;
    border-bottom: 1px solid #e2e8f0;
    page-break-after: avoid;
    break-after: avoid;
}

h3 {
    font-size: 11pt;
    font-weight: 700;
    color: #1e293b;
    margin-top: 18px;
    margin-bottom: 6px;
    page-break-after: avoid;
    break-after: avoid;
}

h4 {
    font-size: 10pt;
    font-weight: 700;
    color: #334155;
    margin-top: 14px;
    margin-bottom: 4px;
    page-break-after: avoid;
    break-after: avoid;
}

p {
    margin-top: 0;
    margin-bottom: 10px;
}

ul, ol {
    margin-top: 0;
    margin-bottom: 10px;
    padding-left: 20px;
}

li {
    margin-bottom: 4px;
}

strong {
    color: #0f172a;
    font-weight: 650;
}

hr {
    border: 0;
    border-top: 1px solid #e2e8f0;
    margin: 20px 0;
}

/* Tables */
table {
    width: 100%;
    border-collapse: collapse;
    font-size: 8.5pt;
    margin: 14px 0;
    page-break-inside: avoid;
    break-inside: avoid;
}

th {
    background-color: #f8fafc;
    color: #0f172a;
    font-weight: 700;
    text-align: left;
    padding: 8px 10px;
    border: 1px solid #cbd5e1;
    font-size: 8.5pt;
    letter-spacing: 0.02em;
}

td {
    padding: 7px 10px;
    border: 1px solid #e2e8f0;
    color: #334155;
    vertical-align: top;
}

tr:nth-child(even) td {
    background-color: #fcfdfe;
}

/* Code Blocks & Pre */
pre {
    background-color: #0f172a;
    color: #f1f5f9;
    padding: 12px 14px;
    border-radius: 8px;
    font-family: 'JetBrains Mono', Consolas, Menlo, monospace;
    font-size: 8pt;
    line-height: 1.45;
    overflow-x: auto;
    margin: 12px 0;
    page-break-inside: avoid;
    break-inside: avoid;
    border: 1px solid #1e293b;
}

code {
    font-family: 'JetBrains Mono', Consolas, Menlo, monospace;
    font-size: 8.5pt;
    background-color: #f1f5f9;
    color: #0f172a;
    padding: 1.5px 5px;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
}

pre code {
    background-color: transparent;
    color: inherit;
    padding: 0;
    border: none;
    font-size: 8pt;
}

/* Callouts & Blockquotes */
blockquote {
    background-color: #f8fafc;
    border-left: 4px solid #4f46e5;
    margin: 14px 0;
    padding: 10px 14px;
    border-radius: 0 8px 8px 0;
    color: #334155;
    page-break-inside: avoid;
    break-inside: avoid;
    border-top: 1px solid #f1f5f9;
    border-right: 1px solid #f1f5f9;
    border-bottom: 1px solid #f1f5f9;
}

blockquote p:last-child {
    margin-bottom: 0;
}

/* Print Page Breaks */
.page-break {
    page-break-before: always;
    break-before: always;
}

.no-break {
    page-break-inside: avoid;
    break-inside: avoid;
}

/* Formula Box */
.formula-box {
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-left: 4px solid #0ea5e9;
    padding: 10px 16px;
    border-radius: 0 8px 8px 0;
    margin: 14px 0;
    font-family: 'Inter', sans-serif;
    page-break-inside: avoid;
    break-inside: avoid;
}

/* KaTeX formula display override */
.katex-display {
    margin: 8px 0 !important;
}

/* Footer note */
.doc-footer {
    margin-top: 30px;
    padding-top: 12px;
    border-top: 1px solid #e2e8f0;
    font-size: 8pt;
    color: #94a3b8;
    display: flex;
    justify-content: space-between;
}
"""

def markdown_to_html(md_text, title, tag="CONFIDENTIAL - HIRING ASSIGNMENT"):
    md = mistune.create_markdown(plugins=['table', 'strikethrough'])
    body_html = md(md_text)

    full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{title}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"></script>
    <style>
        {CSS_STYLES}
    </style>
</head>
<body>
    <div class="doc-header">
        <div class="doc-tag">{tag}</div>
        <div class="doc-meta">
            Fulfillment Hub Take-Home Project &bull; Operations Analyst Role &bull; XYZ E-Commerce
        </div>
    </div>

    {body_html}

    <div class="doc-footer">
        <span>Fulfillment Hub &bull; Candidate Submission</span>
        <span>October 2026</span>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {{
            if (typeof renderMathInElement !== 'undefined') {{
                renderMathInElement(document.body, {{
                    delimiters: [
                        {{left: '$$', right: '$$', display: true}},
                        {{left: '$', right: '$', display: false}}
                    ],
                    throwOnError: false
                }});
            }}
        }});
    </script>
</body>
</html>
"""
    return full_html


def convert_to_pdf(html_content, output_pdf_path):
    temp_html = output_pdf_path.replace(".pdf", "_temp.html")
    with open(temp_html, "w", encoding="utf-8") as f:
        f.write(html_content)

    temp_html_abs = os.path.abspath(temp_html)
    output_pdf_abs = os.path.abspath(output_pdf_path)

    cmd = [
        EDGE_PATH,
        "--headless",
        "--disable-gpu",
        "--virtual-time-budget=2500",
        f"--print-to-pdf={output_pdf_abs}",
        temp_html_abs
    ]

    print(f"Generating PDF: {output_pdf_path}...")
    subprocess.run(cmd, check=True)
    time.sleep(1.5)

    if os.path.exists(temp_html):
        os.remove(temp_html)

    if os.path.exists(output_pdf_abs):
        size_kb = os.path.getsize(output_pdf_abs) / 1024
        print(f"[OK] Generated {output_pdf_path} ({size_kb:.1f} KB)")
        return True
    else:
        print(f"[ERROR] Failed to create {output_pdf_path}")
        return False


def main():
    files_to_convert = [
        {
            "src": os.path.join(DOCS_DIR, "AI_USAGE_NOTE.md"),
            "pdf": os.path.join(DOCS_DIR, "AI_USAGE_NOTE.pdf"),
            "title": "AI Usage Note - Fulfillment Hub for XYZ",
            "tag": "HIRING SUBMISSION &bull; 1-PAGE AI USAGE NOTE"
        },
        {
            "src": os.path.join(DOCS_DIR, "OPERATIONS_ANALYST_REPORT.md"),
            "pdf": os.path.join(DOCS_DIR, "OPERATIONS_ANALYST_REPORT.pdf"),
            "title": "Operations Diagnostic & Fulfillment Optimization Memo",
            "tag": "OPERATIONS ANALYST REPORT &bull; CAPACITY & PROCESS MODEL"
        },
        {
            "src": os.path.join(DOCS_DIR, "VIDEO_WALKTHROUGH_SCRIPT.md"),
            "pdf": os.path.join(DOCS_DIR, "VIDEO_WALKTHROUGH_SCRIPT.pdf"),
            "title": "5-Minute Video Walkthrough Script",
            "tag": "VIDEO WALKTHROUGH SCRIPT &bull; < 5 MIN RECORDING GUIDE"
        }
    ]

    for item in files_to_convert:
        if not os.path.exists(item["src"]):
            print(f"File not found: {item['src']}")
            continue
        with open(item["src"], "r", encoding="utf-8") as f:
            md_content = f.read()
        
        html_out = markdown_to_html(md_content, item["title"], item["tag"])
        convert_to_pdf(html_out, item["pdf"])

    # Also build a single combined Master PDF with a cover page
    combined_pdf_path = os.path.join(DOCS_DIR, "FULFILLMENT_HUB_ALL_DOCUMENTS.pdf")
    build_combined_pdf(files_to_convert, combined_pdf_path)


def build_combined_pdf(items, output_pdf_path):
    md = mistune.create_markdown(plugins=['table', 'strikethrough'])
    
    sections_html = []
    
    # Cover Page
    cover_html = """
    <div style="text-align: center; padding: 100px 0 80px 0; page-break-after: always;">
        <div class="doc-tag" style="font-size: 10pt; padding: 6px 14px;">TAKE-HOME ASSIGNMENT SUBMISSION</div>
        <h1 style="font-size: 28pt; margin: 30px 0 15px 0; color: #0f172a;">XYZ Fulfillment Hub</h1>
        <p style="font-size: 14pt; color: #475569; max-width: 600px; margin: 0 auto 30px auto; font-weight: 500;">
            End-to-End Fulfillment System Redesign, Operations Analytics, Capacity Modeling & Poka-Yoke Error Proofing
        </p>
        
        <div style="margin: 40px auto; width: 80px; height: 3px; background: #6366f1;"></div>
        
        <div style="font-size: 10pt; color: #334155; line-height: 1.8; margin-top: 50px;">
            <p><strong>Candidate Role:</strong> Operations Analyst</p>
            <p><strong>Target Scale:</strong> 200–300 Orders/Day &bull; 2 Facilities &bull; 4 Couriers</p>
            <p><strong>Live Web Application:</strong> Hosted on Render / GitHub</p>
            <p><strong>Date:</strong> October 2026</p>
        </div>

        <div style="margin-top: 80px; font-size: 9pt; color: #94a3b8;">
            Includes: Operations Diagnostic Memo &bull; Video Walkthrough Script &bull; AI Usage Note
        </div>
    </div>
    """
    sections_html.append(cover_html)

    for item in items:
        with open(item["src"], "r", encoding="utf-8") as f:
            md_content = f.read()
        body = md(md_content)
        sec = f"""
        <div class="page-break" style="padding-top: 20px;">
            <div class="doc-header">
                <div class="doc-tag">{item['tag']}</div>
                <div class="doc-meta">
                    Fulfillment Hub Take-Home Project &bull; Operations Analyst Role &bull; XYZ E-Commerce
                </div>
            </div>
            {body}
        </div>
        """
        sections_html.append(sec)

    full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>XYZ Fulfillment Hub - Complete Submission Dossier</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"></script>
    <style>
        {CSS_STYLES}
    </style>
</head>
<body>
    {''.join(sections_html)}
    <script>
        document.addEventListener('DOMContentLoaded', function() {{
            if (typeof renderMathInElement !== 'undefined') {{
                renderMathInElement(document.body, {{
                    delimiters: [
                        {{left: '$$', right: '$$', display: true}},
                        {{left: '$', right: '$', display: false}}
                    ],
                    throwOnError: false
                }});
            }}
        }});
    </script>
</body>
</html>"""

    convert_to_pdf(full_html, output_pdf_path)


if __name__ == "__main__":
    main()
