from sqlalchemy import Column, Integer, String, Text, DECIMAL, Enum, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import relationship
from models.base import Base

class Item(Base):
    __tablename__ = 'items'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    detail = Column(Text, nullable=True)
    condition = Column(Enum('new', 'like new', 'good', 'fair', 'poor'), nullable=False)
    price = Column(DECIMAL(10, 2), nullable=False)
    category_id = Column(Integer, ForeignKey('categories.id'), nullable=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    image_url = Column(String(255), nullable=True)
    transaction_location = Column(String(255), nullable=True)
    posted_at = Column(TIMESTAMP, default=func.current_timestamp())

    category = relationship("Category", backref="items")
    user = relationship("User", backref="items")

    def __repr__(self):
        return f"<Item(id={self.id}, title={self.title}, price={self.price})>"
