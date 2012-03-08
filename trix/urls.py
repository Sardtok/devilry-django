from django.conf.urls.defaults import patterns, include
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.core.urlresolvers import reverse
from django.shortcuts import redirect
from django.views.generic import View

from devilry.apps.core import pluginloader
from devilry.defaults.urls import devilry_urls

js_info_dict = {
    'domain': 'djangojs',
    'packages': ('trix',),
}

class RedirectToFrontpage(View):
    def get(self, request):
        return redirect(reverse('trix'))


urlpatterns = patterns('',
                       # Custom urls for this project
                       (r'^trix/', include('trix.apps.trix.urls')),
                       (r'^$', RedirectToFrontpage.as_view()),
                       (r'^jsi18n/$', 'django.views.i18n.javascript_catalog', js_info_dict),
                       # Add the default Devilry urls
                       *devilry_urls
) + staticfiles_urlpatterns()

# Must be after url-loading to allow plugins to use reverse()
pluginloader.autodiscover()
