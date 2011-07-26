from django.conf.urls.defaults import patterns, include
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.core.urlresolvers import reverse
from django.shortcuts import redirect
from django.views.generic import View

from devilry.apps.core import pluginloader
from devilry.defaults.urls import devilry_urls


class RedirectToFrontpage(View):
    def get(self, request):
        return redirect(reverse('administrator'))


urlpatterns = patterns('',
                       # Custom urls for this project
                       (r'^trix/', include('devilry.projects.dev.apps.trix.urls')),
                       (r'^$', RedirectToFrontpage.as_view()),

                       # Add the default Devilry urls
                       *devilry_urls
) + staticfiles_urlpatterns()

# Must be after url-loading to allow plugins to use reverse()
pluginloader.autodiscover()
