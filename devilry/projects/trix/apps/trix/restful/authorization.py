from devilry.restful import ModelRestfulView
from django.conf.urls.defaults import url

class AuthorizationMixin(ModelRestfulView):

    @classmethod
    def create_rest_url(cls):
        return url(r'^{urlprefix}/(?P<id>[a-zA-Z0-9]+)?$'.format(urlprefix=cls._meta.urlprefix),
                   cls.as_view(),
                   name=cls._meta.urlname)
