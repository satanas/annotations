# MongoDB Course

## Chapter 1: Introduction

* MongoDB is a document oriented database (also known as non-relational database).
* By design, it doesn't support joins neither transactions. This decision was made to try to get a
fully scalable but still functional database.
* MongoDB is schemaless. This means that you are not constrained to follow any particular schema in
a collection during insertion or updating.
* To embed or not to embed data? It will depend on the way you access the data, if it accessed
frequently or it only depend on the parent then it makes sense to embed. Also if you don't have
problems changing a single values. THe only real reason that makes impossible to not embed is the
size of the collection, if it's greater than 16MB then you CAN NOT embed. It's a physical limitation
of MongoDB
