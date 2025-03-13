import logging
from typing import Generator, Callable, TypeVar, List, Dict
from fastapi import HTTPException
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import QueuePool
from sqlalchemy.exc import SQLAlchemyError, IntegrityError, OperationalError
from contextlib import contextmanager
from core.config import settings
import json

logger = logging.getLogger(__name__)

T = TypeVar('T')


class DatabaseService:
    _instance = None
    _initialized = False

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DatabaseService, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        if not self._initialized:
            try:
                self.engine = create_engine(
                    settings.DATABASE_URL,
                    poolclass=QueuePool,
                    pool_size=5,
                    max_overflow=10,
                    pool_timeout=30,
                    pool_recycle=1800,  # Recycle connections after 30 minutes
                    pool_pre_ping=True,  # Enable connection health checks
                    echo=False  # Set to True for SQL query logging
                )
                self.session_local = sessionmaker(
                    autocommit=False,
                    autoflush=False,
                    bind=self.engine
                )
                self._initialized = True
            except Exception as e:
                logger.error(
                    f"Failed to initialize database connection: {str(e)}")
                raise HTTPException(
                    status_code=500, detail=f"Database initialization failed: {str(e)}")

    @contextmanager
    def getDb(self) -> Generator[Session, None, None]:
        """Provide a transactional scope around a series of operations."""
        db_session = self.session_local()
        try:
            yield db_session
            db_session.commit()
        except Exception as e:
            db_session.rollback()
            logger.error(f"Database transaction error: {str(e)}")
            raise HTTPException(
                status_code=500, detail=f"Database transaction failed: {str(e)}")
        finally:
            db_session.close()

    def checkHealth(self) -> bool:
        """Check if database connection is healthy"""
        try:
            with self.getDb() as db_session:
                db_session.execute(text("SELECT 1"))
            return True
        except Exception as e:
            logger.error(f"Database health check failed: {str(e)}")
            return False

    def executeQuery(self, query, params=None):
        """Execute a raw SQL query with error handling"""
        try:
            with self.getDb() as db_session:
                result = db_session.execute(text(query), params or {})
                return result
        except Exception as e:
            logger.error(f"Query execution failed: {str(e)}")
            raise HTTPException(
                status_code=500, detail=f"Query execution failed: {str(e)}")

    def closeConnections(self):
        """Close all database connections"""
        try:
            self.engine.dispose()
        except Exception as e:
            logger.error(f"Failed to close database connections: {str(e)}")
            raise HTTPException(
                status_code=500, detail=f"Failed to close database connections: {str(e)}")

    def exercise_exists(self, exercise_id: str) -> bool:
        """Check if an exercise exists in the database"""
        try:
            with self.getDb() as db_session:
                result = db_session.execute(text(
                    'SELECT COUNT(*) FROM "public"."Exercise" WHERE id = :exercise_id'), {"exercise_id": exercise_id})
                return result.scalar() > 0
        except Exception as e:
            logger.error(f"Error checking if exercise exists: {str(e)}")
            raise HTTPException(
                status_code=500, detail=f"Error checking if exercise exists: {str(e)}")

    def updateExerciseAudioTimestamps(self, exercise_id: str, timestamps: List[Dict]):
        """Update the audio timestamps for an exercise"""
        audio_timestamps = [str(json.dumps(word_object))
                                for word_object in timestamps]
        try:
            with self.getDb() as db_session:
                db_session.execute(text(
                    'UPDATE "public"."Exercise" SET audio_timestamps = :audio_timestamps WHERE id = :exercise_id'), {"exercise_id": exercise_id, "audio_timestamps": audio_timestamps})
        except Exception as e:
            logger.error(f"Error updating exercise audio timestamps: {str(e)}")
            raise HTTPException(
                status_code=500, detail=f"Error updating exercise audio timestamps: {str(e)}")

    def executeTransaction(self, operation: Callable[[Session], T]) -> T:
        """
        Execute a database operation within a transaction with specific error handling.

        Args:
            operation: A callable that takes a Session and returns a result

        Returns:
            The result of the operation

        Raises:
            Exception: If there's an error in the query
        """
        try:
            with self.getDb() as db_session:
                return operation(db_session)
        except IntegrityError as e:
            logger.error(f"Database integrity error: {str(e)}")
            raise HTTPException(
                status_code=500, detail=f"Database integrity constraint violated: {str(e)}")
        except OperationalError as e:
            logger.error(f"Database operational error: {str(e)}")
            raise HTTPException(
                status_code=500, detail=f"Database connection or operational error: {str(e)}")
        except SQLAlchemyError as e:
            logger.error(f"SQLAlchemy error: {str(e)}")
            raise HTTPException(
                status_code=500, detail=f"Database query error: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected database error: {str(e)}")
            raise HTTPException(
                status_code=500, detail=f"Unexpected database error: {str(e)}")


db_service = DatabaseService()
