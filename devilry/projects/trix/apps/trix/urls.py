from django.conf.urls.defaults import patterns, url
from django.contrib.auth.decorators import login_required

from restful import trix_manager
import views

urlpatterns = patterns('devilry.projects.dev.apps.trix',
    url(r'^$', views.main, name='trix'),
    url(r'^profile$', views.profile, name='profile'),
    url(r'^exercise/(?P<exercise>\d+)/status$',
        views.exercisestatus, name='exercisestatus'),
    url(r'^trixadmin/$', views.administrator, name='trixadmin'),
    url(r'^topic/(?P<topic_id>\d+)$',
        views.main, name='topicview'),
    url(r'^period/(?P<period_id>\d+)$',
        views.main, name='periodview'),)
urlpatterns += trix_manager
