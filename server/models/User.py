from sqlalchemy import Column, Integer, String
from models.base import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    uni = Column(String(20), unique=True, nullable=False)
    id_card_image_url = Column(String(255))
    profile_image_url = Column(String(255))

    def __repr__(self):
        return f"<User(id={self.id}, name={self.name}, email={self.email})>"
