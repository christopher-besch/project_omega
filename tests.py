import app.cite as cite
from app.models import Article, Citation, Source, User, Resource
from app import db, create_app
import unittest
from config import Config


class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite://"


class ModelCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app(TestConfig)
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_password_hashing(self):
        u1 = User(username="chris", email="safd", full_name="")
        u1.set_password("123")
        db.session.add(u1)
        db.session.commit()

        u2 = User(username="tom", email="", full_name="")
        u2.set_password("123")
        db.session.add(u2)
        db.session.commit()

        self.assertFalse(u1.check_password("idiot"))
        self.assertTrue(u1.check_password("123"))
        self.assertFalse(u1.password_hash == u2.password_hash)

    def test_user_article(self):
        user1 = User(username="Alan",
                     email="test@gmail.com",
                     full_name="Hello World")
        user1.set_password("Trains?")
        db.session.add(user1)
        db.session.commit()

        user2 = User(username="Linus",
                     email="test2@gmail.com",
                     full_name="I like trains")
        user2.set_password("Trains2?")
        db.session.add(user2)
        db.session.commit()

        article = Article(title="I Like Trains, like a lot!",
                          internal_name="Test Article 1")
        article.add_authors(user1, user2)
        source = Source(
            ref="Hawking1998",
            name="A Brief History of Time",
            author="Stephen Hawking",
            publisher="Bantam",
            year=1998
        )
        db.session.add(source)
        db.session.commit()
        source = Source(
            ref="Chris2021",
            name="funkyfunk"
        )
        db.session.add(source)
        db.session.commit()
        article.add_citations(
            cite.get_text("Hawking1998", 154, 23),
            cite.get_video("Chris2021", 1, 12, 21)
        )
        db.session.add(article)
        db.session.commit()

        self.assertTrue(article.get_authors() in
                        ["Hello World and I like trains", "I like trains and Hello World"])

        db.session.delete(article)
        db.session.commit()
        # delete orphan test
        self.assertTrue(len(Citation.query.all()) == 0)

    def test_citation(self):
        article = Article(internal_name="test", title="Test Article 1")
        source = Source(
            ref="Hawking1998",
            name="A Brief History of Time",
            author="Stephen Hawking",
            publisher="Bantam",
            year=1998
        )
        db.session.add(source)
        db.session.commit()
        source = Source(
            ref="Chris2021",
            name="funkyfunk"
        )
        db.session.add(source)
        db.session.commit()
        article.add_citations(
            cite.get_text("Hawking1998", 154, 23),
            cite.get_video("Chris2021", 1, 12, 21)
        )
        db.session.add(article)
        del article
        db.session.commit()

        article = Article.query.first()
        self.assertTrue(repr(
            article.citations[0]) == "<Citation p. 154 l. 23 from <Article test> with <Source Hawking1998>>")
        self.assertTrue(repr(
            article.citations[1]) == "<Citation 01:12:21 from <Article test> with <Source Chris2021>>")

        # check deletion of orphan
        db.session.delete(article)
        db.session.commit()
        self.assertTrue(Citation.query.count() == 0)
        self.assertTrue(repr(Source.query.first()) == "<Source Hawking1998>")
        db.session.commit()

    def test_citation_orphan_deletion(self):
        a = Article(internal_name="test", title="TEST")
        o = Citation()
        db.session.add(o)
        a.add_citations(o)
        o = Citation()
        db.session.add(o)
        a.add_citations(o)
        o = Citation()
        db.session.add(o)
        a.add_citations(o)
        db.session.commit()
        self.assertTrue(Citation.query.count() == 3)
        db.session.delete(a)
        self.assertTrue(Citation.query.count() == 0)

    def test_resource_orphan_deletion(self):
        a = Article(internal_name="test", title="TEST")
        o = Resource(filename="", data=b"", mimetype="")
        db.session.add(o)
        a.add_resources(o)
        o = Resource(filename="", data=b"", mimetype="")
        db.session.add(o)
        a.add_resources(o)
        o = Resource(filename="", data=b"", mimetype="")
        db.session.add(o)
        a.add_resources(o)
        db.session.commit()
        self.assertTrue(Resource.query.count() == 3)
        db.session.delete(a)
        self.assertTrue(Resource.query.count() == 0)

    def test_tokens(self):
        a = Article(internal_name="test", title="TEST")
        db.session.add(a)
        db.session.commit()
        a2 = Article(internal_name="test2", title="TEST")
        db.session.add(a2)

        t = a.gen_auth_token()
        t2 = a2.gen_auth_token()
        self.assertTrue(a.check_auth_token(t))
        self.assertFalse(a.check_auth_token(t[:-1]))
        self.assertTrue(t != t2)
        self.assertFalse(a.check_auth_token(t2))
        self.assertFalse(a2.check_auth_token(t))
        self.assertTrue(a2.check_auth_token(t2))


if __name__ == "__main__":
    unittest.main(verbosity=2)
