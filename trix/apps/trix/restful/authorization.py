from devilry.restful import ModelRestfulView
from django.conf.urls.defaults import url

class AuthorizationMixin(ModelRestfulView):
    """
    :class:`AuthorizationMixin` makes it possible to view models
    even if one is not logged in. This requires that models have
    strict settings for who may create, edit or delete them.
    """

    @classmethod
    def create_rest_url(cls):
        """
        Overridden to remove the call to
        :func:`forbidden_if_not_authenticated`.
        """
        return url(r'^{urlprefix}/(?P<id>[a-zA-Z0-9]+)?$'.format(urlprefix=cls._meta.urlprefix),
                   cls.as_view(),
                   name=cls._meta.urlname)
