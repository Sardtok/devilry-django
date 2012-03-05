from devilry.simplified import (FieldSpec, FilterSpecs, simplified_modelapi,
                                FilterSpec, PatternFilterSpec,
                                SimplifiedModelApi)
from authorization import AuthorizationMixin
from devilry.apps.core import models

@simplified_modelapi
class SimplifiedNode(AuthorizationMixin):
    class Meta():
        model = models.Node
        resultfields = FieldSpec('id',
                                 'parentnode',
                                 'short_name',
                                 'long_name',
                                 admins=['admins__username'])
        searchfields = FieldSpec('short_name',
                                 'long_name')
        filters = FilterSpecs(FilterSpec('parentnode'),
                              FilterSpec('short_name'),
                              FilterSpec('long_name'),
                              PatternFilterSpec('^(parentnode__)+short_name$'),
                              PatternFilterSpec('^(parentnode__)+long_name$'),
                              PatternFilterSpec('^(parentnode__)+id$'))
        methods = ['create', 'read', 'update', 'delete', 'search']
    
