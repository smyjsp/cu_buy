from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from models.base import Base

class User(Base):
    __tablename__ = 'Users'

    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    password = Column(String(255))
    email = Column(String(255))
    uni = Column(String(255))
    id_card_image_url = Column(String(255))
    profile_image_url = Column(String(255))

    items = relationship("Item", back_populates="user")

    def __repr__(self):
        return f"<User(id={self.id}, name={self.name}, email={self.email})>"
