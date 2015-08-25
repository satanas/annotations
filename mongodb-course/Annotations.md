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

## Chapter 2: CRUD

CRUD = IFUR = ISUD

* MongoDB uses no special language to query, just methods/functions in programming language APIs.
* MongoDB shell is based on javascript.
* MongoDB uses internally BSON (binary json) to store data.
* Be careful when using MongoDB with languages that don't have the type expresiveness to represent objects stored in 
the database.
* MongoDB requires that all documents have a unique identifier, where the _id property acts as default primary key. 
_id is required to be present, the value is required to be unique and is required to be immutable. You can simulate 
the change deleting and re-inserting the document but that wouldn't be atomic.
* ObjectId is an unique value built from current time, identification of the machine running the server, 
identification of the process running the query/server and a counter global to the process. This value must be 
a gloabally unique identifier (across collections).
* Queries to find methods are passed to the server as structured documents, not as text that needs to be parsed and 
analyzed.
* In the shell, you can iterate over paged results with "it". Cursor last 10min.
* Inequality can be used on numeric and string values. However MongoDB doesn't handle locale so it will sort according 
the UTF code unit (ASCII-like), also known as lexicographic bytes of UTF representation.
* If we save objects with different data types for the same attribute, MongoDB range type comparisons won't expand 
data types boundaries. It sort (and compare) with attributes of the same type. Although it's possible, it's not 
recommended to use MongoDB as a polymorphic database.
* Range comparison is case sensitive.
* When finding by type ($type) you need to specify the bson id for that type.
* MongoDB uses Perl-style regex. Regex are not very optimizable except for ^X (where X is not a wildcard).
* When there are two occurrences of the same query, MongoDB will execute only the latter because the js object is 
overwritten
* Matching is polymorphic over arrays and non arrays (objects).
* Matching won't go further in array containing objects, only top level of depth. In order words, there is no recursion
* Queries with objects as fields are compared byte by byte, in the same order and position. Dot notation solves this 
letting you reach inside nested documents.
* Dot notation traverses arrays.
* Creating a cursor doesn't transmit anything to the database until the operation is performed (lazy evaluation).
* $sort and $limit modify the data transmitted from the database, so we can't apply these methods to a cursor that 
already began to fetch info from the database, nor even after we checked if it's empty. They are processed at the 
server (database), not the client.
* $sort is applied first, then $skip, then $limit. In that order, in the server.
* $update replaces the whole object but _id will never be touched (immutable).
* $unset receives the parameter to be removed and a value to confirm (true, 1 or similar).
* $update can perform 4 different operations:
  * Replace the existing document
  * Update attributes in an existing document
  * Update or insert
  * Update multiple documents
* $upsert will have no effect if the conditions set are not enough to determine the data set.
* Even when the $update condition matches multiple documents, MongoDB will affect only one. In order to affect all 
documents we need to specify the "multi" option as true. This is different from SQL, where update affects all records
by default
* Write operations use yield, because there is one single resource that needs to be shared. Write operations that 
affect multiple documents are not isolated transactions, they affect an arbitrary number of documents, then yield and 
so on.
* Remove requires a one-by-one update of the internal state, drop requires only freeing up data structures inside 
the database's data files. This files could be larger but this operation is vastly faster than removing.
* Remove keeps meta data (like indexes), drop doesn't.
* Remove is not atomic.
* Remove by default deletes all documents that match the query (opposite to update).

## Chapter 3: Schema design

* In MongoDB you organize your data to specifically match your app data access pattern. This is known as 
application-driven schema. Best performance and easy to use by your app.
* MongoDB supports rich documents (array, documents, etc) but it doesn't support joins, nor constraints.
* There is no declared schema, but your app will probably have one (every single doc in a collection is going to 
have a pretty similar structure).
* Goals of relational normalization:
  1. Free the database of modification anomalies (avoid inconsistent data)
  2. Minimize redesing when extending
  3. Avoid any bias toward any particular access pattern
* On the contrary, MongoDB tries to tune the app you are going to write and the problem your are going to solve.
* A rule of thumb with MongoDB is that if you find yourself doing the same than in relational design, you probably 
are not taking the best approach.
* In MongoDB there are no foreign key constraints, so it's up to you as developer to guarantee data consistency if 
you use that approach. However, embedding solves this problem.
* Atomic operations mean that all the work done over a single document will be completed before anyone else can sees 
the document. All the changes or none of them.
* In order to live without transactions you can:
  1. Restructure your code to use one single document and take advantage of atomic operations.
  2. Implement some sort of locking in software (critical sections, semaphores, etc).
  3. Tolerate a little bit of inconsistency.
* $update, $findAndModify, $addToSet and $push are all atomic operations within a single document.
* The decision of to embed or not to embed depends on how you access the data and how frequently you do it. Some 
considerations to embed:
  * Frequency of access: Whether of not the data is accessed in the same frequency
  * Size of items: Whether the items grow or not grow (working set size of the application). The combined size of 
  the documents could be larger than 16MB
  * Atomicity of data: Whether or not you need to guarantee that everything is updated at the same time
  * Existence: if one of the items could exist without the other
* For one-to-many relations link from the many to one using an id (unique). You should use multiple collections 
when the many is large and it's up to you guarantee the data consistency.
* For one-to-few relations you can embed.
* For many-to-many (when it's actually few-to-few) you can link using arrays. It's NOT recommended to link in both 
directions because it creates an opportunity to have data inconsistency.
* The main benefit of embedding is performance. And the key performance benefits are:
  * Improved read performance (high latency vs high bandwith)
  * One round trip to the database
* One caveat of embedding is that if the document is moved a lot then you can slow down your write because the 
amount of information.
* Trees can be represented storing the ancestors information (using the rich document feature of MongoDB).
* When to denormalize (without duplicating data):
  * For one-to-one is always safe
  * For one-to-many embed from the many to the one
  * For many-to-many link through arrays
* To handle blobs (or big files) use gridfs.
