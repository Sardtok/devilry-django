from django.conf.urls.defaults import patterns, url
from django.contrib.auth.decorators import login_required

from restful import trix_manager
import views

urlpatterns = patterns('devilry.projects.dev.apps.trix',
    url(r'^$', views.main, name='trix'),
    url(r'^profile$', views.profile, name='profile'),
    url(r'^exercise/(?P<exercise>\d+)/status$',
        views.exercisestatus, name='exercisestatus'),)
urlpatterns += trix_manager
print trix_manager
