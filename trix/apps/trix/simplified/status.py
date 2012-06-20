from trix.apps.trix.models import Status
from devilry.simplified import FieldSpec, simplified_modelapi, SimplifiedModelApi
from authorization import AuthorizationMixin

@simplified_modelapi
class SimplifiedStatus(AuthorizationMixin):
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

