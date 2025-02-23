from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os
import json
from typing import List, Dict

class DatabaseHandler:
    def __init__(self):
        database_url = os.environ.get("DATABASE_URL")
        self.engine = create_engine(database_url)
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)

    def update_exercise_audio(self, exercise_id: str, timestamps: List[Dict], s3_key: str, audio_url: str):
        db = self.SessionLocal()
        try:
            # Convert timestamps array to JSON string for storage
            audio_timestamps = [str(json.dumps(word_object))
                              for word_object in timestamps]
            
            # Update Exercise table with audioTimestamps
            query = text("""
                UPDATE "public"."Exercise" 
                SET "audioTimestamps" = :timestamps
                WHERE id = :exercise_id
            """)

            db.execute(query, {
                "timestamps": audio_timestamps,
                "exercise_id": exercise_id,
            })

            # Upsert file record
            file_query = text("""
                INSERT INTO "public"."File" (id, "createdAt", "exerciseId", name, type, key, "uploadUrl")
                VALUES (gen_random_uuid(), NOW(), :exercise_id, :name, :type, :key, :upload_url)
                ON CONFLICT ("exerciseId") DO UPDATE
                SET "createdAt" = NOW(),
                    name = EXCLUDED.name,
                    type = EXCLUDED.type,
                    key = EXCLUDED.key,
                    "uploadUrl" = EXCLUDED."uploadUrl"
            """)

            db.execute(file_query, {
                "exercise_id": exercise_id,
                "name": str(exercise_id),
                "type": "audio/mpeg",
                "key": s3_key,
                "upload_url": audio_url
            })

            db.commit()
        finally:
            db.close() 