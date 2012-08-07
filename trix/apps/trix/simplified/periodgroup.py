from django.contrib.auth.models import User
from trix.apps.trix.models import PeriodGroup, Period
from devilry.simplified import FieldSpec, simplified_modelapi, SimplifiedModelApi, FilterSpecs, FilterSpec
from authorization import AuthorizationMixin
from fakefieldcleaner import fakefieldcleaner

@fakefieldcleaner
@simplified_modelapi
class SimplifiedPeriodGroup(AuthorizationMixin):
    """ Simplified wrapper for :class: `trix.apps.trix.PeriodGroup`. """
    class Meta(object):
        model = PeriodGroup
        methods = ['create', 'read', 'update', 'delete', 'search']
        searchfields = FieldSpec('long_name', 'subject__long_name', 'periods__long_name')
        resultfields = FieldSpec('id', 'long_name', 'subject', 'subject__long_name', 'periods__id',
                                 periods=['periods__short_name', 'periods__long_name'])
        fake_editablefields = ('fake_periods', 'fake_followers', 'fake_students')
        fake_real_map = {'fake_periods': ('periods', Period)}
        filters = FilterSpecs(FilterSpec('followers__id'))
