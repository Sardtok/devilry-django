from django.conf.urls.defaults import patterns, url
from django.contrib.auth.decorators import login_required

from devilry.apps.authenticate.views import logout

from restful import trix_manager
import views

urlpatterns = patterns('devilry.projects.dev.apps.trix',
    url(r'^$', views.main, name='trix'),
    url(r'^logout/$', logout, name='trix-logout'),
    url(r'^profile/$', views.profile, name='profile'),
    url(r'^exercise/(?P<exercise>\d+)/status$',
        views.exercisestatus, name='exercisestatus'),
    url(r'^trixadmin/$', views.administrator, name='trixadmin'),
    url(r'^trixadmin/period/(?P<period_id>\d+)$', views.periodadmin, name='trixperiodadmin'),
    url(r'^trixadmin/periodgroup/(?P<periodgroup_id>\d+)$', views.periodgroupadmin, name='trixperiodgroupadmin'),
    url(r'^trixadmin/exercise/(?P<exercise_id>\d+)$', views.exerciseadmin, name='trixexerciseadmin'),
    url(r'^trixadmin/topic/(?P<topic_id>\d+)$', views.topicadmin, name='trixtopicadmin'),
    url(r'^topic/(?P<topic_id>\d+)$',
        views.main, name='topicview'),
    url(r'^exercise/(?P<exercise_id>\d+)$',
        views.main, name='exerciseview'),
    url(r'^period/(?P<period_id>\d+)$',
        views.main, name='periodview'),)
urlpatterns += trix_manager
