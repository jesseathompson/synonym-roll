#!/usr/bin/env python3
"""Align definitions in graph_thesaurus.json with the senses the game actually uses.

Two outputs, both derived from WordNet and the graph's own structure:

1. Per-edge sense glosses (the important one). For an edge cat--feline, the
   definition that helps a player is "feline in the sense it shares with cat".
   For each edge we find, on each side, the most frequent WordNet synset of
   that word whose lemma pool (synset + similar-tos + also-sees +
   derivationally related forms) contains the other word. To keep the file
   small, each node stores a deduplicated `senses` array and each edge stores
   two indices into those arrays (`source_sense`, `target_sense`), omitted
   when no shared sense was found.

2. Per-node primary definition/POS. Every synset of the word is scored by the
   synonymy-weighted count of graph neighbors in its lemma pool, plus a small
   prior favoring frequent senses (WordNet rank order). The stored
   learner-friendly definition is kept when consistent with the winning sense
   and replaced with the WordNet gloss when it clearly describes a different
   sense (e.g. "drug (verb): chemical used as a medicine"). POS is corrected
   to the winning sense.

Usage:
    python3 -m venv /tmp/synroll-venv && /tmp/synroll-venv/bin/pip install nltk
    /tmp/synroll-venv/bin/python scripts/enrich_definitions.py [--dry-run]

Writes app/games/graph_thesaurus.json in place (git is the backup).
"""

import argparse
import json
import re
from collections import Counter
from functools import lru_cache
from pathlib import Path

import nltk

nltk.download("wordnet", quiet=True)
from nltk.corpus import wordnet as wn  # noqa: E402

REPO_ROOT = Path(__file__).resolve().parent.parent
GRAPH_PATH = REPO_ROOT / "app" / "games" / "graph_thesaurus.json"

POS_NAME = {"n": "noun", "v": "verb", "a": "adj", "s": "adj", "r": "adv"}

# Prior favoring common senses; rank 0 gets +0.2, decaying geometrically.
RANK_PRIOR_BASE = 0.2
RANK_PRIOR_DECAY = 0.8

STOPWORDS = {
    "a", "an", "the", "to", "of", "in", "on", "or", "and", "for", "with",
    "that", "this", "is", "are", "be", "being", "been", "as", "by", "at",
    "it", "its", "you", "your", "someone", "something", "somebody", "etc",
    "very", "more", "most", "make", "makes", "making", "made", "do", "does",
    "doing", "done", "have", "has", "having", "not", "no", "from", "into",
    "out", "up", "down", "about", "such", "who", "which", "what", "when",
    "where", "than", "their", "they", "them", "his", "her", "he", "she",
}


def content_words(text: str) -> set[str]:
    return {
        w for w in re.findall(r"[a-z]+", text.lower())
        if w not in STOPWORDS and len(w) > 2
    }


@lru_cache(maxsize=None)
def synsets(word: str):
    return wn.synsets(word.replace(" ", "_"))


@lru_cache(maxsize=None)
def synset_lemma_pool(synset_name: str) -> frozenset:
    """Lemma names of the synset plus closely related synsets."""
    synset = wn.synset(synset_name)
    pool = set()

    def add(ss):
        for lemma in ss.lemmas():
            pool.add(lemma.name().replace("_", " ").lower())

    add(synset)
    for rel in synset.similar_tos() + synset.also_sees():
        add(rel)
    for lemma in synset.lemmas():
        for drf in lemma.derivationally_related_forms():
            pool.add(drf.name().replace("_", " ").lower())
    return frozenset(pool)


def shared_sense(word: str, other: str):
    """Most frequent synset of `word` whose lemma pool contains `other`."""
    for synset in synsets(word):
        if other.lower() in synset_lemma_pool(synset.name()):
            return synset
    return None


def primary_sense(word: str, neighbor_weights: dict[str, float]):
    """Synset best covering the word's graph neighbors, with a frequency prior."""
    best, best_score = None, 0.0
    for rank, synset in enumerate(synsets(word)):
        pool = synset_lemma_pool(synset.name())
        score = sum(w for n, w in neighbor_weights.items() if n in pool)
        score += RANK_PRIOR_BASE * (RANK_PRIOR_DECAY ** rank)
        if score > best_score:
            best, best_score = synset, score
    return best


def definition_matches_sense(definition: str, synset) -> bool:
    """True if the stored definition shares content with the matched sense."""
    def_words = content_words(definition)
    if not def_words:
        return False
    sense_words = content_words(synset.definition())
    for name in synset.lemma_names():
        sense_words |= content_words(name.replace("_", " "))
    for rel in synset.similar_tos() + synset.also_sees() + synset.hypernyms():
        sense_words |= content_words(rel.definition())
        for name in rel.lemma_names():
            sense_words |= content_words(name.replace("_", " "))
    return bool(def_words & sense_words)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="report only, don't write")
    args = parser.parse_args()

    data = json.loads(GRAPH_PATH.read_text())
    nodes = data["nodes"]
    edges = data["edges"]

    neighbors: dict[str, dict[str, float]] = {}
    for e in edges:
        w = float(e.get("synonymy_score", 1.0))
        neighbors.setdefault(e["source"], {})[e["target"]] = w
        neighbors.setdefault(e["target"], {})[e["source"]] = w

    stats = Counter()
    examples = {"replaced": [], "pos_fixed": []}

    # --- Per-node primary definition / POS ---
    for node in nodes:
        word = node["word"]
        synset = primary_sense(word, neighbors.get(word, {}))

        if synset is None:
            stats["no_wordnet_entry"] += 1
            continue

        matched_pos = POS_NAME.get(synset.pos(), node.get("pos", ""))
        if node.get("pos") != matched_pos:
            if len(examples["pos_fixed"]) < 8:
                examples["pos_fixed"].append(f"{word}: {node.get('pos')} -> {matched_pos}")
            node["pos"] = matched_pos
            stats["pos_fixed"] += 1

        old_def = node.get("definition", "").strip()
        if old_def and definition_matches_sense(old_def, synset):
            stats["kept_definition"] += 1
        else:
            if len(examples["replaced"]) < 8:
                examples["replaced"].append(
                    f"{word}: '{old_def[:55]}' -> '{synset.definition()[:55]}'"
                )
            node["definition"] = synset.definition()
            stats["replaced_definition" if old_def else "filled_empty"] += 1

    # --- Per-edge shared-sense glosses (compact: sense arrays + indices) ---
    senses: dict[str, list[str]] = {}

    def sense_index(word: str, definition: str) -> int:
        word_senses = senses.setdefault(word, [])
        if definition not in word_senses:
            word_senses.append(definition)
        return word_senses.index(definition)

    for e in edges:
        s, t = e["source"], e["target"]
        ss = shared_sense(s, t)
        ts = shared_sense(t, s)
        e.pop("source_sense", None)
        e.pop("target_sense", None)
        if ss is not None:
            e["source_sense"] = sense_index(s, ss.definition())
            stats["edge_sides_glossed"] += 1
        if ts is not None:
            e["target_sense"] = sense_index(t, ts.definition())
            stats["edge_sides_glossed"] += 1
        if ss is None and ts is None:
            stats["edges_without_gloss"] += 1

    for node in nodes:
        word_senses = senses.get(node["word"])
        if word_senses:
            node["senses"] = word_senses
            stats["nodes_with_senses"] += 1
        else:
            node.pop("senses", None)

    print("Stats:")
    for k, v in sorted(stats.items()):
        print(f"  {k}: {v}")
    print(f"  total_sense_strings: {sum(len(v) for v in senses.values())}")
    print("\nSample POS fixes:")
    print("\n".join(f"  {s}" for s in examples["pos_fixed"]))
    print("\nSample definition replacements:")
    print("\n".join(f"  {s}" for s in examples["replaced"]))

    if args.dry_run:
        print("\n(dry run, nothing written)")
        return

    GRAPH_PATH.write_text(json.dumps(data, indent=2) + "\n")
    size_mb = GRAPH_PATH.stat().st_size / 1e6
    print(f"\nWrote {GRAPH_PATH} ({size_mb:.1f} MB)")


if __name__ == "__main__":
    main()
