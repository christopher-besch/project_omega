# %%
import load_test_environ

from datetime import datetime, timedelta
import unittest
from app import app, db
from app.models import Article, Citation

db.create_all()

a1 = Article(file_name="article1")
a2 = Article(file_name="article2")
a3 = Article(file_name="article3")
a4 = Article(file_name="article4")

c1 = Citation(extra_data="test1")
c2 = Citation(extra_data="test2")
c3 = Citation(extra_data="test3")
c4 = Citation(extra_data="test4")

a1.add_citation(c2)
a1.add_citation(c2)
a1.add_citation(c3)

print(a1.citations)

# set a1
db.session.add(a1)

# query it back
new_a1 = Article.query.filter_by(file_name="article1").first()
print(new_a1)
print(new_a1.citations)
new_cs = Citation.query.filter_by(article=new_a1)
for c in new_cs:
    print(c)

db.session.delete(a1)
