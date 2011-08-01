from ...models import Status
from devilry.simplified import FieldSpec, simplified_modelapi, SimplifiedModelApi

@simplified_modelapi
class SimplifiedStatus(object):
    """ Simplified wrapper for :class:`trix.apps.trix.models.Status`. """
    class Meta(object):
        model = Status
        resultfields = FieldSpec('id',
                                 'name',
                                 'active',
                                 'percentage',
                                 )
        searchfields = FieldSpec('name',
                                 'active')
        methods = ['read', 'search']
