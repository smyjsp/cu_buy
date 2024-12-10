from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from contextlib import contextmanager
from models import Base  # Import your Base and all models here


class SQLAlchemyHandler:
    def __init__(self, database_url):
        """
        Initialize the SQLAlchemy handler.
        :param database_url: Database connection string (e.g., 'mysql+pymysql://user:password@localhost/dbname')
        """
        self.engine = create_engine(database_url, pool_pre_ping=True)
        self.Session = scoped_session(sessionmaker(bind=self.engine))

    def create_tables(self):
        """
        Create all tables defined in the models.
        """
        Base.metadata.create_all(self.engine)

    def drop_tables(self):
        """
        Drop all tables defined in the models.
        """
        Base.metadata.drop_all(self.engine)

    @contextmanager
    def session_scope(self):
        """
        Provide a transactional scope for a series of operations.
        Usage:
        with handler.session_scope() as session:
            # Perform database operations
        """
        session = self.Session()
        try:
            yield session
            session.commit()
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()

    def add(self, session, instance):
        """
        Add an instance to the session.
        :param session: Current database session.
        :param instance: The model instance to add.
        """
        session.add(instance)

    def delete(self, session, instance):
        """
        Delete an instance from the session.
        :param session: Current database session.
        :param instance: The model instance to delete.
        """
        session.delete(instance)

    def get_all(self, session, model):
        """
        Get all records of a model.
        :param session: Current database session.
        :param model: The model class to query.
        :return: List of records.
        """
        return session.query(model).all()

    def get_by_id(self, session, model, record_id):
        """
        Get a record by its ID.
        :param session: Current database session.
        :param model: The model class to query.
        :param record_id: The ID of the record to fetch.
        :return: The record or None.
        """
        return session.query(model).get(record_id)
