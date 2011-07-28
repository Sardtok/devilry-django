from django.conf.urls.defaults import patterns, url
from django.contrib.auth.decorators import login_required

import views

urlpatterns = patterns('devilry.projects.dev.apps.trix',
    url(r'^$', views.main, name='trix'),
    url(r'^profile$', views.profile, name='profile'),)
