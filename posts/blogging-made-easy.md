<!--
.. title: Blogging with IPython Notebooks
.. slug: blogging-made-easy
.. date: 2014-10-01 15:08:31 UTC-07:00
.. tags: nikola, python, setup
.. link:
.. description: Blogging with IPython Notebooks
.. type: text
-->

If you are tech geek and want to blog, Static web pages hosted on github or S3 for free to low cost seemed the right approach.  Writing blogs using Markdown offers the right combination of fun, ease of use and flexibility.  I can even add `code` in my blog without HTML markup cluttering my content.  No wonder Jekell / Octopress is very popular amoung tech geeks writing blogs and hosting in github / S3.

I use Python a lot and really love IPython Notebooks.  I would like write my blogs in IPython notebooks and publish them.  This basically came down to two choices - Pelican and Nikola.  Both are static blog generator and have integration with IPython notebooks.  In this post, I try to rationale, why I choose Nikola and how you can set it up and start blogging using IPython Notebooks.

<!-- TEASER_END -->

## Pelican vs Nikola

Pelican is more popular than Nikola and has a huge eco-system of [themes](http://www.pelicanthemes.com/). But the integration with IPython seems bit hacky and doesn't work with the most recent update of markdown python package.  See this [blog post by Jake VanderPlas](http://jakevdp.github.io/blog/2013/12/05/static-interactive-widgets/).  If IPython integration is not a deal breaker, Pelican is a good choice.

I choose Nikola, because of easy integration with IPython Notebook.  You can follow the steps here or see [Damian Avila's blog posts](http://www.damian.oquanta.info/index.html).  I used Damian's blog posts and his zen-ipython theme to build this blog.

#### Setting up local system

Change to the directory you want to create the blog in local system.
First, let's setup a new virtual environment for blog post and activate the virutal environment.  I used Python 3 / pyvenv for this blog.  Alternatively, you can use conda to setup your environment.

```
pyvenv env3
source env3/bin/activate
```

Now that the virtual environment is active, Let's install nikola (static web page generator), requests, markdown and IPython libraries

```
pip install nikola requests markdown webassets ipython[notebook]
```

#### Creating blog

* Create the blog by - `nikola init myblogsite`

* cd into the new blog directory - `cd myblogsite`

* All commands will be entered inside the directory - `nikola help`

* More information at [Nikola](http://nikola.readthedocs.org/)


#### Modifying Configuration file

* Update `conf.py` to add Markdown and IPython as valid blog formats.
```
POSTS = (
    ("posts/*.md", "posts", "post.tmpl"),
    ("posts/*.ipynb", "posts", "post.tmpl"),
    ("posts/*.txt", "posts", "post.tmpl"),
    ("posts/*.rst", "posts", "post.tmpl"),
)
PAGES = (
    ("stories/*.md", "stories", "story.tmpl"),
    ("stories/*.ipynb", "stories", "story.tmpl"),
    ("stories/*.txt", "stories", "story.tmpl"),
    ("stories/*.rst", "stories", "story.tmpl"),
)
```

* Set Teaser to True to show only partial content on Index Page with Read More link -

```
# Show only teasers in the index pages? Defaults to False.
INDEX_TEASERS = True
```

* Update COMMENT_SYSTEM to use disqus or another comments engine to the blog

* Update License and Footer to give credits


#### Creating Blog Posts

To create a new blog post by -

* Typing `nikola new_post` in the terminal at the top level folder of your blog.  This might create a post with rST / text format.
* To use Markdown, create the blog post using `nikola new_post -f markdown`
* To use rST format, use - `nikola new_post -f rest`
* Most importantly, to use IPython Notebook for the blog post, create using, `nikola new_post -f ipynb`

It's that simple to create blog posts from IPython Notebooks.

To create a page like about-me by - `nikola new_story`.  The format can be specified ysing `-f format`, similar to the syntax for creating blog posts.


### Installing Themes

To install / checkout themes that are bundled with nikola,  `nikola install_theme -l`.  For this blog, I used zen-ipython theme by Damien.  To do that, run `nikola install_theme zen-ipython` from the main folder of the blog.

Verify that `conf.py` is updated with the theme -

```
# Name of the theme to use.
THEME = "zen-ipython"
```


#### Build / Serve

* To build the static pages - `nikola build`

* To test on local machine, `nikola serve`.  To serve on local machine, `nikola serve --port 8080` or any other port number.

#### Publishing

* Github: To publish to github pages, follow the [instructions](https://pages.github.com/). Nikola has some nice integration with github pages.  [Read the docs](http://nikola.readthedocs.org/en/latest/).  You may just have to do `nikola deploy`

I have following in `conf.py` to push to master and publish the output html to gh-pages.  All I do is `nikola deploy` and it's done for me.  Note that you still need to do `nikola build` to create the output html files before running deploy command.

```
DEPLOY_COMMANDS = ["git add .",
                   "git commit -am 'Update'",
                   "git push origin master",
                   "git subtree split --prefix output -b gh-pages",
                   "git push -f origin gh-pages:gh-pages",
                   "git branch -D gh-pages"]
```


* S3: Publishing blog to [AWS S3](http://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html) is little bit more involved.  I believe Nikola has some integration with S3 as well, but I have not tried it.



