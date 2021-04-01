import load_test_environ

import unittest
from app import db
from app.models import Article, Citation, Source, User
import app.cite as cite


class UserModelCase(unittest.TestCase):
    def setUp(self):
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_password_hashing(self):
        u1 = User(username="chris")
        u1.set_password("123")
        u2 = User(username="tom")
        u2.set_password("123")
        self.assertFalse(u1.check_password("idiot"))
        self.assertTrue(u1.check_password("123"))
        self.assertFalse(u1.password_hash == u2.password_hash)

    def test_user_article(self):
        user1 = User(username="Alan")
        user2 = User(username="Linus")
        article = Article(name="Test Article 1")
        article.add_authors(user1, user2)
        source = Source(
            ref="Hawking1998",
            name="A Brief History of Time",
            author="Stephen Hawking",
            publisher="Bantam",
            year=1998
        )
        db.session.add(source)
        source = Source(
            ref="Chris2021",
            name="funkyfunk"
        )
        db.session.add(source)
        article.add_citations(
            cite.get_text("Hawking1998", 154, 23),
            cite.get_video("Chris2021", 1, 12, 21)
        )
        db.session.add(article)

        del article

    def test_citation(self):
        article = Article(name="Test Article 1")
        source = Source(
            ref="Hawking1998",
            name="A Brief History of Time",
            author="Stephen Hawking",
            publisher="Bantam",
            year=1998
        )
        db.session.add(source)
        source = Source(
            ref="Chris2021",
            name="funkyfunk"
        )
        db.session.add(source)
        article.add_citations(
            cite.get_text("Hawking1998", 154, 23),
            cite.get_video("Chris2021", 1, 12, 21)
        )
        db.session.add(article)
        del article

        article = Article.query.first()
        self.assertTrue(repr(
            article.citations[0]) == "<Citation p. 154 l. 23 from <Article Test Article 1> with <Source Hawking1998>>")
        self.assertTrue(repr(
            article.citations[1]) == "<Citation 01:12:21 from <Article Test Article 1> with <Source Chris2021>>")

        # check deletion of orphan
        db.session.delete(article)
        self.assertTrue(Citation.query.count() == 0)
        self.assertTrue(repr(Source.query.first()) == "<Source Hawking1998>")
        db.session.commit()


if __name__ == "__main__":
    unittest.main(verbosity=2)
