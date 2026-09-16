import pandas as pd
import os
import re

def load_schemes():
    """
    Loads all government schemes from the database into a Pandas DataFrame.

    Queries the Scheme model via SQLAlchemy, converts each record to a
    dictionary, and returns the result as a DataFrame with NaN values filled
    with empty strings. Returns an empty DataFrame if no data is found or
    if a database error occurs.

    Returns:
        pd.DataFrame: A DataFrame containing all scheme records, or an
                      empty DataFrame on failure.
    """
    try:
        from app.models import Scheme
        schemes = Scheme.query.all()
        data = [s.to_dict() for s in schemes]
        if data:
            df = pd.DataFrame(data)
            df.fillna("", inplace=True)
            return df
        return pd.DataFrame()
    except Exception as e:
        print("Error loading schemes:", e)
        return pd.DataFrame()


def search_relevant_schemes(df, query, top_k=5):
    """
    Simple keyword-based retrieval.
    Later this can be upgraded to embeddings.
    """
    query = str(query).lower()

    scores = []
    for _, row in df.iterrows():
        text = (
            str(row.get("scheme_name", "")) + " " +
            str(row.get("schemeCategory", "")) + " " +
            str(row.get("details", "")) + " " +
            str(row.get("eligibility", ""))
        ).lower()

        score = sum(word in text for word in query.split())
        scores.append(score)

    df["score"] = scores
    results = df.sort_values("score", ascending=False).head(top_k)

    return results


def build_context_from_results(results_df):
    """
    Builds a plain-text context string from a DataFrame of relevant schemes.

    Formats each scheme's name, category, state, and a truncated details
    snippet (first 200 characters) into a structured block of text. This
    context is passed to the AI/LLM as grounding information so it can
    generate accurate, scheme-specific responses.

    Args:
        results_df (pd.DataFrame): A DataFrame of matched schemes, typically
                                   returned by search_relevant_schemes().

    Returns:
        str: A formatted multi-line string containing scheme context blocks.
    """
    context = ""

    for _, row in results_df.iterrows():
        name = row.get("scheme_name", "")
        category = row.get("schemeCategory", "")
        state = row.get("state", "")
        details = row.get("details", "")[:200]

        context += (
            f"Scheme: {name}\n"
            f"Category: {category}\n"
            f"State: {state}\n"
            f"Details: {details}\n\n"
        )

    return context
