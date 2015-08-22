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
