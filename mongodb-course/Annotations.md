# MongoDB Course

## Chapter 1: Introduction

*Summary*: Introduction & Overview - Overview, Design Goals, the Mongo Shell, JSON Intro, installing tools, overview 
of blog project. Bottle, Pymongo

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

*Summary*: CRUD (Creating, Reading and Updating Data) - Mongo shell, query operators, update operators and a few 
commands. CRUD = IFUR = ISUD

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

*Summary*: Schema Design - Patterns, case studies and tradeoffs

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


## Chapter 4: Performance

*Summary*: Using indexes, monitoring and understanding performance. Performance in sharded environments.

* The storage engine is the interface between the persistence storage (disk) and the database. It affects the data 
file format and the format of indexes
* MMAPv1 works mapping a physical file into memory according the physical memory of the box. If the part of the file 
searched is not in memory then it has to read it from the disk and put it into memory before you can use it. The 
algorithm that decides what's in memory and what's in disk is part of the OS, so the engine can't do anything to 
optimize it.
* MMAPv1 offers:
  * Collection Level Locking (or Concurrency): Each collection is its own file. Multiple readers, single writer lock. 
  So only one write operation can happen at a time in the same collection.
  * In Place Updates: It tries to update the document in the same page. If the document is bigger than the page, 
  it's moved to another page with more space. Allocation is done using power of two sizes
* WiredTiger (is not turned on by default, you must run it with --storageEngine wiredTiger) offers:
  * Document Level Concurrency: It's a lock free implementation that has an optimistic concurrency model, the 
  storage asumes that two writes are not in the same document, and if they are, one of them is unwound and has to 
  try again.
  * Compression of documents (data) and indexes (on disk).
  * Append-only storage: There are no in-place updates, wiredTiger mark the document as no longer used and allocates 
  new space on disk to write it there. Eventually it will clean up the space. This makes that if you want to update a 
  single attribute of a document, wiredTiger has to save the whole document again (it's often faster)
* WiredTiger manages the memory that is used to access the file on disk, it decides what goes to memory and what goes 
to disk
* An index is an orderer set of things that have some sort of pointer to a physical location. Without indexes, you 
need to scan every document in the collection (aka table scan in SQL world) when you search for something and this 
really impacts on performance.
* All indexes entries will be ordered, so you must use a leftmost set of things
* Indexes come at a cost, they will slow down writes (because of the maintenance cost of the index) but will speed up 
your reads.
* You don't want to have indexes for every key in your collections
* An index in _id exists in all collections and can not be deleted
* The best way to know what indexes are created is through db.<collection>.getIndexes() in MongoDB shell
* You can create indexes in arrays using multikey indexes
* You can not create compound indexes with multikey indexes when both of the keys are arrays (this is to avoid 
cartesian product of elements inside each array)
* A regular index becomes a multikey index once we insert a document with one of the attributes as array (no matter 
the order)
* The $and operator in arrays doesn't guarantee that all the criteria will match inside the same element, they can 
match but in different elements. For this kind of comparison we must use $elemMatch
* When using complex queries, always check the explain
* Indexes are not unique by default, we must pass {unique: true} in order to create unique indexes
* Sparse option tells to the database to not include documents with missing a key (rightmost), otherwise we would 
violate the non-duplicated index
* Sparse indexes can not be used for sorting, instead the database uses a collection scan. This is because a spare 
index could miss documents
* Indexes can be created in foreground or background. Differences:
  * Foreground: default option, relatively fast, blocks readers and writers in the database
  * Background: slower, do not block readers and writers, you can create multiple background indexes in parallel
* Explain is used to know what the database will do with the data but it doesn't bring the data back
* In 3.0 you can pass find(), update(), etc, to explain but no insert() (there is no much to optimize there)
* db.example.explain() returns an explainable object and here we can use almost any query
* Explain modes:
  * queryPlanner: tells you what the db would use in terms of indexes
  * executionStats: it returns the execution stats for that query (includes queryPlanner)
  * allPlansExecution: runs the query optimizer that is run periodically by the database. It returns the execution 
  stats for all posible plans (incldues executionStats). It won't return all the information because once it realizes 
  that the query is not optimal it stops.
* When you see a lot of documents examined and fewer documents returned then the database is doing a lot of extra work
* It important that all queries have an index but also that all indexes are used by a query, otherwise we are wasting 
time maintaining them. The best balance is: all queries have an index and all indexes are being used
* Covered queries are queries that can be satisfied by indexes and 0 documents are inspected
* To achieve covered queries you probably must to project exactly what attributes you want to return, otherwise 
MongoDB won't know if it can satisfy the query and has to examine all documents. In other words, the index and the 
attributes returned by the query must be the same.
* To choose an index, MongoDB first select the candidates, then runs the query in parallel with each index and 
selects the fastest. This can be considered by reaching a goal state: returning all results or returning a threshold 
of results (sorted)
* MongoDB stores the winning query plan in cache for queries of that shape for future used until: threshold writes, 
index is rebuild, other indexes are added/deleted or mongod is restarted
* For performance reasons it's really important that indexes in the working set fit into memory, otherwise we lose 
the benefits of using indexes going regularly to disk to fetch the data
* stats() and totalIndexSize() give us information about the size of the indexes
* Depending on the type of index we will have different index cardinality. For regular indexes we will have 1:1, for 
sparse indexes <= num of docs and for multikey > num of docs
* MongoDB lets you create 2D geospatial indexes using '2d' as type of index.
* Full text search index will index every word in a document to allow you to do queries into the text like using $or 
operator.
* $meta: 'textScore' gives you the score of the text searching
* When designing indexes the goals is to make our read/write operations as efficient as possible. Some considerations 
to achieve this are:
  * Selectivity: minimize records scanned
  * How sorts are handled
* The primary factor that determines how efficiently an index can be used is the selectivity of the index
* If we want to support sort in an index, then we must to add the sort after the most selective part and before 
the ranged part. For example: (class_id, final_grade, student_id) for a 
find({class_id: 54, student_id: {$gt: 5000}}).sort({'final_grade': 1}). Equality fields, then sort fields and finally 
range fields
* If we want to sort on multiple fields, the direction of each field on which we want to sort in a query must be the 
same than the direction of each field specified in the index
* MongoDB automatically logs slow queries (>100ms) into the server log
* Profiler will log slow queries into system.profile
  * Level 0: off
  * Level 1: log slow queries
  * Level 2: log all queries (debug)
* mongotop lets you know where MongoDB is spending its time

## Chapter 5: Aggregation framework

*Summary*: Goals, the use of the pipeline, comparison with SQL facilities.

* MongoDB uses a pipeline for its aggregation framework. That pipeline has the following stages:
  * $project: reshape the document (selecting fields) (1:1)
  * $match: filter the document (n:1)
  * $group: aggregate with functions like sum, count, etc (n:1)
  * $sort: sort the documents (n:1)
  * $skip: skip a specific number of documents from the result set (n:1)
  * $limit: limit the output (n:1)
  * $unwind: normalize the data (for ex: flatting arrays into new documents) (1:n)
  * $out: handle the output (1:1)
* Other advanced stages to be check are:
  * $redact
  * $geonear
* The aggregation framework let you group by a single key ($group:{_id: "$manufacturer"}) but also by compounded keys 
(like $group:{_id: {manufacturer: "$manufacturer", category: "$category"}})
* In MongoDB, _id also can be a document, not just a scalar value
* $group can use the following expressions:
  * $sum: count (passing 1) or sum (passing the value)
  * $avg: get the average value across the documents
  * $min: get the minimum value
  * $max: get the maximum value
  * $push, $addToSet: push the value to an array
  * $first, $last: find the first or the last element. These expressions must be used after $sort, otherwise the 
  values will be arbitrary (or random)
* An aggregation stage can be applied several times in one single query
* $project reshapes the result set and you can:
  * Remove keys
  * Add new keys
  * Reshape keys
  * Use some simple functions ($toUpper, $toLower, $add, $multiply)
* $project won't include a key if you don't mention it, except for _id, which must be explicitly suppressed
* A key equals to 1, ```key: 1```, in $project will copy the key with the exact value in the source document
* A projection will indicate which fields must be added to the result set but it doesn't retain the order of those fields
* $match can be used for two things:
  * Pre aggregation filter
  * Filter the results
* $match (and $sort) can use indexes, but only if they are used at the beginning of the aggregation pipeline
* When searching in a full text search index, you don't need to specify the field because you can only have one full 
text index per collection
* In full text search, you can sort by the weight of the search using meta data: {score: {$meta: "textScore"}}
* $text operator can only be used if there is a full text search index in the collection
* $text operator is only allowed in a $match that is the first stage of the aggregation pipeline
* Aggregation framework supports both, disk and memory based sorting
* By default, the aggregation framework will try a sort in memory, considering the limit of 100MB for any given 
pipeline stage
* $sort can be done before or after the grouping stage
* It makes no sense to do a skip or limit of the result set if it is not sorted. First skip, then limit, in that 
order. In ```find```, the database does that automatically but in the aggregation framework doesn't
* $unwind let you flat the results of an array attribute, creating a new document with all the possible combinations
of each array value
* $push is the operator that lets you "reverse" the effects of an unwind
* Two $push in a row let you reverse a double $unwind
* $out let you redirect the output of an aggregation query into a new collection. But beware, because $out is 
destructive, it will overwrite the previous content of the collection (as long as you don't get errors). If you get 
errors during the $out, the previous collection is not touched (the renaming is done at the very end)
* In $out, you also must guarantee by yourself that every _id is unique
* Some of the aggregation options are:
  * explain: instead of running the aggregation, it will show you the query plan
  * allowDiskUse: it will allow the use of disk when the 100MB limit is reached (otherwise the aggregation will fail)
  * cursor: user cursors and cursor sizes
* In MongoDB 2.4 both, shell and python driver, returned a big document with all the result set but in MongoDB 2.6, 
the shell returns a cursor and python returns a big document or a cursor.
* To make python return a cursor, you must pass the {cursor=true} option
* Limitations of aggregation framework:
  * 100 MB limit for pipeline stages. Fixed with allowDiskUse: true
  * 16 MB limit by default in Python. Fixed with cursor={}
  * When doing group or sort in a sharding system, all the results will be sent to the primary shard to be collected 
  and processed. This can be mitigated using alternatives as Hadoop

## Chapter 6: Application Engineering

*Summary*: Drivers, impact of replication and Sharding on design and development.

* The w value indicates whether the driver has to wait for the write in memory or not and the j value indicates whether 
the driver has to wait until for the journal write in disk.
* The default is w=1 and j=false. This config is faster but let you with a small window of vulnerability (if the 
server crashes and the journal wasn't wrote you lose the data)
* Other option is w=1 and j=true. This is slower but completely safe. You can also decide to set w=0 but this is NOT 
recommended and it's called unack write because you don't have response from the driver.
* Previous setup is known as "write concern"
* To mitigate network errors you can use insert instead update (especially if the update is not idempotent, like $inc)
* You need, at minimum, 3 original nodes in order to assure a new primary election when a node goes down
* Types of replica set nodes:
  * Regular: Regular node, can become primary and can participate on elections
  * Arbiter: Just for voting purposes, it doesn't hold any data
  * Delayed/Regular: Disaster-recovery node. Set to a time behind the primary and can participate on election but can 
  not be elected as primary
  * Hidden: used for analytics, etc. Can't become primary but can participate on election
* During a failover, while a new primary is being elected, you can not write successfully
* MongoDB supports two types of write consistency:
  * Strong consistency: Reads are in sync respect to writes because reads and writes are done to the primary
  * Eventual consistency: Will happen when you write to the primary but read from the secondaries. You may not get the 
  same data but stale data, however you eventually will
* MongoDB doesn't let you read form a secondary by default. You have to use rs.slaveOk()
* Each replica node has an oplog, that is kept in sync by MongoDB, and secondaries are constantly reading the oplog 
of the primary to sync their data (secondaries can sync from another secondary too, as long as at least there is a 
chain of oplog syncs that lead back to the primary)
* The oplog lets you do interesting things like upgrades (running 3.0 and updating against an older secondary, etc)
* Oplog is a capped collection, so it will get rolled off every certain amount of time. This can be set depending on 
the data flow and speed
* Each server knows how far they are respect the primary thanks to the optime and optimedate and where to get their data
* oplog uses a statement-based approach that is independant from driver and MongoDB version
* If the server can't get the oplog then it has to read the entire database (this is much slower)
* On failover, if the oplog of the primary hasn't been replicated, that data will be rolled back when the server 
comes to the set again (as a secondary). It will be available on a set to apply it manually but it's too complicated 
most of times. To avoid this, w is set to "majority" to wait for the majority of the nodes have the data
* There is still a corner case where the data written with w=majority gets rolled back. If a failover occurs after the 
write has committed to the primary but before replication completes
* From pymongo, you can connect to a replica set doing nothing because pymongo connects by default to 127.0.0.1:27017 
and then it discovers all the other nodes. However, it's recommended to specify the whole list of nodes so pymongo 
knows where to look at if the default node is down
* The robust way to handling failover on inserts is to try the insert several times (let's say 3), checking for 
autoreconnect and duplicate key exception
* Write concern (w) value can be set at client, database or collection level but the client level is the recommended
* Writes that return errors to the client due to wtimeout may in fact succeed, but writes that return success, do in 
fact succeed
* Read preferences are:
  * Primary: always read from the primary
  * PrimaryPreferred: read from the primary but look for secondaries if the primary is not available
  * Secondary: rotate reads between secondaries (never read from primary)
  * SecondaryPreferred: read from secondaries but look for primary if there are no secondaries available
  * Nearest: read from the nearest node (<= 15ms)
* Implications of replication:
  * Seed lists: drivers need to know at least one member of the replica set
  * Write concerns (w, j, wtimeout): Understand how the writes work and how much do you have to wait for a write
  * Read preferences: decide where do you want to read from
  * Errors can happen: Even though replication exists, error can always happen
* Sharding is the way to handle scaling out using a range-based or hash-based approach to distribute data across shards
* For production, it's always recommended to use three servers for configuration
* For query, you may specify the shard key. If you don't, the query will be performed by all nodes
* For update, it's illegal to try an update/insert without the shard key because the database wouldn't know where to 
put that record
* Implications of sharding:
  * Every document has to include the shard key
  * Shard key is immutable
  * You need an index that starts with the shard key
  * When updating you have to specify the shard key or multi=true to send the update to all of the
  * No shard key specified means scatter gather (expensive)
  * No unique key unless is part of the shard key because there is no collective way for the database to determine the 
  uniqueness of that index
* Write concerns (w, j, wtimeout) applies in the same way for sharding environments
* To choose a shard key you must consider:
  * Sufficient cardinality means sufficient variety of values
  * Avoid shard keys that increase monotonically (like _ids) because this creates hotspots and unbalance the shard
  * A key that gives you high parallelism is a good choice for shard key
* You can't choose an array as shard key because it needs a multi key index
