from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_URL = f'sqlite:///{os.path.join(BASE_DIR, "db.sqlite3")}'

Base = declarative_base()
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Meme(Base):
    __tablename__ = 'memes'

    id = Column(Integer, primary_key=True, index=True)
    telegram_user_id = Column(String, index=True)
    file_id = Column(String, nullable=False)
    caption = Column(Text, nullable=True)
    media_type = Column(String, default='photo')
    created_at = Column(DateTime, default=datetime.utcnow)
    reactions = relationship('Reaction', back_populates='meme')

class Reaction(Base):
    __tablename__ = 'reactions'

    id = Column(Integer, primary_key=True, index=True)
    meme_id = Column(Integer, ForeignKey('memes.id'), nullable=False)
    telegram_user_id = Column(String, nullable=True)
    reaction = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    meme = relationship('Meme', back_populates='reactions')


def init_db():
    Base.metadata.create_all(bind=engine)


def get_session():
    return SessionLocal()
