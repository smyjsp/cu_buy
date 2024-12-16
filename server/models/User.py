from sqlalchemy import Column, Integer, String, CheckConstraint
from sqlalchemy.orm import relationship
from models.base import Base

class User(Base):
    __tablename__ = 'Users'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    password = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    uni = Column(String(10), nullable=False, unique=True)
    id_card_image_url = Column(String(200))
    profile_image_url = Column(String(200))

    # Add email domain check constraint
    __table_args__ = (
        CheckConstraint(
            "(email LIKE '%@columbia.edu') OR (email LIKE '%@barnard.edu')",
            name='Users_chk_1'
        ),
    )

    items = relationship("Item", back_populates="user")

    def __repr__(self):
        return f"<User(id={self.id}, name={self.name}, email={self.email})>"
