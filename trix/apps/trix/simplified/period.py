from devilry.coreutils.simplified.metabases import SimplifiedPeriodMetaMixin
from devilry.simplified import FieldSpec, simplified_modelapi, SimplifiedModelApi
from devilry.apps.core.models import Period
from authorization import AuthorizationMixin

@simplified_modelapi
class SimplifiedPeriod(AuthorizationMixin):
    class Meta(SimplifiedPeriodMetaMixin):
        model = Period
        methods = ['create', 'read', 'update', 'delete', 'search']
        resultfields = FieldSpec('id', 'parentnode', 'short_name', 'long_name', 'start_time', 'end_time',
                                 subject=['parentnode__short_name', 'parentnode__long_name'])
        searchfields = FieldSpec('short_name',
                                 'long_name',
                                 'parentnode__short_name',
                                 'parentnode__long_name')
    
