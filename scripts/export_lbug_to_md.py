# /// script
# requires-python = ">=3.8"
# dependencies = [
#     "tqdm",
# ]
# ///

import os
import json
import subprocess
from pathlib import Path
import argparse
from tqdm import tqdm

def append_skills(skills_dir: Path, repo_dir: Path, md: list):
    if not skills_dir.exists():
        md.append(f"Skills directory not found: {skills_dir}")
        return

    md.append("\n## 🛠️ Claude Skills")
    md.append("The following skills are defined in the repository to provide specialized capabilities:\n")

    skill_files = list(skills_dir.rglob("*.md"))
    if not skill_files:
        md.append("No skills found.")
        return

    for skill_file in sorted(skill_files):
        try:
            rel_path = skill_file.relative_to(repo_dir)
        except ValueError:
            rel_path = skill_file.name

        md.append(f"### Skill: `{rel_path}`")
        try:
            with open(skill_file, "r", encoding="utf-8") as f:
                content = f.read()
                md.append("```markdown")
                md.append(content.strip())
                md.append("```\n")
        except Exception as e:
            md.append(f"> Error reading skill file: {e}\n")

def run_cypher(query: str) -> str:
    """Run a GitNexus Cypher query and return the markdown table."""
    try:
        result = subprocess.run(
            ["npx", "gitnexus", "cypher", query],
            capture_output=True,
            text=True,
            encoding="utf-8",
            check=False,
            shell=True
        )
        if result.returncode == 0:
            data = json.loads(result.stdout)
            markdown = data.get("markdown", "")
            # Fix unicode issues from terminal output if any
            markdown = markdown.replace("鈫?", "->").replace("→", "->")
            return markdown
        else:
            return f"> Query failed: `{query}`\n> Error: {result.stderr}"
    except Exception as e:
        return f"> Exception during cypher query: {e}"

def cmd_export_lbug(args, repo_dir: Path):
    total_steps = 5
    if args.detail == "full":
        total_steps += 1

    md = []
    md.append("# GitNexus Repository Knowledge Graph")
    md.append("\nThis document contains a structured representation of the repository's knowledge graph extracted from `.gitnexus/lbug`.")

    print(f"Generating LLM Context from GitNexus (Detail: {args.detail})...")

    with tqdm(total=total_steps, desc="Overall Progress", unit="step") as pbar:
        # Step 1
        pbar.set_postfix_str("Extracting metadata")
        meta_path = repo_dir / ".gitnexus" / "meta.json"
        if meta_path.exists():
            with open(meta_path, "r", encoding="utf-8") as f:
                meta = json.load(f)
        else:
            meta = {}
        
        if meta:
            md.append("\n## 📊 Repository Statistics")
            md.append(f"- **Repository:** `{meta.get('repoPath', 'Unknown')}`")
            md.append(f"- **Last Commit:** `{meta.get('lastCommit', 'Unknown')}`")
            md.append(f"- **Indexed At:** `{meta.get('indexedAt', 'Unknown')}`")
            stats = meta.get("stats", {})
            md.append(f"- **Files:** {stats.get('files', 0)}")
            md.append(f"- **Symbols (Nodes):** {stats.get('nodes', 0)}")
            md.append(f"- **Relationships (Edges):** {stats.get('edges', 0)}")
            md.append(f"- **Communities:** {stats.get('communities', 0)}")
            md.append(f"- **Execution Processes:** {stats.get('processes', 0)}")
        pbar.update(1)

        limit_clause = " LIMIT 20" if args.detail == "summary" else ""

        # Step 2
        pbar.set_postfix_str("Fetching Core Communities")
        md.append("\n## 🏘️ Core Communities")
        md.append("Communities are highly cohesive sub-graphs of symbols representing functional modules.")
        communities_md = run_cypher(f"MATCH (c:Community) RETURN c.heuristicLabel AS Community, c.symbolCount AS Symbols, c.description AS Description ORDER BY c.symbolCount DESC{limit_clause}")
        if communities_md:
            md.append(communities_md)
        pbar.update(1)

        # Step 3
        pbar.set_postfix_str("Fetching Execution Flows")
        md.append("\n## 🔄 Execution Flows (Processes)")
        md.append("Processes are critical paths through the codebase from an entry point to a terminal node.")
        processes_md = run_cypher(f"MATCH (p:Process) RETURN p.heuristicLabel AS Process, p.stepCount AS Steps, p.processType AS Type ORDER BY p.stepCount DESC{limit_clause}")
        if processes_md:
            md.append(processes_md)
        pbar.update(1)

        # Step 4
        pbar.set_postfix_str("Fetching Central Symbols")
        md.append("\n## 🎯 Central Symbols")
        md.append("These symbols have the highest number of outgoing dependencies, often acting as core utilities or base classes.")
        central_md = run_cypher(f"MATCH (n)-[r]->(m) WHERE NOT label(n) IN ['File', 'Folder', 'Community', 'Process'] WITH label(n) AS Type, n.name AS Name, count(*) AS OutgoingDependencies RETURN Type, Name, OutgoingDependencies ORDER BY OutgoingDependencies DESC{limit_clause}")
        if central_md:
            md.append(central_md)
        pbar.update(1)

        # Step 5
        pbar.set_postfix_str("Fetching Files")
        md.append("\n## 📁 Files")
        md.append("List of files indexed in the graph.")
        files_md = run_cypher(f"MATCH (f:File) RETURN f.name AS File, f.filePath AS Path ORDER BY f.name{limit_clause}")
        if files_md:
            md.append(files_md)
        pbar.update(1)

        # Step 6 (Optional)
        if args.detail == "full":
            pbar.set_postfix_str("Fetching Core Code Elements")
            md.append("\n## 🧩 Core Code Elements")
            md.append("List of primary code elements indexed in the project.")
            elements_md = run_cypher("MATCH (n) WHERE label(n) IN ['Function', 'Class', 'Interface', 'Method'] RETURN label(n) AS Type, n.name AS Name ORDER BY label(n), n.name")
            if elements_md:
                md.append(elements_md)
            pbar.update(1)

        pbar.set_postfix_str("Writing output")

    output_path = Path(args.out)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(md))

    print(f"\nMarkdown file successfully generated at: {output_path}")

def cmd_combine_skills(args, repo_dir: Path):
    md = []
    skills_dir_path = Path(args.skills_dir)
    if not skills_dir_path.is_absolute():
        skills_dir_path = repo_dir / args.skills_dir
        
    print(f"Combining Claude skills from {skills_dir_path}...")
    append_skills(skills_dir_path, repo_dir, md)
    
    output_path = Path(args.out)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(md))

    print(f"\nSkills successfully combined at: {output_path}")

def main():
    parser = argparse.ArgumentParser(description="GitNexus tools for Markdown generation")
    subparsers = parser.add_subparsers(dest="command", required=True, help="Sub-commands")

    # Sub-command: export
    parser_export = subparsers.add_parser("export", help="Export lbug to Markdown")
    parser_export.add_argument("--lbug", type=str, default=r"d:\workspace\html\tiny-world-builder\.gitnexus\lbug", help="Path to lbug file")
    parser_export.add_argument("--out", type=str, default=r"d:\workspace\html\tiny-world-builder\.gitnexus\context.md", help="Output Markdown file")
    parser_export.add_argument("--detail", type=str, choices=["summary", "full"], default="full", help="Detail level of the output (summary or full)")

    # Sub-command: skills
    parser_skills = subparsers.add_parser("skills", help="Combine skills to Markdown")
    parser_skills.add_argument("--skills-dir", type=str, default=r".claude\skills", help="Relative or absolute path to the skills directory")
    parser_skills.add_argument("--out", type=str, default=r"d:\workspace\html\tiny-world-builder\.gitnexus\skills.md", help="Output Markdown file")

    args = parser.parse_args()

    # Determine repo_dir
    if args.command == "export":
        lbug_path = Path(args.lbug)
        repo_dir = lbug_path.parent.parent
    else:
        # Assuming current working directory is the repo root for 'skills'
        repo_dir = Path.cwd()
        
    os.chdir(repo_dir)

    if args.command == "export":
        cmd_export_lbug(args, repo_dir)
    elif args.command == "skills":
        cmd_combine_skills(args, repo_dir)

if __name__ == "__main__":
    main()