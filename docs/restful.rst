.. _restful:


==========================================
Low level RESTful web service API
==========================================

.. currentmodule:: devilry.restful

http://en.wikipedia.org/wiki/Representational_State_Transfer#RESTful_web_services

This API was first introduced in this `github issue <https://github.com/devilry/devilry-django/issues/93>`_


Tutorial
########

For this tutorial, create the *myexample* django application. You can see the
result of everything we explain here in
``devilry/projects/dev/apps/restfulexample/``.


A simple RESTful example
------------------------

We will start with a creating a CRUD+s (create, read, update, delete and
search) interface. ``restfulexample/restful.py``:

.. literalinclude:: /../devilry/projects/dev/apps/restfulexample/restful.py

``@example_restful`` is a :class:`RestfulManager` where we register our ``RestfulExample``. The RestfulManager
is only used to simplify setting up URLs for big restful APIs.

Read, update and delete requires an identifier (``id``), because it makes no sense
to manipulate an object that we can not identify. Each method returns a :class:`SerializableResult`,
whose first argument is a serializable python object. The default serializer is
JSON, which means that our class returns JSON unless the HTTP request contains a
*HTTP Accept header* specifying another content type.


Registering urls for RestfulExample
-----------------------------------

Since we use a :class:`RestfulManager`, URL generation is very simple. ``restfulexample/urls.py`` looks like this:

.. literalinclude:: /../devilry/projects/dev/apps/restfulexample/urls.py



API
###

.. automodule:: devilry.restful
