from devilry.coreutils.simplified.metabases import SimplifiedPeriodMetaMixin
from devilry.simplified import (FieldSpec, FilterSpec, FilterSpecs, intOrNoneConverter,
                                simplified_modelapi, SimplifiedModelApi)
from trix.apps.trix.models import Period
from authorization import AuthorizationMixin

@simplified_modelapi
class SimplifiedPeriod(AuthorizationMixin):
    class Meta(SimplifiedPeriodMetaMixin):
        model = Period
        methods = ['create', 'read', 'update', 'delete', 'search']
        resultfields = FieldSpec('id', 'parentnode', 'short_name', 'long_name', 'start_time', 'end_time',
                                 'group', 'period_ptr',
                                 subject=['parentnode__short_name', 'parentnode__long_name'])
        searchfields = FieldSpec('short_name',
                                 'long_name',
                                 'parentnode__short_name',
                                 'parentnode__long_name')
        filters = FilterSpecs(FilterSpec('short_name'), FilterSpec('group', type_converter=intOrNoneConverter))
