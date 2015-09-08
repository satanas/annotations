
import pymongo
import sys
import random
import string
import datetime

# establish a connection to the database
connection = pymongo.Connection("mongodb://localhost", safe=True)

# get a handle to the blog database
db=connection.blog
posts = db.posts

lorum = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"

# creates a short list of posts
def build_posts():
    
    gettysburg_address = open("getty.txt").read()
    declaration_independence = open("decl.txt").read()
    us_constitution = open("constitution.txt").read()
    bill_of_rights = open("billofrights.txt").read()

    topics = [{'title':"Gettysburg Address", 'text': gettysburg_address},
              {'title':"Declaration of Independence", 'text': declaration_independence},
              {'title':"US Constitution", 'text': us_constitution},
              {'title':"Bill of Rights", 'text': bill_of_rights}]

    return topics


def make_post(topics):
    return topics[random.randint(0, len(topics)-1)]

# makes a little salt
def make_salt(n):
    salt = ""
    for i in range(n):
        salt = salt + random.choice(string.ascii_letters)
    return salt

# reads in a list of commenter names
def read_in_names():
    names = []
    f = open("names.txt")
    for name in f:
        names.append(name.rstrip())
    return names

# read in list of nouns for tags
def read_in_tags():
    tags = []
    f = open("nounlist.txt")
    for tag in f:
        tags.append(tag.rstrip())
    return tags

def random_email():
    email = make_salt(8) + "@" + make_salt(8) + ".com"
    return email

# will build a list of n comments with a random author name
def build_comments(n, authors):
    comments = []
    for i in range(n):
        comment = {'author':authors[random.randint(0,len(authors)-1)], 'body': lorum, 'email': random_email()}
        comments.append(comment)

    return comments

# builds an array of n tags and assures no dups
def build_tags(n, tags_master):
    if n > len(tags_master):
        n = len(tags_master)               # you can only have as many as we have in the master
            
    tags = []
    for i in range(n):
        # search until we find a unique tag
        found = False
        while (not found): 
            candidate = tags_master[random.randint(0,len(tags_master)-1)]
            if (candidate not in tags):
                tags.append(candidate)
                found = True

    return tags
                  
def main(argv):

    authors_master = read_in_names()
    tags_master = read_in_tags()
    topics = build_posts()

    for i in range(0,1000):
        post = {}
        post['author'] = "machine"
        post['permalink'] = make_salt(20).lower()
        post['tags'] = build_tags(10, tags_master)
        post['comments'] = build_comments(50, authors_master)
        stuff = make_post(topics)
        post['body'] = stuff['text']
        post['title'] = stuff['title']
        post['date'] = datetime.datetime.utcnow()
        try:
            posts.insert(post)

        except:
            print "Unexpected error:", sys.exc_info()[0]


if __name__ == "__main__":
    main(sys.argv[1:])
