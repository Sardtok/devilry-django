from ..models import Topic
from devilry.simplified import FieldSpec, simplified_modelapi
from authorization import AuthorizationMixin

@simplified_modelapi
class SimplifiedTopic(AuthorizationMixin):
    """ Simplified wrapper for :class:`trix.apps.trix.models.Topic`. """
    class Meta(object):
        model = Topic
        resultfields = FieldSpec('id',
                                 'name',
                                 )
        searchfields = FieldSpec('name')
        methods = ['create', 'read', 'update', 'delete', 'search']

