import os
import pandas as pd
from app import create_app
from app.models import db, Scheme
import math

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, 'data', 'updated_data.csv')

def ingest_data():
    app = create_app()
    with app.app_context():
        print(f"Reading CSV from {DATA_PATH}")
        if not os.path.exists(DATA_PATH):
            print("Data file not found.")
            return

        df = pd.read_csv(DATA_PATH)
        df.fillna("", inplace=True)

        print(f"Found {len(df)} records. Ingesting to database...")
        
        # Clear existing data
        db.session.query(Scheme).delete()

        count = 0
        for index, row in df.iterrows():
            scheme = Scheme(
                scheme_name=str(row.get('scheme_name', '')),
                slug=str(row.get('slug', '')),
                details=str(row.get('details', '')),
                benefits=str(row.get('benefits', '')),
                eligibility=str(row.get('eligibility', '')),
                application=str(row.get('application', '')),
                documents=str(row.get('documents', '')),
                level=str(row.get('level', '')),
                schemeCategory=str(row.get('schemeCategory', '')),
                tags=str(row.get('tags', ''))
            )
            db.session.add(scheme)
            count += 1
            if count % 500 == 0:
                print(f"Processed {count} records...")
                db.session.commit()

        db.session.commit()
        print(f"Successfully ingested {count} records into the database.")

if __name__ == '__main__':
    ingest_data()
